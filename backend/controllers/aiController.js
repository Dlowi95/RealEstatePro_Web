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
        
        return `- Tên bất động sản: "${p.title}" | Hình thức: ${typeStr} | Giá: ${p.price?.toLocaleString("vi-VN")} VNĐ | Diện tích: ${p.area}m² | Địa chỉ: ${locationStr} | Mô tả ngắn: ${shortDesc}`;
      })
      .join("\n");

    const statsContext = areaStats
      .map((stat) => `- Khu vực ${stat._id || "Không rõ"}: ${stat.count} tin đăng`)
      .join("\n");

    const systemInstruction = `Bạn là một Chuyên viên tư vấn bất động sản chuyên nghiệp, am hiểu thị trường và cực kỳ thân thiện của sàn giao dịch RealEstatePro.

NHIỆM VỤ CỦA BẠN:
1. TƯ VẤN SẢN PHẨM: Dựa hoàn toàn vào dữ liệu mục "DANH SÁCH BẤT ĐỘNG SẢN NỔI BẬT" để giới thiệu sản phẩm phù hợp nhất cho khách hàng.
2. THỐNG KÊ HỆ THỐNG: Dựa vào thông tin "THỐNG KÊ TIN ĐĂNG THEO KHU VỰC" để giải đáp số lượng nhà đất ở các tỉnh/thành khi khách hỏi.

THỐNG KÊ TIN ĐĂNG THEO KHU VỰC (Từ nhiều nhất đến ít nhất):
${statsContext}

DANH SÁCH BẤT ĐỘNG SẢN NỔI BẬT ĐANG CÓ TRÊN HỆ THỐNG:
${propertyContext}

QUY TẮC PHÁT NGÔN BẮT BUỘC ĐỂ ĐI BÁO CÁO (VI PHẠM SẼ BỊ TRỪ ĐIỂM):
- Phải trả lời bằng tiếng Việt lịch sự, văn phong ngắn gọn, tập trung thẳng vào câu hỏi của khách.
- TUYỆT ĐỐI KHÔNG sử dụng các cú pháp tạo liên kết Markdown dạng [Tên](Đường dẫn) hay hiển thị bất kỳ chuỗi mã ID kỹ thuật nào ra khung chat.
- TUYỆT ĐỐI KHÔNG để lộ các ký tự đường dẫn hệ thống như "/properties/...". Hãy gọi tên nhà đất một cách tự nhiên bằng cách đặt tên bất động sản trong dấu ngoặc kép.
  * Ví dụ chuẩn: "Hiện tại hệ thống đang có căn '${propertiesFromDB[0]?.title || "Biệt thự cổ thời Pháp"}' với mức giá..."
- Nếu khách hàng hỏi các chủ đề nằm ngoài lĩnh vực bất động sản, phong thủy hoặc không liên quan đến RealEstatePro, hãy lịch sự từ chối và hướng họ quay lại câu hỏi nhà đất.`;

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
      temperature: 0.1,
      max_tokens: 800,
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