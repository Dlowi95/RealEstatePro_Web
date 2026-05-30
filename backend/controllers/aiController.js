const Groq = require("groq-sdk");
const Property = require("../models/Property");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const stripHTML = (htmlString) => {
  if (!htmlString) return "";
  return htmlString
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const chatAssistant = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập tin nhắn." });
    }

    const [propertiesFromDB, areaStats] = await Promise.all([
      Property.find({ status: "approved" })
        .sort({ createdAt: -1 })
        .limit(10) 
        .select("_id title type price area location description")
        .lean(),
      Property.aggregate([
        { $match: { status: "approved" } },
        { $group: { _id: "$location.province", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    const propertyContext = propertiesFromDB
      .map((p) => {
        const locationStr = `${p.location?.address || ""}, ${p.location?.ward || "Chưa cập nhật"}, ${p.location?.province || ""}`;
        const cleanDesc = stripHTML(p.description);
        const shortDesc = cleanDesc.length > 150 ? cleanDesc.substring(0, 150) + "..." : cleanDesc;
        const typeStr = p.type === "Buy" ? "Bán" : "Cho thuê";
        
        
        return `- ${p.title} | Đường dẫn xem chi tiết: /properties/${p._id} | ${typeStr} | Giá: ${p.price?.toLocaleString("vi-VN")} VNĐ | Diện tích: ${p.area}m² | Địa chỉ: ${locationStr} | Mô tả: ${shortDesc}`;
      })
      .join("\n");

    const statsContext = areaStats
      .map((stat) => `- Khu vực ${stat._id || "Không rõ"}: ${stat.count} tin đăng`)
      .join("\n");

    const systemInstruction = `Bạn là Trợ lý ảo thông minh của sàn bất động sản RealEstatePro.

NHIỆM VỤ:
1. TƯ VẤN TÌM KIẾM: Dựa vào "DANH SÁCH BẤT ĐỘNG SẢN" dưới đây để gợi ý sản phẩm phù hợp cho khách. Nếu khách hỏi thông tin không có trong danh sách, hãy báo là hiện tại chưa có dữ liệu và mời họ xem các tin khác.
2. THỐNG KÊ HỆ THỐNG: Dựa vào "THỐNG KÊ TIN ĐĂNG THEO KHU VỰC" để trả lời câu hỏi về số lượng nhà đất ở các tỉnh/thành.

THỐNG KÊ TIN ĐĂNG THEO KHU VỰC (Từ nhiều nhất đến ít nhất):
${statsContext}

DANH SÁCH BẤT ĐỘNG SẢN NỔI BẬT ĐANG CÓ:
${propertyContext}

LƯU Ý QUAN TRỌNG:
- Trả lời thân thiện, lịch sự, ngắn gọn và súc tích bằng tiếng Việt.
- TUYỆT ĐỐI KHÔNG SỬ DỤNG mã HTML (như <div>, <p>...). CHỈ dùng Markdown cơ bản (in đậm **, gạch đầu dòng -).
- SỬ SỬA TẠI ĐÂY (CẤM AI IN ID THÔ): Tuyệt đối KHÔNG tự ý hiển thị mã ID dưới dạng chuỗi thô (như 6a1536...) ra màn hình chat vì nhìn rất mất thẩm mỹ.
- HƯỚNG DẪN CHÈN LINK: Khi gợi ý bất động sản cho khách, hãy luôn gắn link Markdown trực tiếp vào TÊN của bất động sản đó theo cấu trúc: [Tên bất động sản](Đường dẫn xem chi tiết). 
  Ví dụ cụ thể: Nếu giới thiệu căn hộ, hãy trả về dạng: Bạn có thể tham khảo **[Dinh thự The Rivus Elie Saab](/properties/6a15367986f4032ffdd2378e)** với mức giá...
- Nếu câu hỏi KHÔNG liên quan đến bất động sản, nhà đất, hoặc hệ thống RealEstatePro, hãy lịch sự từ chối và hướng khách hàng về chủ đề nhà đất.`;

    const formattedMessages = [
      { role: "system", content: systemInstruction },
      ...(history || []).map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text || "",
      })),
      { role: "user", content: message },
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: formattedMessages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.3, 
      max_tokens: 1000,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "";

    res.status(200).json({
      success: true,
      reply: responseText,
    });
  } catch (error) {
    console.error("Chatbot AI Error:", error.message || error);
    res.status(500).json({
      success: false,
      message: "Trợ lý AI đang bận xử lý, bạn thử lại sau nhé!",
    });
  }
};

module.exports = {
  chatAssistant,
};