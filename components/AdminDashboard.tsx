
import React, { useState, useEffect } from 'react';
import { Product, Order } from '../types';
import { getProducts, saveProduct, deleteProduct, getOrders, updateOrderStatus, deleteOrder } from '../services/dataService';
import { LayoutDashboard, Package, ShoppingCart, Plus, Edit, Trash2, X, Lock, TrendingUp, DollarSign, AlertCircle, Wand2 } from 'lucide-react';

interface AdminDashboardProps {
  onBackToSite: () => void;
  onUpdateProducts: () => void; // Trigger app refresh
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite, onUpdateProducts }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = () => {
    setProducts(getProducts());
    setOrders(getOrders());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin' || password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('كلمة المرور غير صحيحة');
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct.name || !currentProduct.price) return;

    // Use placeholder image if none provided
    const img = currentProduct.image || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800';
    
    const productToSave: Product = {
      id: currentProduct.id || 0, // 0 means new
      name: currentProduct.name,
      description: currentProduct.description || '',
      price: Number(currentProduct.price),
      category: currentProduct.category || 'عام',
      rating: currentProduct.rating || 5,
      image: img,
      images: currentProduct.images || [img] // Ensure array
    } as Product;

    saveProduct(productToSave);
    loadData();
    onUpdateProducts(); // Notify App.tsx
    setShowModal(false);
    setCurrentProduct({});
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      deleteProduct(id);
      loadData();
      onUpdateProducts();
    }
  };

  const handleDeleteOrder = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطلب نهائياً؟')) {
      deleteOrder(id);
      loadData();
    }
  };

  const openEdit = (product: Product) => {
    setCurrentProduct(product);
    setShowModal(true);
  };

  const openNew = () => {
    setCurrentProduct({});
    setShowModal(true);
  };

  const handleAutoFill = () => {
    setCurrentProduct({
        name: "زيت أرغان جديد فاخر",
        price: 399,
        category: "بشرة",
        description: "منتج جديد تمت إضافته تلقائياً لتجربة قاعدة البيانات. غني بالفيتامينات والمعادن.",
        image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800"
    });
  };

  const handleStatusUpdate = (id: string, status: 'pending' | 'completed') => {
    updateOrderStatus(id, status);
    loadData();
  };

  // Stats Calculation
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-gold-100 p-4 rounded-full">
              <Lock size={32} className="text-gold-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-soil-900 mb-6">تسجيل دخول الإدارة</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
                placeholder="أدخل كلمة المرور"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-soil-900 text-white py-3 rounded-xl font-bold hover:bg-gold-600 transition-colors shadow-lg"
            >
              دخول
            </button>
            <button 
              type="button"
              onClick={onBackToSite}
              className="w-full text-gray-500 py-2 text-sm hover:text-soil-900"
            >
              العودة للموقع
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-4">كلمة المرور الافتراضية: admin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col" dir="rtl">
      {/* Admin Header */}
      <header className="bg-soil-900 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-3">
           <div className="bg-gold-500 p-2 rounded-lg text-soil-900 font-bold">
             <LayoutDashboard size={24} />
           </div>
           <h1 className="text-xl font-bold font-serif hidden md:block">لوحة تحكم الإدارة</h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="text-white/70 hover:text-white px-3 py-2 text-sm"
          >
            خروج
          </button>
          <button 
            onClick={onBackToSite}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            العودة للموقع
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-20 md:w-64 bg-white shadow-lg flex flex-col z-10">
          <nav className="p-2 md:p-4 space-y-2">
            <button 
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 rounded-xl transition-colors ${activeTab === 'products' ? 'bg-gold-100 text-gold-800 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Package size={20} />
              <span className="hidden md:inline">المنتجات</span>
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-gold-100 text-gold-800 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <ShoppingCart size={20} />
              <span className="hidden md:inline">الطلبات</span>
              {pendingOrders > 0 && (
                <span className="bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full ml-auto">
                  {pendingOrders}
                </span>
              )}
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-green-100 p-4 rounded-full text-green-600">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-bold">إجمالي المبيعات</p>
                <h3 className="text-2xl font-bold text-soil-900">{totalRevenue} درهم</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                <ShoppingCart size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-bold">عدد الطلبات</p>
                <h3 className="text-2xl font-bold text-soil-900">{orders.length}</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-purple-100 p-4 rounded-full text-purple-600">
                <Package size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-bold">المنتجات النشطة</p>
                <h3 className="text-2xl font-bold text-soil-900">{products.length}</h3>
              </div>
            </div>
          </div>
          
          {activeTab === 'products' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-soil-900">إدارة المنتجات</h2>
                <button 
                  onClick={openNew}
                  className="bg-gold-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gold-700 shadow-md"
                >
                  <Plus size={20} />
                  <span>منتج جديد</span>
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                <table className="w-full text-right min-w-[600px]">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm">
                    <tr>
                      <th className="p-4 font-medium">الصورة</th>
                      <th className="p-4 font-medium">الاسم</th>
                      <th className="p-4 font-medium">الفئة</th>
                      <th className="p-4 font-medium">السعر</th>
                      <th className="p-4 font-medium">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                        </td>
                        <td className="p-4 font-medium text-soil-900">{p.name}</td>
                        <td className="p-4 text-gray-500">{p.category}</td>
                        <td className="p-4 font-bold text-gold-600">{p.price} درهم</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button onClick={() => openEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="تعديل">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="حذف">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-soil-900 mb-6">سجل الطلبات</h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                <table className="w-full text-right min-w-[800px]">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm">
                    <tr>
                      <th className="p-4 font-medium">رقم الطلب</th>
                      <th className="p-4 font-medium">العميل</th>
                      <th className="p-4 font-medium">التاريخ</th>
                      <th className="p-4 font-medium">المجموع</th>
                      <th className="p-4 font-medium">الحالة</th>
                      <th className="p-4 font-medium">المنتجات</th>
                      <th className="p-4 font-medium">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {orders.length === 0 && (
                        <tr>
                            <td colSpan={7} className="p-12 text-center flex flex-col items-center text-gray-400">
                                <AlertCircle size={48} className="mb-2 opacity-20" />
                                لا توجد طلبات مسجلة بعد
                            </td>
                        </tr>
                     )}
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="p-4 font-mono text-sm text-gold-600 font-bold">{order.id}</td>
                        <td className="p-4">
                          <div className="font-bold text-soil-900">{(order as any).firstName} {(order as any).lastName}</div>
                          <div className="text-xs text-gray-500">{(order as any).phone}</div>
                        </td>
                        <td className="p-4 text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString('ar-MA', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-4 font-bold text-soil-900">{order.total} درهم</td>
                        <td className="p-4">
                           <select 
                             value={order.status}
                             onChange={(e) => handleStatusUpdate(order.id, e.target.value as any)}
                             className={`px-3 py-1 rounded-full text-xs font-bold border-none outline-none cursor-pointer appearance-none ${
                               order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                             }`}
                           >
                             <option value="pending">قيد الانتظار</option>
                             <option value="completed">مكتمل</option>
                           </select>
                        </td>
                        <td className="p-4">
                           <div className="text-xs text-gray-600 max-w-[200px] leading-relaxed">
                              {order.items.map((i, idx) => (
                                <span key={idx} className="block">• {i.name} ({i.quantity})</span>
                              ))}
                           </div>
                        </td>
                        <td className="p-4">
                            <button 
                                onClick={() => handleDeleteOrder(order.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="حذف السجل"
                            >
                                <Trash2 size={16} />
                            </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden animate-fade-in-up shadow-2xl">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-soil-900">{currentProduct.id ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-200 rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-end">
                <button type="button" onClick={handleAutoFill} className="text-xs text-gold-600 flex items-center gap-1 hover:underline">
                    <Wand2 size={12} />
                    ملء تلقائي
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">اسم المنتج</label>
                <input 
                  type="text" 
                  value={currentProduct.name || ''}
                  onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gold-500 outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">السعر (درهم)</label>
                    <input 
                      type="number" 
                      value={currentProduct.price || ''}
                      onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gold-500 outline-none"
                      required
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">التصنيف</label>
                    <input 
                      type="text" 
                      value={currentProduct.category || ''}
                      onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gold-500 outline-none"
                      placeholder="مثال: شعر، بشرة"
                    />
                 </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">الوصف</label>
                <textarea 
                  value={currentProduct.description || ''}
                  onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-3 h-24 resize-none focus:ring-2 focus:ring-gold-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">رابط الصورة (URL)</label>
                <input 
                  type="text" 
                  value={currentProduct.image || ''}
                  onChange={e => setCurrentProduct({...currentProduct, image: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-3 text-left focus:ring-2 focus:ring-gold-500 outline-none"
                  dir="ltr"
                  placeholder="https://..."
                />
                <p className="text-xs text-gray-400">يمكنك نسخ رابط صورة من Unsplash أو أي مصدر آخر.</p>
              </div>
              <button type="submit" className="w-full bg-soil-900 text-white py-3 rounded-xl font-bold hover:bg-gold-600 transition-colors mt-4 shadow-lg">
                 حفظ التغييرات
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
