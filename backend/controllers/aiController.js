const { GoogleGenerativeAI } = require("@google/generative-ai");
const Property = require("../models/Property");

// Khởi tạo AI SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Hàm làm sạch HTML an toàn
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

    // Lấy dữ liệu từ DB (Chạy song song bằng Promise.all cho tốc độ nhanh nhất)
    const [propertiesFromDB, areaStats] = await Promise.all([
      Property.find({ status: "approved" })
        .sort({ createdAt: -1 })
        .limit(10) // Lấy 10 tin mới nhất để làm Context
        .select("_id title type price area location description")
        .lean(),
      Property.aggregate([
        { $match: { status: "approved" } },
        { $group: { _id: "$location.province", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    // Format Context Bất Động Sản
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

    // System Instruction (Prompt định hướng nhân cách và luật lệ)
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

    // Sử dụng model gemini-1.5-flash (Ổn định, nhanh, tối ưu nhất cho Production)
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
    });

    // Cấu hình kiểm soát nhiệt độ (Ép bot bám sát dữ liệu thật, không "ảo giác" tự bịa nhà đất)
    const generationConfig = {
      temperature: 0.3,
      maxOutputTokens: 1000,
    };

    // --- XỬ LÝ LỊCH SỬ CHAT CHUẨN FORM API GEMINI ---
    let formattedHistory = [];
    if (Array.isArray(history) && history.length > 0) {
      // 1. Chuyển đổi format sender -> role
      let validHistory = history.map(msg => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text || "" }]
      }));
      
      // 2. Xóa phần tử đầu tiên nếu nó là 'model' (Gemini bắt buộc lịch sử phải bắt đầu bằng 'user')
      if (validHistory[0].role === "model") {
        validHistory.shift();
      }

      // 3. Gộp các tin nhắn trùng role liên tiếp nhau (Gemini bắt buộc phải luân phiên user -> model -> user)
      formattedHistory = validHistory.reduce((acc, curr) => {
        if (acc.length === 0) {
          acc.push(curr);
        } else {
          const lastMsg = acc[acc.length - 1];
          if (lastMsg.role === curr.role) {
            // Nối text nếu trùng role liên tiếp
            lastMsg.parts[0].text += `\n${curr.parts[0].text}`; 
          } else {
            acc.push(curr);
          }
        }
        return acc;
      }, []);
    }

    // Khởi tạo Chat Session
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig
    });

    // Gửi tin nhắn mới nhất
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

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