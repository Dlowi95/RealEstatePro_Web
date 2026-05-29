const { GoogleGenerativeAI } = require("@google/generative-ai");
const Property = require("../models/Property");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    const [propertiesFromDB, areaStats] = await Promise.all([
      Property.find({ status: "approved" })
        .sort({ createdAt: -1 })
        .limit(10)
        .select("_id title propertyType price area location description")
        .lean(),
      Property.aggregate([
        { $match: { status: "approved" } },
        { $group: { _id: "$location.province", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    const propertyContext = propertiesFromDB
      .map((p) => {
        const locationStr = `${p.location.address}, ${p.location.ward || "Chưa cập nhật"}, ${p.location.province}`;
        const cleanDesc = stripHTML(p.description);
        const shortDesc =
          cleanDesc.length > 150
            ? cleanDesc.substring(0, 150) + "..."
            : cleanDesc;

        return `- [ID: ${p._id}] ${p.title} | ${p.propertyType} | ${p.price.toLocaleString("vi-VN")} VNĐ | Diện tích: ${p.area}m² | Địa chỉ: ${locationStr} | Mô tả ngắn: ${shortDesc}`;
      })
      .join("\n");

    const statsContext = areaStats
      .map(
        (stat) =>
          `- Tỉnh/Thành phố: ${stat._id || "Không rõ"} có ${stat.count} tin đăng`,
      )
      .join("\n");

    const systemInstruction = `Bạn là Trợ lý ảo thông minh của sàn bất động sản RealEstatePro.

NHIỆM VỤ:
1. TƯ VẤN TÌM KIẾM: Dựa vào "DANH SÁCH BẤT ĐỘNG SẢN" để gợi ý sản phẩm phù hợp.
2. THỐNG KÊ HỆ THỐNG: Khi khách hàng hỏi về nơi có nhiều nhà đất nhất hoặc số lượng tin theo khu vực, hãy dùng dữ liệu từ "THỐNG KÊ TIN ĐĂNG THEO KHU VỰC" để trả lời chính xác địa danh nào đang chiếm số lượng nhiều nhất.

THỐNG KÊ TIN ĐĂNG THEO KHU VỰC (Sắp xếp từ nhiều nhất đến ít nhất):
${statsContext}

DANH SÁCH BẤT ĐỘNG SẢN ĐANG CÓ TRÊN HỆ THỐNG:
${propertyContext}

LƯU Ý KHI TRẢ LỜI:
- Trả lời thân thiện, lịch sự bằng tiếng Việt, định dạng Markdown ngắn gọn, súc tích.
- TUYỆT ĐỐI KHÔNG SỬ DỤNG bất kỳ code HTML nào (như <div>, <p>, <strong>...) trong câu trả lời.
- CHỈ SỬ DỤNG Markdown cơ bản (dấu ** để in đậm, dấu - để tạo danh sách).`;

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: systemInstruction,
    });

    const validHistory = (history || []).filter((msg, index) => {
      if (index === 0 && msg.sender !== "user") {
        return false;
      }
      return true;
    });

    const formattedHistory = validHistory.map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    res.status(200).json({
      success: true,
      reply: responseText,
    });
  } catch (error) {
    console.error("Chatbot AI Error:", error);
    res.status(500).json({
      success: false,
      message: "Trợ lý AI đang bận xử lý, bạn thử lại sau nhé!",
    });
  }
};

module.exports = {
  chatAssistant,
};
