
import React from 'react';
import { Facebook, Instagram, Phone, Mail, MapPin, Send, Globe, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void; // Optional prop
}

const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-soil-900 text-gray-300 pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-gold-400">أرغانيا</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              وجهتكم الأولى لمنتجات التجميل الطبيعية والمستدامة. نسعى لنشر كنوز الطبيعة المغربية للعالم أجمع.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="hover:text-gold-500 transition-colors p-1"><Facebook className="w-5 h-5 md:w-6 md:h-6" /></a>
              <a href="#" className="hover:text-gold-500 transition-colors p-1"><Instagram className="w-5 h-5 md:w-6 md:h-6" /></a>
              <a href="https://idir2023.github.io/next-portfolio-idir" target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors p-1"><Globe className="w-5 h-5 md:w-6 md:h-6" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-6">روابط سريعة</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#home" className="hover:text-gold-400 transition-colors block py-1">الرئيسية</a></li>
              <li><a href="#products" className="hover:text-gold-400 transition-colors block py-1">المتجر</a></li>
              <li><a href="#about" className="hover:text-gold-400 transition-colors block py-1">قصتنا</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors block py-1">سياسة الخصوصية</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-6">تواصل معنا</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3 items-center">
                <Phone className="text-gold-500 w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                <span dir="ltr" className="hover:text-white transition-colors cursor-pointer">+212 681 736 149</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="text-gold-500 w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                <span className="break-all hover:text-white transition-colors cursor-pointer">lahcenidir700@gmail.com</span>
              </li>
              <li className="flex gap-3 items-start">
                <MapPin className="text-gold-500 w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-1" />
                <span>بير جديد، الدار البيضاء، المغرب</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-6">النشرة البريدية</h4>
            <p className="text-sm text-gray-400 mb-4">اشترك للحصول على آخر العروض والنصائح الجمالية.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="بريدك الإلكتروني" 
                className="bg-white/10 border-none outline-none px-4 py-2 rounded-r-lg w-full focus:ring-1 focus:ring-gold-500 text-sm"
              />
              <button className="bg-gold-600 text-white px-4 py-2 rounded-l-lg hover:bg-gold-700 transition-colors">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2024 أرغانيا. جميع الحقوق محفوظة. <a href="https://idir2023.github.io/next-portfolio-idir" target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors font-semibold">تم التصميم بواسطة Lahcen Idir</a></p>
          
          {/* Admin Link */}
          {onOpenAdmin && (
             <button onClick={onOpenAdmin} className="flex items-center gap-2 text-gray-700 hover:text-gold-500 transition-colors" title="دخول الإدارة">
               <ShieldCheck size={16} />
               <span>الإدارة</span>
             </button>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
