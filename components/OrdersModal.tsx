
import React from 'react';
import { X, Package, Calendar, Clock, CheckCircle } from 'lucide-react';
import { Order } from '../types';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose, orders }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[600px] bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden animate-fade-in-up flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="bg-soil-900 p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
             <div className="bg-gold-500/20 p-2 rounded-lg">
               <Package size={24} className="text-gold-400" />
             </div>
             <h2 className="text-xl font-serif font-bold text-gold-100">طلباتي السابقة</h2>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gray-50">
           {orders.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Package size={64} className="mb-4 opacity-20" />
                <p>لم تقم بأي طلبات بعد.</p>
             </div>
           ) : (
             <div className="space-y-4">
               {orders.map((order) => (
                 <div key={order.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className="font-mono font-bold text-gold-600 bg-gold-50 px-2 py-0.5 rounded text-sm">{order.id}</span>
                             <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                {order.status === 'completed' ? <CheckCircle size={10} /> : <Clock size={10} />}
                                {order.status === 'completed' ? 'مكتمل' : 'قيد المعالجة'}
                             </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                             <Calendar size={12} />
                             {new Date(order.date).toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                       </div>
                       <span className="font-bold text-lg text-soil-900">{order.total} درهم</span>
                    </div>

                    <div className="border-t border-gray-100 pt-3">
                       <p className="text-xs text-gray-500 mb-2 font-bold">المنتجات:</p>
                       <ul className="space-y-1">
                          {order.items.map((item, idx) => (
                             <li key={idx} className="flex justify-between text-sm text-gray-700">
                                <span>{item.name} <span className="text-gray-400 text-xs">x{item.quantity}</span></span>
                                <span>{item.price * item.quantity} درهم</span>
                             </li>
                          ))}
                       </ul>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>
    </>
  );
};

export default OrdersModal;
