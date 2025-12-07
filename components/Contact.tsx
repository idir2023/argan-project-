
import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, Facebook, Instagram, Globe } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    alert('شكراً لتواصلك معنا! سنرد عليك في أقرب وقت.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-24 bg-soil-50 relative overflow-hidden">
      {/* Decorative BG */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-300/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Contact Info */}
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-soil-900 mb-6">
              نحن هنا <br />
              <span className="text-gold-600">للاستماع إليك</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              لأي استفسار حول منتجاتنا أو طلباتك، لا تتردد في التواصل معنا. فريقنا جاهز لخدمتك بكل حب واهتمام.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-full shadow-md text-gold-600">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-soil-900 text-lg">اتصل بنا</h4>
                  <p className="text-gray-600" dir="ltr">+212 681 736 149</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-full shadow-md text-gold-600">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-soil-900 text-lg">البريد الإلكتروني</h4>
                  <p className="text-gray-600">lahcenidir700@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-full shadow-md text-gold-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-soil-900 text-lg">موقعنا</h4>
                  <p className="text-gray-600">بير جديد، الدار البيضاء، المغرب</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <a href="#" className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-soil-900 hover:bg-gold-500 hover:text-white transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-soil-900 hover:bg-gold-500 hover:text-white transition-all">
                <Instagram size={20} />
              </a>
              <a href="https://idir2023.github.io/next-portfolio-idir" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-soil-900 hover:bg-gold-500 hover:text-white transition-all">
                <Globe size={20} />
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
            <h3 className="text-2xl font-serif font-bold text-soil-900 mb-6">أرسل رسالة</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-soil-800">الاسم الكامل</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                  placeholder="اسمك الكريم"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-soil-800">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                  placeholder="email@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-soil-800">الرسالة</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-gold-500 outline-none transition-all resize-none"
                  placeholder="كيف يمكننا مساعدتك؟"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-soil-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gold-600 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <span>إرسال</span>
                <Send size={20} className="rtl:rotate-180" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
