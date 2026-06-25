import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#FFFFFF] to-[#F4FAF8] text-slate-900 border-t border-slate-100">
      
      <div className="absolute top-0 left-[-10%] w-96 h-96 bg-teal-100/30 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#00a884]/10 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 relative z-10">
        
        <div className="bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-[32px] p-6 sm:p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            
            <div className="lg:col-span-4 space-y-5">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Medi<span className="text-[#00a884]">Care</span> Connect
              </h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-sm">
                Revolutionizing healthcare through seamless doctor-patient connectivity, smart appointments, and digital health solutions.
              </p>
              <div className="inline-flex items-center gap-2.5 bg-emerald-50/60 border border-emerald-100 px-3.5 py-1.5 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-emerald-800">
                  Available 24/7 Virtual Care
                </span>
              </div>
            </div>

            <div className="lg:col-span-2 lg:pl-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-5">
                Quick Links
              </h3>
              <ul className="space-y-3 text-slate-600 font-semibold text-sm">
                <li><Link href="/" className="hover:text-[#00a884] transition-colors duration-200">Home</Link></li>
                <li><Link href="/find-doctors" className="hover:text-[#00a884] transition-colors duration-200">Find Doctors</Link></li>
                <li><Link href="/appointments" className="hover:text-[#00a884] transition-colors duration-200">Appointments</Link></li>
                <li><Link href="/about" className="hover:text-[#00a884] transition-colors duration-200">About Us</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-5">
                Contact Info
              </h3>
              <div className="space-y-3 text-slate-600 font-medium text-sm">
                <p className="flex items-center gap-2">📍 <span className="text-slate-700">Dhaka, Bangladesh</span></p>
                <p className="flex items-center gap-2">📧 <span className="text-slate-700">support@medicare.com</span></p>
                <p className="flex items-center gap-2">📞 <span className="text-slate-700">+880 1234-567890</span></p>

                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-[#F4FAF8] to-white border border-emerald-100/60 shadow-sm">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Emergency Hotline</p>
                  <h4 className="text-2xl font-black text-[#00a884] mt-0.5">16000</h4>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-5">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-2">
                Follow Us
              </h3>
              <div className="flex gap-3">
                {[FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn].map((Icon, idx) => (
                  <a 
                    key={idx} 
                    href="#" 
                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#00a884] hover:text-white hover:border-[#00a884] active:scale-95 transition-all duration-200 shadow-sm"
                  >
                    <Icon className="text-sm" />
                  </a>
                ))}
              </div>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">
                Stay updated with premium healthcare news, feature rollouts, and clinical innovations.
              </p>
            </div>

          </div>
        </div>

       
        <div className="mt-10 pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row justify-between items-center text-slate-400 text-xs font-semibold gap-4">
          <p>© {new Date().getFullYear()} MediCare Connect. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#00a884] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#00a884] transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;