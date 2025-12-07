
import React, { useState } from 'react';
import { X, MessageCircle, MapPin, Phone, User, Mail, Loader2 } from 'lucide-react';
import { Product } from '../types';
import { saveOrder } from '../services/dataService';

interface FastOrderModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const FastOrderModal: React.FC<FastOrderModalProps> = ({ product, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [targetPlatform, setTargetPlatform] = useState<'whatsapp' | 'email' | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    phone: '',
    city: '',
    address: ''
  });

  if (!isOpen || !product) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateOrderMessage = () => {
    return `طلب جديد من متجر أرغانيا (طلب سريع)
------------------
المنتج: ${product.name}
السعر: ${product.price} درهم
------------------
العميل: ${formData.firstName}
العنوان: ${formData.city}, ${formData.address}
الهاتف: ${formData.phone}
------------------
طريقة الدفع: الدفع عند الاستلام`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPlatform) return;
    
    setLoading(true);

    // Save order to DB (simulated)
    saveOrder(
        [{ ...product, quantity: 1 }], 
        { ...formData, lastName: '(طلب سريع)', email: `fast-order@argania.ma` }, 
        product.price
    );

    const message = generateOrderMessage();
    
    setTimeout(() => {
        if (targetPlatform === 'whatsapp') {
            const msg = encodeURIComponent(message);
            window.open(`https://wa.me/212681736149?text=${msg}`, '_blank');
        } else if (targetPlatform === 'email') {
            const subject = encodeURIComponent(`طلب جديد - ${product.name}`);
            const body = encodeURIComponent(message.replace(/\n/g, '\r\n'));
            window.location.href = `mailto:lahcenidir700@gmail.com?subject=${subject}&body=${body}`;
        }

        setLoading(false);
        onClose();
        // Reset form
        setFormData({ firstName: '', phone: '', city: '', address: '' });
        setTargetPlatform(null);
    }, 1000);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[110] transition-opacity animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-3xl shadow-2xl z-[120] overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="bg-soil-900 p-6 flex justify-between items-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-white/20 p-2 rounded-full">
              <MessageCircle size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">طلب سريع</h2>
              <p className="text-xs text-white/80">أكمل الطلب في ثوانٍ</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors relative z-10">
            <X size={24} />
          </button>
        </div>

        {/* Product Summary */}
        <div className="p-4 bg-gray-50 flex gap-4 items-center border-b border-gray-100">
             <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
             <div>
                 <h3 className="font-bold text-soil-900 text-sm">{product.name}</h3>
                 <span className="text-gold-600 font-bold">{product.price} درهم</span>
             </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-soil-800">الاسم الكامل</label>
            <div className="relative">
              <User className="absolute right-3 top-3 text-gray-400" size={18} />
              <input 
                required 
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                type="text" 
                className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-gold-500 outline-none" 
                placeholder="الاسم" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-soil-800">رقم الهاتف</label>
            <div className="relative">
              <Phone className="absolute right-3 top-3 text-gray-400" size={18} />
              <input 
                required 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                type="tel" 
                className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-gold-500 outline-none" 
                placeholder="0600000000" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs font-bold text-soil-800">المدينة</label>
                <input 
                    required 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-gold-500 outline-none" 
                    placeholder="المدينة" 
                />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-soil-800">العنوان</label>
                <div className="relative">
                <MapPin className="absolute right-3 top-3 text-gray-400" size={18} />
                <input 
                    required 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    type="text" 
                    className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-gold-500 outline-none" 
                    placeholder="الحي / الشارع" 
                />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button 
                type="submit"
                onClick={() => setTargetPlatform('whatsapp')}
                disabled={loading}
                className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold text-sm md:text-base hover:bg-[#20bd5a] transition-colors shadow-lg flex items-center justify-center gap-2"
            >
                {loading && targetPlatform === 'whatsapp' ? (
                    <Loader2 size={20} className="animate-spin" />
                ) : (
                    <>
                    <MessageCircle size={20} />
                    <span>واتساب</span>
                    </>
                )}
            </button>
            <button 
                type="submit"
                onClick={() => setTargetPlatform('email')}
                disabled={loading}
                className="w-full bg-soil-900 text-white py-4 rounded-xl font-bold text-sm md:text-base hover:bg-gold-600 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
                {loading && targetPlatform === 'email' ? (
                    <Loader2 size={20} className="animate-spin" />
                ) : (
                    <>
                    <Mail size={20} />
                    <span>إيميل</span>
                    </>
                )}
            </button>
          </div>
          
          <p className="text-center text-xs text-gray-400 mt-2">
             الدفع عند الاستلام
          </p>
        </form>
      </div>
    </>
  );
};

export default FastOrderModal;
