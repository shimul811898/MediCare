import Banner from "./components/Banner";
import Footer from "./components/Footer";
import WhyChooseUs from "./components/WhyChooseUs ";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <main className="flex-1">
        <Banner />
        <WhyChooseUs />
      </main>
      <Footer />
    </div>
  );
}
