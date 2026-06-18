import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-white text-slate-900">

   
      <div className="absolute top-0 left-0 w-80 h-80 bg-teal-100 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-100 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">


        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-10 shadow-sm">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

            <div>
              <h2 className="text-3xl font-black text-slate-900">
                Medi<span className="text-teal-600">Care</span> Connect
              </h2>

              <p className="mt-4 text-slate-600 leading-relaxed">
                Revolutionizing healthcare through seamless doctor-patient
                connectivity, smart appointments, and digital health solutions.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm text-slate-500">
                  Healthcare Services Available 24/7
                </span>
              </div>
            </div>


            <div>
              <h3 className="font-bold text-xl mb-5 text-slate-900">
                Quick Links
              </h3>

              <ul className="space-y-3 text-slate-600">
                <li><Link href="/" className="hover:text-teal-600 transition">Home</Link></li>
                <li><Link href="/find-doctors" className="hover:text-teal-600 transition">Find Doctors</Link></li>
                <li><Link href="/appointments" className="hover:text-teal-600 transition">Appointments</Link></li>
                <li><Link href="/about" className="hover:text-teal-600 transition">About Us</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-5 text-slate-900">
                Contact
              </h3>

              <div className="space-y-3 text-slate-600">
                <p>📍 Dhaka, Bangladesh</p>
                <p>📧 support@medicareconnect.com</p>
                <p>📞 +880 1234-567890</p>

                <div className="mt-5 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <p className="text-sm text-slate-500">Emergency Hotline</p>
                  <h4 className="text-3xl font-black text-teal-600">16000</h4>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-5 text-slate-900">
                Follow Us
              </h3>

              <div className="flex gap-4">
                {[FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn].map((Icon, idx) => (
                  <a key={idx} href="#" className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-teal-500 hover:text-white hover:scale-110 transition-all shadow-sm">
                    <Icon />
                  </a>
                ))}
              </div>

              <div className="mt-8">
                <p className="text-slate-600 text-sm">
                  Stay updated with healthcare news and innovations.
                </p>
              </div>
            </div>

          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm gap-4">
          <p>© {new Date().getFullYear()} MediCare Connect. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-teal-600">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-teal-600">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;