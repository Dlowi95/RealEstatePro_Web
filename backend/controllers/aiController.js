const Groq = require("groq-sdk");
const Property = require("../models/Property");

// Khởi tạo Groq AI bằng API Key lấy từ biến môi trường
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Hàm làm sạch HTML an toàn (Lọc bỏ thẻ div, p, span... để AI đọc dễ hơn)
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

    // Kiểm tra tin nhắn đầu vào
    if (!message) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập tin nhắn." });
    }

    // Lấy dữ liệu thực tế từ DB (Chạy song song bằng Promise.all cho tốc độ xử lý nhanh nhất)
    const [propertiesFromDB, areaStats] = await Promise.all([
      Property.find({ status: "approved" })
        .sort({ createdAt: -1 })
        .limit(10) // Lấy 10 tin mới nhất nạp vào não AI
        .select("_id title type price area location description")
        .lean(),
      Property.aggregate([
        { $match: { status: "approved" } },
        { $group: { _id: "$location.province", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    // Format Context Bất Động Sản thành chuỗi văn bản cho AI dễ hiểu
    const propertyContext = propertiesFromDB
      .map((p) => {
        const locationStr = `${p.location?.address || ""}, ${p.location?.ward || "Chưa cập nhật"}, ${p.location?.province || ""}`;
        const cleanDesc = stripHTML(p.description);
        const shortDesc = cleanDesc.length > 150 ? cleanDesc.substring(0, 150) + "..." : cleanDesc;
        const typeStr = p.type === "Buy" ? "Bán" : "Cho thuê";
        
        return `- [ID: ${p._id}] ${p.title} | ${typeStr} | Giá: ${p.price?.toLocaleString("vi-VN")} VNĐ | Diện tích: ${p.area}m² | Địa chỉ: ${locationStr} | Mô tả: ${shortDesc}`;
      })
      .join("\n");

    // Format Context Thống kê 
    const statsContext = areaStats
      .map((stat) => `- Khu vực ${stat._id || "Không rõ"}: ${stat.count} tin đăng`)
      .join("\n");

    // Lời thỉnh cầu (System Prompt - Dạy cho AI biết nó là ai và phải làm gì)
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
- Có thể cung cấp ID hoặc trích dẫn tiêu đề để khách dễ tìm.
- Nếu câu hỏi KHÔNG liên quan đến bất động sản, nhà đất, hoặc hệ thống RealEstatePro, hãy lịch sự từ chối và hướng khách hàng về chủ đề nhà đất.`;

    // Format lịch sử chat theo đúng cấu trúc cực kỳ dễ chịu của Groq (Vai trò: system, user, assistant)
    const formattedMessages = [
      { role: "system", content: systemInstruction },
      ...(history || []).map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text || "",
      })),
      { role: "user", content: message },
    ];

    // Gửi request lên Groq AI bằng model Llama 3.3 70B (Bản xịn nhất, nhanh nhất)
    const chatCompletion = await groq.chat.completions.create({
      messages: formattedMessages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.3, // Nhiệt độ thấp = Ép AI trả lời chuẩn xác theo data, không chém gió
      max_tokens: 1000,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "";

    // Phản hồi về cho Frontend
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