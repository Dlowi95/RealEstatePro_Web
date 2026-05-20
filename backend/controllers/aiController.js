const { GoogleGenerativeAI } = require("@google/generative-ai");
const Property = require("../models/Property");

// 1. Import file JSON dữ liệu địa chính
const vietnamData = require("../data/full_json_generated_data_vn_units.json");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. Nén dữ liệu: Chỉ lấy Tên Tỉnh và Tên các Phường/Xã bên trong thành 1 chuỗi text nhẹ
const optimizedLocationContext = vietnamData
  .map((p) => {
    const subLocations = p.Wards ? p.Wards.map((w) => w.Name).join(", ") : "";
    return `+ ${p.Name}: ${subLocations}`;
  })
  .join("\n");

const stripHTML = (htmlString) => {
  if (!htmlString) return "";
  // Xóa tất cả các thẻ HTML, biến đổi thành text thường
  return htmlString
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const chatAssistant = async (req, res) => {
  try {
    const { message, history } = req.body;

    const propertiesFromDB = await Property.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const propertyContext = propertiesFromDB
      .map((p) => {
        const locationStr = `${p.location.address}, ${p.location.ward || "Chưa cập nhật"}, ${p.location.province}`;
        // 2. Tẩy HTML trước khi nối vào chuỗi
        const cleanDesc = stripHTML(p.description);

        return `- [ID: ${p._id}] ${p.title} | ${p.propertyType} | ${p.price.toLocaleString("vi-VN")} VNĐ | Diện tích: ${p.area}m² | Địa chỉ: ${locationStr} | Mô tả: ${cleanDesc}`;
      })
      .join("\n");

    // 3. Nạp bộ dữ liệu địa chính đã nén vào System Instruction
    const systemInstruction = `Bạn là Trợ lý ảo thông minh của sàn bất động sản RealEstatePro.

NHIỆM VỤ:
1. TƯ VẤN TÌM KIẾM: Dựa vào "DANH SÁCH BẤT ĐỘNG SẢN" dưới đây để gợi ý sản phẩm.
2. HỖ TRỢ VIẾT BÀI: Viết mô tả bài đăng thu hút, định dạng HTML.

BỘ TỪ ĐIỂN ĐỊA DANH VIỆT NAM (Dữ liệu chuẩn):
${optimizedLocationContext}

DANH SÁCH BẤT ĐỘNG SẢN ĐANG CÓ TRÊN HỆ THỐNG:
${propertyContext}

LƯU Ý VỀ ĐỊA CHỈ:
- KHÔNG sử dụng kiến thức bên ngoài về Quận/Huyện của dự án (vì kiến thức đó có thể sai lệch).
- CHỈ sử dụng thông tin địa danh (xã, phường, khu vực) được cung cấp trong "DANH SÁCH BẤT ĐỘNG SẢN" và đối chiếu với "BỘ TỪ ĐIỂN ĐỊA DANH" phía trên để xác định vị trí thực tế.
- Nếu dữ liệu trong danh sách ghi "Nhà Bè" hay "Chợ Lớn", đó là địa điểm chính xác, hãy sử dụng nó để phản hồi cho khách hàng.
- Trả lời thân thiện, lịch sự bằng tiếng Việt, định dạng Markdown.
- TUYỆT ĐỐI KHÔNG SỬ DỤNG code HTML (như <div>, <p>, <strong>...) trong câu trả lời.
    - CHỈ SỬ DỤNG Markdown cơ bản để trình bày (dấu ** để in đậm, dấu - để tạo danh sách).`;

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest", // Gọi thẳng bản ổn định
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
