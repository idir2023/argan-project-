
import React from 'react';
import { Droplets, Heart, Sun } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-soil-100 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#AA911D 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
        <div className="order-2 md:order-1 relative">
           <div className="grid grid-cols-2 gap-4">
             {/* Argan Goats/Tree - Classic view */}
             <img src="https://images.unsplash.com/photo-1536500734266-9e120d53c7c0?auto=format&fit=crop&q=80&w=600" className="rounded-2xl shadow-xl mt-12 w-full h-64 object-cover hover:scale-105 transition-transform duration-500" alt="Argan Goats on Tree" />
             {/* Pouring Oil */}
             <img src="https://images.unsplash.com/photo-1615485500704-8e99099928b3?auto=format&fit=crop&q=80&w=600" className="rounded-2xl shadow-xl w-full h-64 object-cover hover:scale-105 transition-transform duration-500" alt="Pure Argan Oil" />
             {/* Cosmetic Setting */}
             <img src="https://images.unsplash.com/photo-1571781926291-280553d36603?auto=format&fit=crop&q=80&w=600" className="rounded-2xl shadow-xl w-full h-64 object-cover hover:scale-105 transition-transform duration-500" alt="Argan cosmetic preparation" />
             {/* Raw Nuts/Hand */}
             <img src="https://images.unsplash.com/photo-1605218427368-35b820a4548d?auto=format&fit=crop&q=80&w=600" className="rounded-2xl shadow-xl mt-12 w-full h-64 object-cover hover:scale-105 transition-transform duration-500" alt="Argan Nuts" />
           </div>
        </div>

        <div className="order-1 md:order-2 space-y-8">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-soil-900">
            أصالة متجذرة في <br/>
            <span className="text-gold-600">أرض المغرب</span>
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            بدأت رحلتنا في القرى الصغيرة في جنوب المغرب، حيث تتوارث النساء مهارة استخراج زيت الأرغان جيلاً بعد جيل. نحن نعمل مباشرة مع التعاونيات النسائية لضمان الجودة ودعم المجتمع المحلي.
          </p>
          
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="bg-white p-3 rounded-full shadow-md text-gold-600">
                <Sun size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-soil-900 mb-1">عضوي وطبيعي</h4>
                <p className="text-gray-600">خالٍ تماماً من المواد الكيميائية والمواد الحافظة.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-white p-3 rounded-full shadow-md text-gold-600">
                <Heart size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-soil-900 mb-1">دعم اجتماعي</h4>
                <p className="text-gray-600">شراؤك يساهم في تمكين النساء في المناطق القروية.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-white p-3 rounded-full shadow-md text-gold-600">
                <Droplets size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-soil-900 mb-1">عصر بارد</h4>
                <p className="text-gray-600">تقنية تقليدية تحافظ على جميع الفيتامينات والخصائص العلاجية للزيت.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
