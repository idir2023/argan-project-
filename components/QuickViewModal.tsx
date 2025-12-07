
import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Star, MessageCircle } from 'lucide-react';
import { Product } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onFastOrder?: (product: Product) => void; // Added optional prop for fast order
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose, onAddToCart, onFastOrder }) => {
  const [activeImage, setActiveImage] = useState<string>('');

  // Reset active image when product changes
  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setActiveImage(product.images[0]);
    } else if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[900px] bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden animate-fade-in-up flex flex-col md:flex-row max-h-[90vh] md:max-h-auto">
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full hover:bg-white text-gray-500 hover:text-red-500 transition-colors shadow-sm"
        >
            <X size={24} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 h-80 md:h-auto bg-gray-50 flex flex-col">
             <div className="flex-1 relative overflow-hidden">
                <img 
                  src={activeImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:hidden"></div>
             </div>
             
             {/* Thumbnails */}
             {product.images && product.images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto bg-white/50 backdrop-blur-sm">
                   {product.images.map((img, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setActiveImage(img)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-gold-600 ring-1 ring-gold-600' : 'border-transparent opacity-70 hover:opacity-100'}`}
                      >
                         <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                   ))}
                </div>
             )}
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center overflow-y-auto custom-scrollbar">
            <span className="text-gold-600 font-bold tracking-wider uppercase text-xs md:text-sm mb-2">{product.category}</span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-soil-900 mb-3">{product.name}</h2>
            
            <div className="flex items-center gap-2 mb-6">
                <div className="flex text-gold-500">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i < Math.floor(product.rating) ? "" : "text-gray-300"} />
                    ))}
                </div>
                <span className="text-gray-400 text-sm">({product.rating}/5)</span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 text-sm md:text-base">
                {product.description}
                <br /><br />
                استمتعي بتجربة فريدة مع هذا المنتج الطبيعي المستخلص بعناية ليعتني بجمالك.
            </p>

            <div className="mt-auto pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                     <span className="text-gray-500 text-sm">السعر</span>
                     <span className="text-3xl font-bold text-soil-900">{product.price} درهم</span>
                </div>
                
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => {
                            onAddToCart(product);
                            onClose();
                        }}
                        className="w-full bg-soil-900 text-white py-4 rounded-xl font-bold hover:bg-gold-600 transition-colors shadow-lg flex items-center justify-center gap-2 group"
                    >
                        <span>إضافة للسلة</span>
                        <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                    </button>

                    {onFastOrder && (
                        <button 
                            onClick={() => {
                                onFastOrder(product);
                                // onClose is handled by parent if needed, but usually we keep it open or close it there
                            }}
                            className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold hover:bg-[#20bd5a] transition-colors shadow-lg flex items-center justify-center gap-2 group"
                        >
                            <span>طلب سريع عبر واتساب</span>
                            <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                        </button>
                    )}
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default QuickViewModal;
