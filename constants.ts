
import { Product, Testimonial } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "زيت أرغان نقي 100%",
    description: "زيت عضوي معصور على البارد للبشرة والشعر والأظافر. إكسير الجمال المغربي الأصيل.",
    price: 350,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=1200", // Main bottle
      "https://images.unsplash.com/photo-1615485500704-8e99099928b3?auto=format&fit=crop&q=80&w=1200", // Pouring oil
      "https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&q=80&w=1200", // Argan tree
      "https://images.unsplash.com/photo-1571781926291-280553d36603?auto=format&fit=crop&q=80&w=1200"  // Ingredients
    ],
    category: "زيوت",
    rating: 5
  },
  {
    id: 2,
    name: "سيروم الشعر الذهبي",
    description: "تركيبة غنية بزيت الأرغان وفيتامين E لإصلاح الشعر التالف ومنحه لمعاناً لا يقاوم.",
    price: 280,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1200", // Serum bottle
      "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=1200", // Dropper
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=1200", // Hair
      "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=1200"  // Texture
    ],
    category: "شعر",
    rating: 4.8
  },
  {
    id: 3,
    name: "كريم الوجه الليلي",
    description: "ترطيب عميق ومكافحة الشيخوخة بفضل مضادات الأكسدة الطبيعية في زيت الأرغان.",
    price: 420,
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=1200", // Cream Jar
      "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&q=80&w=1200", // Texture
      "https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=1200", // Application
      "https://images.unsplash.com/photo-1556228720-1987594bb5d6?auto=format&fit=crop&q=80&w=1200"  // Setup
    ],
    category: "بشرة",
    rating: 4.9
  },
  {
    id: 4,
    name: "صابون الأرغان البلدي",
    description: "صابون تقليدي مغربي لتقشير البشرة وتنعيمها، مصنوع يدوياً.",
    price: 150,
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200", // Soap bar
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=1200", // Spa/Hammam
      "https://images.unsplash.com/photo-1607006344380-b6775a0824a7?auto=format&fit=crop&q=80&w=1200", // Texture
      "https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80&w=1200"  // Bath
    ],
    category: "استحمام",
    rating: 4.7
  },
  {
    id: 5,
    name: "مجموعة الحمام المغربي",
    description: "باقة متكاملة تحتوي على الزيت، الصابون، وقفاز التقشير لتجربة سبا في المنزل.",
    price: 850,
    image: "https://images.unsplash.com/photo-1556228578-f87e83d47634?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1556228578-f87e83d47634?auto=format&fit=crop&q=80&w=1200", // Full Set
      "https://images.unsplash.com/photo-1571781926291-280553d36603?auto=format&fit=crop&q=80&w=1200", // Ingredients
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200", // Spa vibe
      "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=1200"  // Oil close up
    ],
    category: "مجموعات",
    rating: 5
  },
  {
    id: 6,
    name: "لوشن الجسم الفاخر",
    description: "لوشن خفيف سريع الامتصاص برائحة العنبر والمسك وزيت الأرغان.",
    price: 220,
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=1200", // Pump bottle
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1200", // Cream
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1200", // Lifestyle
      "https://images.unsplash.com/photo-1556228578-8d84f5d2d6c3?auto=format&fit=crop&q=80&w=1200"  // Texture
    ],
    category: "جسم",
    rating: 4.6
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "سارة العمراني",
    role: "خبيرة تجميل",
    text: "أفضل زيت أرغان استخدمته في حياتي. النقاء والجودة واضحان من أول قطرة.",
    rating: 5
  },
  {
    id: 2,
    name: "ليلى بنسودة",
    role: "عميلة مميزة",
    text: "التغليف رائع والمنتج سحري. شعري أصبح أكثر نعومة وحيوية.",
    rating: 5
  },
  {
    id: 3,
    name: "فاطمة الزهراء",
    role: "مدونة موضة",
    text: "خدمة العملاء ممتازة والمنتجات طبيعية 100%. أنصح بها بشدة.",
    rating: 4
  }
];
