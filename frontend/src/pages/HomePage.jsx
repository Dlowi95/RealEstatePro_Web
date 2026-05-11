import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";


const CATEGORIES = [
  { icon: "🏘️", name: "Nhà phố", type: "nha-pho", count: "42.100" },
  { icon: "🏢", name: "Chung cư", type: "chung-cu", count: "28.500" },
  { icon: "🌳", name: "Đất nền", type: "dat-nen", count: "19.200" },
  { icon: "🏰", name: "Biệt thự", type: "biet-thu", count: "6.800" },
  { icon: "🏬", name: "Mặt bằng", type: "mat-bang", count: "5.400" },
  { icon: "🏗️", name: "Dự án", type: "du-an", count: "2.100" },
  { icon: "🏡", name: "Nhà trọ", type: "nha-tro", count: "11.300" },
  { icon: "🏭", name: "Kho xưởng", type: "kho-xuong", count: "3.200" },
];

const PROVINCES = [
  "Tất cả tỉnh/thành", "Hồ Chí Minh", "Hà Nội", "Đà Nẵng",
  "Bình Dương", "Đồng Nai", "Long An", "Cần Thơ",
];

const PRICE_RANGES = [
  "Khoảng giá", "Dưới 500 triệu", "500tr - 1 tỷ",
  "1 - 3 tỷ", "3 - 5 tỷ", "5 - 10 tỷ", "Trên 10 tỷ",
];

const PROPERTY_TYPES = [
  "Loại hình", "Nhà phố", "Căn hộ chung cư", "Đất nền",
  "Biệt thự", "Mặt bằng thương mại", "Nhà trọ",
];

export default function HomePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sale");
  const [search, setSearch] = useState({
    province: "",
    type: "",
    priceRange: "",
    keyword: "",
  });

  const { listings, loading } = useFeaturedListings();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search.province) params.set("province", search.province);
    if (search.type) params.set("propertyType", search.type);
    if (search.priceRange) params.set("price", search.priceRange);
    if (search.keyword) params.set("q", search.keyword);
    params.set("listingType", activeTab);
    navigate(`/listings?${params.toString()}`);
  };

  const handleCategoryClick = (type) => {
    navigate(`/listings?propertyType=${type}&listingType=${activeTab}`);
  };

  return (
    <div className="homepage">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Tìm ngôi nhà mơ ước của bạn</h1>
          <p className="hero-sub">Hơn 120.000 tin bất động sản trên toàn quốc</p>

          {/* Tab: Mua bán / Cho thuê / Dự án */}
          <div className="search-tabs">
            {[
              { id: "sale", label: "🏠 Mua bán nhà đất" },
              { id: "rent", label: "🔑 Cho thuê" },
              { id: "project", label: "🏗️ Dự án mới" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`search-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="search-box">
            <select
              value={search.province}
              onChange={(e) => setSearch({ ...search, province: e.target.value })}
              className="search-select"
            >
              {PROVINCES.map((p) => (
                <option key={p} value={p === PROVINCES[0] ? "" : p}>{p}</option>
              ))}
            </select>

            <select
              value={search.type}
              onChange={(e) => setSearch({ ...search, type: e.target.value })}
              className="search-select"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t === PROPERTY_TYPES[0] ? "" : t}>{t}</option>
              ))}
            </select>

            <select
              value={search.priceRange}
              onChange={(e) => setSearch({ ...search, priceRange: e.target.value })}
              className="search-select"
            >
              {PRICE_RANGES.map((p) => (
                <option key={p} value={p === PRICE_RANGES[0] ? "" : p}>{p}</option>
              ))}
            </select>

            <input
              className="search-input"
              placeholder="🔍 Nhập tên đường, phường, quận..."
              value={search.keyword}
              onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />

            <button className="search-btn" onClick={handleSearch}>
              Tìm kiếm
            </button>
          </div>

          {/* Quick Stats */}
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-number">87.4K</span>
              <span className="stat-label">Tin mua bán</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">34.2K</span>
              <span className="stat-label">Tin cho thuê</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">2.1K</span>
              <span className="stat-label">Dự án</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">98%</span>
              <span className="stat-label">Tin có ảnh</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="section">
        <div className="section-container">
          <h2 className="section-title">Danh mục bất động sản</h2>
          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.type}
                className="category-card"
                onClick={() => handleCategoryClick(cat.type)}
              >
                <div className="cat-icon">{cat.icon}</div>
                <div className="cat-name">{cat.name}</div>
                <div className="cat-count">{cat.count} tin</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED LISTINGS ===== */}
      <section className="section section-gray">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Tin nổi bật hôm nay</h2>
            <button
              className="view-all-btn"
              onClick={() => navigate("/listings?featured=true")}
            >
              Xem tất cả →
            </button>
          </div>

          {loading ? (
            <div className="listings-skeleton">
              {[1,2,3,4,5,6].map((i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : (
            <div className="listings-grid">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="section-container">
          <div className="footer-grid">
            <div>
              <h3 className="footer-logo">Real<span>Estate</span>Pro</h3>
              <p className="footer-desc">
                Nền tảng bất động sản hàng đầu Việt Nam. Kết nối người mua và người bán hiệu quả.
              </p>
            </div>
            <div>
              <h4>Về chúng tôi</h4>
              <ul>
                <li><a href="#">Giới thiệu</a></li>
                <li><a href="#">Điều khoản dịch vụ</a></li>
                <li><a href="#">Chính sách bảo mật</a></li>
              </ul>
            </div>
            <div>
              <h4>Hỗ trợ</h4>
              <ul>
                <li><a href="#">Hướng dẫn đăng tin</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Liên hệ</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            © 2025 RealEstatePro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}