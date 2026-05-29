const Parser = require('rss-parser');
const parser = new Parser();

const getLatestRealEstateNews = async (req, res) => {
  try {
    // 1. Fetch dữ liệu RSS từ VnExpress
    const feed = await parser.parseURL('https://vnexpress.net/rss/bat-dong-san.rss');
    
    // 2. Định dạng lại dữ liệu trả về cho Frontend gọn đẹp
    const formattedNews = feed.items.map(item => {
      // Sử dụng Regex để "bóc" đường dẫn ảnh từ trong thẻ <img> của description
      const imgRegex = /<img[^>]+src="([^">]+)"/;
      const match = item.content?.match(imgRegex) || item.description?.match(imgRegex);
      const thumbnail = match ? match[1] : 'https://via.placeholder.com/150'; // Ảnh mặc định nếu lỗi

      // Làm sạch text mô tả (loại bỏ nốt các thẻ HTML còn sót lại)
      const cleanDescription = (item.contentSnippet || item.description || '')
        .replace(/<[^>]*>/g, '') // Xóa hết thẻ HTML
        .replace(/\n/g, '')     // Xóa xuống dòng
        .trim();

      return {
        title: item.title,                      // Tiêu đề bài báo
        link: item.link,                        // Link gốc sang VnExpress
        pubDate: item.pubDate,                  // Ngày xuất bản
        description: cleanDescription,          // Đoạn mô tả ngắn sạch sẽ
        thumbnail: thumbnail                    // Link ảnh đại diện bài báo
      };
    });

    // 3. Trả về client (chỉ lấy top 10 bài mới nhất cho nhẹ trang)
    return res.status(200).json({
      success: true,
      data: formattedNews.slice(0, 10)
    });

  } catch (error) {
    console.error('Lỗi khi fetch tin tức VnExpress:', error);
    return res.status(500).json({
      success: false,
      message: 'Không thể lấy dữ liệu tin tức lúc này.'
    });
  }
};

module.exports = { getLatestRealEstateNews };