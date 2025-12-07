
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopNow }) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&q=80&w=1920" 
          alt="شجرة الأرغان المغربية - Moroccan Argan Tree" 
          className="w-full h-full object-cover"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-black/20"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div className="text-right space-y-6">
          <div className="inline-block bg-gold-100 text-gold-800 px-4 py-1 rounded-full text-sm font-bold tracking-wider mb-4 animate-fade-in-up">
            طبيعي ١٠٠٪ • فاخر • عضوي
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-soil-900 leading-tight">
            ذهب المغرب السائل <br/>
            <span className="text-gold-600">بين يديك</span>
          </h1>
          <p className="text-xl text-soil-800 max-w-lg leading-relaxed font-medium">
            اكتشفي سر الجمال المغربي مع مجموعتنا المختارة من زيوت الأرغان العضوية النقية، للعناية الفائقة بالبشرة والشعر.
          </p>
          <div className="flex gap-4 pt-4">
            <button 
              onClick={onShopNow}
              className="bg-soil-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gold-600 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-2 group"
            >
              تسوقي الآن
              <ArrowRight className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button className="bg-white/80 backdrop-blur border border-soil-900/10 text-soil-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-white transition-all duration-300">
              اعرفي المزيد
            </button>
          </div>
        </div>
        
        {/* Decorative Elements (Hidden on mobile for cleaner look) */}
        <div className="hidden md:block relative">
            <div className="relative z-10 transform hover:scale-105 transition-transform duration-700">
                {/* Secondary image showing context or specific bottle */}
                <img 
                    src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800" 
                    alt="Authentic Argan Oil Bottle" 
                    className="rounded-t-[200px] rounded-b-[50px] shadow-2xl w-3/4 mx-auto border-4 border-white object-cover h-[500px]"
                />
            </div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gold-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-700"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
