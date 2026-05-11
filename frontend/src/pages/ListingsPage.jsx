export default function ListingsPage() {
  return (
    <div className="listings-page">
      <div className="container">
        <div className="page-header">
          <h1>Danh sách tin đăng</h1>
          <div className="filters">
            <button className="filter-btn active">Mua bán</button>
            <button className="filter-btn">Cho thuê</button>
            <button className="filter-btn">Dự án</button>
          </div>
        </div>

        <div className="listings-grid">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="listing-card">
              <div className="listing-image">
                <span className="price">3.2 tỷ</span>
                <span className="label">Hot</span>
              </div>
              <div className="listing-info">
                <h3>Căn hộ cao cấp Vinhomes Central Park</h3>
                <p>80m² • 3PN • View sông Sài Gòn</p>
                <div className="listing-meta">
                  <span>⭐ 4.8 (25)</span>
                  <span>📅 1 ngày trước</span>
                </div>
                <a href={`/listings/${i}`} className="view-btn">Xem chi tiết</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}