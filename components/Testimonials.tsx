import React from 'react';
import { TESTIMONIALS } from '../constants';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 bg-soil-900 text-white relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold mb-4 text-gold-100">كلمات من عملائنا</h2>
          <p className="text-gray-400">ثقة عملائنا هي سر نجاحنا واستمراريتنا</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 relative hover:bg-white/10 transition-colors">
              <Quote className="absolute top-6 left-6 text-gold-500/20" size={48} />
              <div className="flex gap-1 mb-6 text-gold-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < t.rating ? "currentColor" : "none"} />
                ))}
              </div>
              <p className="text-lg text-gray-200 italic mb-6 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center font-bold text-soil-900 text-xl">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gold-100">{t.name}</h4>
                  <span className="text-sm text-gray-400">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
