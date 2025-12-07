
import React from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-soil-50">
          <h2 className="text-2xl font-serif font-bold text-soil-900 flex items-center gap-2">
            <ShoppingBag size={24} />
            سلة التسوق
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <ShoppingBag size={64} opacity={0.2} />
              <p className="text-lg">سلة التسوق فارغة</p>
              <button onClick={onClose} className="text-gold-600 font-bold hover:underline">ابدأ التسوق</button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 bg-white p-2 rounded-xl border border-gray-100">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-soil-900 text-sm">{item.name}</h3>
                    <button onClick={() => onRemoveItem(item.id)} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-gold-600 font-bold">{item.price} درهم</p>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gold-100 text-soil-900"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="font-medium w-4 text-center">{item.quantity}</span>
                    <button 
                       onClick={() => onUpdateQuantity(item.id, 1)}
                       className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gold-100 text-soil-900"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-soil-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-gray-600">المجموع:</span>
              <span className="text-2xl font-bold text-soil-900">{total} درهم</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-soil-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gold-600 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <span>إتمام الطلب</span>
              <ArrowLeft size={20} className="rtl:rotate-180" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
