import { useState } from "react";
import HeroSection from "@/components/users/HeroSection";
import PostPropertyCTA from "@/components/PostPropertyCTA";
import UserLayout from "@/layouts/UserLayout";
import SearchBar from "@/components/users/SerchBar";
import PropertyList from "@/components/users/PropertyList";
import FeaturedProperties from "@/components/users/FeaturedProperties";
import RealEstateNews from "@/components/users/RealEstateNews";

export default function HomePage() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => { setHasSearched(true); };
  const handleClear = () => { setHasSearched(false); };

  return (
    <UserLayout>
      <HeroSection />
      <PostPropertyCTA />
      <SearchBar
        keyword={keyword} setKeyword={setKeyword}
        location={location} setLocation={setLocation}
        propertyType={propertyType} setPropertyType={setPropertyType}
        maxPrice={maxPrice} setMaxPrice={setMaxPrice}
        minArea={minArea} setMinArea={setMinArea}
        onSearch={handleSearch} onClear={handleClear}
      />
      <PropertyList
        keyword={keyword} location={location} propertyType={propertyType}
        maxPrice={maxPrice} minArea={minArea} hasSearched={hasSearched}
      />
      <FeaturedProperties />
      <RealEstateNews />
    </UserLayout>
  );
}