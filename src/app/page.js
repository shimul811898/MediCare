import Banner from "./components/Banner";
import FeaturedDoctors from "./components/FeaturedDoctors";
import Footer from "./components/Footer";
import Specializations from "./components/Specializations";
import SuccessStories from "./components/SuccessStories";
import WhyChooseUs from "./components/WhyChooseUs ";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <main className="flex-1">
        <Banner />
        <WhyChooseUs />
        <FeaturedDoctors />
        <Specializations />
        <SuccessStories />
      </main>
      <Footer />
    </div>
  );
}
