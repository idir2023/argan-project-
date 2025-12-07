
import React from 'react';
import { ArrowLeft, Calendar, User } from 'lucide-react';

const BLOG_POSTS = [
  {
    id: 1,
    title: "5 فوائد ذهبية لزيت الأرغان للشعر",
    excerpt: "اكتشفي كيف يمكن لقطرات من الذهب السائل أن تحول شعرك الجاف والتالف إلى شعر حيوي ولامع.",
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800",
    date: "15 مارس 2024",
    author: "د. سارة التازي"
  },
  {
    id: 2,
    title: "كيف تميزين زيت الأرغان الأصلي؟",
    excerpt: "دليلك الشامل لمعرفة الفرق بين الزيت الأصلي والمغشوش من خلال اللون، الرائحة، والملمس.",
    image: "https://images.unsplash.com/photo-1615485500704-8e99099928b3?auto=format&fit=crop&q=80&w=800",
    date: "10 مارس 2024",
    author: "محمد الإدريسي"
  },
  {
    id: 3,
    title: "روتين العناية الليلية بالبشرة",
    excerpt: "خطوات بسيطة لاستخدام زيت الأرغان قبل النوم لمحاربة التجاعيد وترطيب البشرة بعمق.",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800",
    date: "05 مارس 2024",
    author: "ليلى بناني"
  }
];

const Blog: React.FC = () => {
  return (
    <section id="blog" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-soil-900 mb-4">مدونة أرغانيا</h2>
          <div className="h-1 w-24 bg-gold-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600">
            نشاركك أسرار الجمال الطبيعي وخبراتنا العريقة في عالم زيت الأرغان.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <div key={post.id} className="group bg-soil-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-gold-600" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={14} className="text-gold-600" />
                    <span>{post.author}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-soil-900 mb-3 group-hover:text-gold-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <button className="flex items-center gap-2 text-gold-600 font-bold text-sm hover:gap-3 transition-all">
                  <span>اقرأ المزيد</span>
                  <ArrowLeft size={16} className="rtl:rotate-180" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
