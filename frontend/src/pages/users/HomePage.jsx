import HeroSection from "@/components/users/HeroSection";
import UserLayout from "@/layouts/UserLayout";
import SearchBar from "@/components/users/SerchBar";
export default function HomePage() {
    return (
        <UserLayout>
            <HeroSection />
         <SearchBar />
        </UserLayout>
    );
}