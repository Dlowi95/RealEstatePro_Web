import HeroSection from "@/components/users/HeroSection";
import UserLayout from "@/layouts/UserLayout";
import SearchBar from "@/components/users/SerchBar";
import FeaturedProperties from "@/components/users/FeaturedProperties";

export default function HomePage() {
    return (
        <UserLayout>
                <HeroSection />
             <SearchBar />
                <FeaturedProperties />
            </UserLayout>
    );
}