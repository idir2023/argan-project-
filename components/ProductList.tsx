
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { Star, ShoppingCart, Eye, SearchX, Maximize2, ArrowUpDown, MessageCircle, Share2, Plus, Filter } from 'lucide-react';
import QuickViewModal from './QuickViewModal';
import ImageViewer from './ImageViewer';
import FastOrderModal from './FastOrderModal';
import ShareModal from './ShareModal';

interface ProductListProps {
  products: Product[]; // Receive products from App state
  onAddToCart: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewingImageProduct, setViewingImageProduct] = useState<Product | null>(null);
  const [fastOrderProduct, setFastOrderProduct] = useState<Product | null>(null);
  const [shareProduct, setShareProduct] = useState<Product | null>(null);
  
  // Filter & Sort State
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');

  // Extract unique categories from the products list
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return ['all', ...cats];
  }, [products]);

  // Derived state: Filtered and Sorted products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0; // Keep original order (usually by ID or added date)
      }
    });

    return result;
  }, [products, activeCategory, sortBy]);

  // Helper to generate responsive Unsplash URLs
  const getOptimizedImageUrl = (url: string, width: number) => {
    try {
      if (url.includes('unsplash.com')) {
        const urlObj = new URL(url);
        urlObj.searchParams.set('w', width.toString());
        urlObj.searchParams.set('q', '80');
        urlObj.searchParams.set('auto', 'format');
        return urlObj.toString();
      }
      return url;
    } catch (e) {
      return url;
    }
  };

  // Helper to render basic markdown
  const renderDescription = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return <strong key={index} className="font-bold text-soil-800">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
        return <em key={index} className="italic text-gray-700">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <section id="products" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-soil-900 mb-4">مجموعتنا المختارة</h2>
          <div className="h-1 w-24 bg-gold-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600">
            تم اختيار كل منتج بعناية فائقة لضمان أعلى معايير الجودة والنقاء. استمتعي بلمسة الطبيعة الفاخرة.
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-6">
          
          {/* Categories Filter */}
          <div className="w-full lg:w-auto overflow-x-auto pb-2 custom-scrollbar">
            <div className="flex gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all border ${
                    activeCategory === cat
                      ? 'bg-gold-600 text-white border-gold-600 shadow-md'
                      : 'bg-white text-soil-800 border-gray-200 hover:border-gold-300 hover:bg-gold-50'
                  }`}
                >
                  {cat === 'all' ? 'الكل' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative w-full lg:w-64">
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gold-600">
                <ArrowUpDown size={16} />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 text-soil-800 py-3 pr-10 pl-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 cursor-pointer shadow-sm text-sm font-medium"
              >
                <option value="default">الترتيب الافتراضي</option>
                <option value="price-low">السعر: من الأقل للأعلى</option>
                <option value="price-high">السعر: من الأعلى للأقل</option>
                <option value="rating">الأعلى تقييماً</option>
              </select>
            </div>
            
            <button className="lg:hidden p-3 bg-white border border-gray-200 rounded-xl text-soil-800">
                <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredAndSortedProducts.length === 0 ? (
             <div className="col-span-full py-20 text-center flex flex-col items-center justify-center text-gray-400">
                <SearchX size={64} className="mb-4 opacity-30" />
                <h3 className="text-xl font-bold mb-2">لا توجد منتجات</h3>
                <p>لم نعثر على أي منتجات تطابق البحث الحالي.</p>
             </div>
          ) : (
            filteredAndSortedProducts.map((product) => {
              const hasSecondImage = product.images && product.images.length > 1;
              
              return (
                <div key={product.id} className="group bg-soil-50 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col">
                  {/* Image Container */}
                  <div className="relative h-80 overflow-hidden cursor-pointer" onClick={() => setViewingImageProduct(product)}>
                    {/* Primary Image */}
                    <img 
                      src={getOptimizedImageUrl(product.image, 800)} 
                      srcSet={`
                        ${getOptimizedImageUrl(product.image, 400)} 400w,
                        ${getOptimizedImageUrl(product.image, 600)} 600w,
                        ${getOptimizedImageUrl(product.image, 800)} 800w
                      `}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      alt={`${product.name} - ${product.category} - أرغانيا`} 
                      className={`w-full h-full object-cover absolute top-0 left-0 transition-all duration-700 group-hover:scale-110 ${hasSecondImage ? 'group-hover:opacity-0' : ''}`}
                      loading="lazy"
                    />
                    
                    {/* Secondary Image (Fade In on Hover) */}
                    {hasSecondImage && (
                        <img 
                          src={getOptimizedImageUrl(product.images[1], 800)}
                          srcSet={`
                            ${getOptimizedImageUrl(product.images[1], 400)} 400w,
                            ${getOptimizedImageUrl(product.images[1], 600)} 600w,
                            ${getOptimizedImageUrl(product.images[1], 800)} 800w
                          `}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          alt={`${product.name} alternate view`}
                          className="w-full h-full object-cover absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                    )}

                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all duration-300"></div>
                    
                    {/* Hover Actions */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 translate-x-[-20px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                       <button 
                         onClick={(e) => { e.stopPropagation(); setViewingImageProduct(product); }}
                         className="bg-white p-3 rounded-full shadow-lg text-soil-900 hover:bg-gold-500 hover:text-white transition-colors"
                         title="تكبير الصورة"
                       >
                         <Maximize2 size={20} />
                       </button>
                       <button 
                         onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
                         className="bg-white p-3 rounded-full shadow-lg text-soil-900 hover:bg-gold-500 hover:text-white transition-colors"
                         title="نظرة سريعة"
                       >
                         <Eye size={20} />
                       </button>
                       <button 
                         onClick={(e) => { e.stopPropagation(); setShareProduct(product); }}
                         className="bg-white p-3 rounded-full shadow-lg text-soil-900 hover:bg-gold-500 hover:text-white transition-colors"
                         title="مشاركة المنتج"
                       >
                         <Share2 size={20} />
                       </button>
                    </div>

                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-soil-900 shadow-sm uppercase tracking-wider">
                      {product.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 
                        className="text-xl font-bold text-soil-900 group-hover:text-gold-600 transition-colors cursor-pointer"
                        onClick={() => setSelectedProduct(product)}
                      >
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-gray-100">
                        <Star className="text-gold-500 w-4 h-4 fill-current" />
                        <span className="text-sm font-bold text-gray-700">{product.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                        {renderDescription(product.description)}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between gap-4">
                      <span className="text-2xl font-bold text-soil-900">{product.price} <span className="text-sm font-normal text-gray-500">درهم</span></span>
                      <div className="flex gap-2">
                        <button 
                            onClick={() => setFastOrderProduct(product)}
                            className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
                            title="طلب سريع عبر واتساب"
                        >
                            <MessageCircle size={22} />
                        </button>
                        <button 
                            onClick={() => onAddToCart(product)}
                            className="p-3 bg-soil-900 text-white rounded-xl hover:bg-gold-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
                            title="إضافة إلى السلة"
                        >
                            <Plus size={22} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modals */}
      <QuickViewModal 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        onAddToCart={onAddToCart}
        onFastOrder={(p) => setFastOrderProduct(p)}
      />

      <ImageViewer
        product={viewingImageProduct}
        isOpen={!!viewingImageProduct}
        onClose={() => setViewingImageProduct(null)}
      />

      <FastOrderModal
        product={fastOrderProduct}
        isOpen={!!fastOrderProduct}
        onClose={() => setFastOrderProduct(null)}
      />

      <ShareModal
        product={shareProduct}
        isOpen={!!shareProduct}
        onClose={() => setShareProduct(null)}
      />

    </section>
  );
};

export default ProductList;
