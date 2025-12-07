
import React, { useState, useEffect } from 'react';
import { CartItem, User as UserType } from '../types';
import { ArrowRight, CheckCircle, CreditCard, Banknote, MapPin, User, Phone, Mail, Truck, FileText, ChevronLeft, MessageCircle, Calendar, Lock } from 'lucide-react';

interface CheckoutProps {
  cart: CartItem[];
  total: number;
  user: UserType | null;
  onBack: () => void;
  onPlaceOrder: (customerData?: any) => void;
}

type Step = 'shipping' | 'payment' | 'review' | 'success';

const Checkout: React.FC<CheckoutProps> = ({ cart, total, user, onBack, onPlaceOrder }) => {
  const [step, setStep] = useState<Step>('shipping');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  
  // Keep a snapshot of the cart when placing order, so we can generate message 
  // even after App.tsx clears the global cart.
  const [lastOrderCart, setLastOrderCart] = useState<CartItem[]>([]);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: user?.email || '',
    address: '',
    city: '',
    zip: ''
  });

  // Effect to pre-fill name if available
  useEffect(() => {
    if (user && user.name) {
      const parts = user.name.split(' ');
      if (parts.length > 0) {
        setFormData(prev => ({ 
            ...prev, 
            firstName: parts[0],
            lastName: parts.slice(1).join(' ') || prev.lastName,
            email: user.email 
        }));
      }
    }
  }, [user]);

  const [cardData, setCardData] = useState({
    nameOnCard: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      // Remove all non-digits
      const digits = value.replace(/\D/g, '').slice(0, 16);
      // Add space every 4 digits
      formattedValue = digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    } else if (name === 'expiry') {
      // Remove all non-digits
      const digits = value.replace(/\D/g, '').slice(0, 4);
      if (digits.length >= 2) {
        formattedValue = `${digits.slice(0, 2)}/${digits.slice(2)}`;
      } else {
        formattedValue = digits;
      }
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardData(prev => ({ ...prev, [name]: formattedValue }));
    // Clear error for this field
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateCard = () => {
    const newErrors: {[key: string]: string} = {};
    const cleanCardNum = cardData.cardNumber.replace(/\s/g, '');

    if (!cardData.nameOnCard.trim()) {
        newErrors.nameOnCard = 'الاسم مطلوب';
    }
    if (cleanCardNum.length < 16) {
        newErrors.cardNumber = 'رقم البطاقة غير صحيح (16 رقم)';
    }
    if (cardData.expiry.length < 5) {
        newErrors.expiry = 'التاريخ غير مكتمل';
    } else {
        const [month, year] = cardData.expiry.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        
        if (parseInt(month) < 1 || parseInt(month) > 12) {
            newErrors.expiry = 'شهر غير صحيح';
        }
        // Basic expiry check
        else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
             newErrors.expiry = 'البطاقة منتهية الصلاحية';
        }
    }
    if (cardData.cvv.length < 3) {
        newErrors.cvv = 'رمز CVV غير صحيح';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const steps = [
    { id: 'shipping', label: 'الشحن', icon: Truck },
    { id: 'payment', label: 'الدفع', icon: CreditCard },
    { id: 'review', label: 'المراجعة', icon: FileText },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  const handleNext = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (step === 'shipping') {
        // Assume HTML5 validation handles empty fields for shipping
        setStep('payment');
    }
    else if (step === 'payment') {
        if (paymentMethod === 'card') {
            if (validateCard()) {
                setStep('review');
            }
        } else {
            setStep('review');
        }
    }
  };

  const handleBackStep = () => {
    if (step === 'payment') setStep('shipping');
    else if (step === 'review') setStep('payment');
  };

  const generateOrderMessage = () => {
    // Use lastOrderCart if in success step (because global cart might be empty now)
    const targetCart = step === 'success' ? lastOrderCart : cart;
    const targetTotal = targetCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const itemsList = targetCart.map(i => `- ${i.name} (${i.quantity})`).join('\n');
    const paymentMethodText = paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'بطاقة بنكية';
    
    return `طلب جديد من متجر أرغانيا
------------------
العميل: ${formData.firstName} ${formData.lastName}
العنوان: ${formData.city}, ${formData.address}
الهاتف: ${formData.phone}
البريد: ${formData.email}
------------------
المنتجات:
${itemsList}
------------------
طريقة الدفع: ${paymentMethodText}
المجموع: ${targetTotal} درهم`;
  };

  const handleWhatsAppOrder = () => {
    const msg = encodeURIComponent(generateOrderMessage());
    window.open(`https://wa.me/212681736149?text=${msg}`, '_blank');
  };

  const handleEmailOrder = () => {
    const subject = encodeURIComponent(`طلب جديد من متجر أرغانيا - ${formData.firstName} ${formData.lastName}`);
    // Replace newlines with %0D%0A for email body compatibility
    const bodyText = generateOrderMessage().replace(/\n/g, '\r\n');
    const body = encodeURIComponent(bodyText);
    
    // Direct link to open email client sending TO the owner using location.href to avoid empty tab
    window.location.href = `mailto:lahcenidir700@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleFinalSubmit = () => {
    setLoading(true);
    // Snapshot the cart items before they get cleared
    setLastOrderCart([...cart]);
    
    // Save to Database via parent
    onPlaceOrder({
      ...formData,
      paymentMethod
    });

    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 1500);
  };

  // Determine items to display in summary
  // During success/loading transition, use lastOrderCart if cart is cleared
  const displayCart = cart.length > 0 ? cart : lastOrderCart;
  const displayTotal = cart.length > 0 ? total : displayCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Helper to get input classes
  const getInputClasses = (hasError: boolean, hasIcon: boolean = true) => `
    w-full ${hasIcon ? 'pr-10' : 'px-4'} pl-4 py-3 
    bg-gray-50 border rounded-xl outline-none 
    focus:ring-2 focus:ring-gold-500 focus:border-transparent 
    transition-all placeholder-gray-400
    ${hasError ? 'border-red-500 focus:ring-red-500 ring-red-100' : 'border-gray-200'}
  `;

  if (step === 'success') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in-up py-12">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h2 className="text-4xl font-serif font-bold text-soil-900 mb-4">تم تسجيل طلبك بنجاح!</h2>
        <p className="text-gray-600 text-lg mb-8 max-w-md">
          شكراً لثقتك في أرغانيا. لإتمام العملية بسرعة، يرجى الضغط على الزر أدناه لإرسال رسالة تأكيد الطلب إلينا.
        </p>

        <div className="flex flex-col gap-4 w-full max-w-md">
            <button 
                onClick={handleWhatsAppOrder}
                className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#20bd5a] transition-colors shadow-lg flex items-center justify-center gap-2 animate-pulse"
            >
                <MessageCircle size={24} />
                <span>تأكيد الطلب عبر واتساب (ينصح به)</span>
            </button>
            
            <button 
                onClick={handleEmailOrder}
                className="w-full bg-soil-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gold-600 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
                <Mail size={24} />
                <span>تأكيد عبر البريد الإلكتروني</span>
            </button>
        </div>

        <button 
          onClick={() => onPlaceOrder()} // No args means reset view to home
          className="mt-8 text-gray-500 hover:text-soil-900 underline underline-offset-4"
        >
          العودة للصفحة الرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-24 bg-white min-h-screen">
      {/* Header Actions */}
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gold-600 transition-colors"
        >
          <ArrowRight size={20} />
          <span>العودة للتسوق</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 transform -translate-y-1/2 rounded-full"></div>
        <div 
            className="absolute top-1/2 right-0 h-1 bg-gold-500 -z-10 transform -translate-y-1/2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        ></div>
        
        <div className="flex justify-between w-full max-w-3xl mx-auto">
          {steps.map((s, index) => {
            const Icon = s.icon;
            const isActive = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div key={s.id} className="flex flex-col items-center gap-2 bg-white px-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isActive 
                    ? 'bg-gold-500 border-gold-500 text-white shadow-lg scale-110' 
                    : 'bg-white border-gray-200 text-gray-400'
                }`}>
                  <Icon size={20} />
                </div>
                <span className={`text-sm font-bold transition-colors duration-300 ${
                  isCurrent ? 'text-soil-900' : isActive ? 'text-gold-600' : 'text-gray-400'
                }`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left Column: Form Steps */}
        <div className="bg-white">
          
          {/* Step 1: Shipping */}
          {step === 'shipping' && (
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-serif font-bold text-soil-900 mb-6">معلومات الشحن</h2>
              <form onSubmit={handleNext} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-soil-800">الاسم الأول</label>
                    <div className="relative">
                      <User className="absolute right-3 top-3 text-gray-400" size={18} />
                      <input 
                        required 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        type="text" 
                        className={getInputClasses(false)} 
                        placeholder="الاسم" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-soil-800">اسم العائلة</label>
                    <div className="relative">
                      <User className="absolute right-3 top-3 text-gray-400" size={18} />
                      <input 
                        required 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        type="text" 
                        className={getInputClasses(false)} 
                        placeholder="العائلة" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-soil-800">رقم الهاتف</label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-3 text-gray-400" size={18} />
                    <input 
                      required 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      type="tel" 
                      className={getInputClasses(false)} 
                      placeholder="0600000000" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-soil-800">البريد الإلكتروني (اختياري)</label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-3 text-gray-400" size={18} />
                    <input 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      type="email" 
                      className={getInputClasses(false)} 
                      placeholder="email@example.com" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-soil-800">العنوان الكامل</label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-3 text-gray-400" size={18} />
                    <input 
                      required 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      type="text" 
                      className={getInputClasses(false)} 
                      placeholder="الحي، الشارع، رقم المنزل" 
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-soil-800">المدينة</label>
                    <input 
                      required 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      type="text" 
                      className={getInputClasses(false, false)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-soil-800">الرمز البريدي</label>
                    <input 
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      type="text" 
                      className={getInputClasses(false, false)} 
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-soil-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gold-600 transition-colors shadow-lg flex items-center justify-center gap-2 mt-8"
                >
                  <span>متابعة للدفع</span>
                  <ChevronLeft size={20} className="rtl:rotate-180" />
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 'payment' && (
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-serif font-bold text-soil-900 mb-6">طريقة الدفع</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <button
                      onClick={() => setPaymentMethod('cod')}
                      className={`cursor-pointer border-2 rounded-xl p-6 flex flex-col items-center gap-3 transition-all duration-300 hover:scale-[1.02] hover:border-gold-400 ${paymentMethod === 'cod' ? 'border-gold-500 bg-gold-50 ring-1 ring-gold-500' : 'border-gray-200 bg-white'}`}
                  >
                      <div className={`p-3 rounded-full ${paymentMethod === 'cod' ? 'bg-gold-200 text-gold-800' : 'bg-gray-100 text-gray-500'}`}>
                        <Banknote size={32} />
                      </div>
                      <div className="text-center">
                        <span className="font-bold block text-soil-900">الدفع عند الاستلام</span>
                        <span className="text-xs text-gray-500">ادفع نقداً عند وصول طلبك</span>
                      </div>
                      {paymentMethod === 'cod' && <CheckCircle size={20} className="text-gold-600 mt-2" />}
                  </button>
                  <button
                      onClick={() => setPaymentMethod('card')}
                      className={`cursor-pointer border-2 rounded-xl p-6 flex flex-col items-center gap-3 transition-all duration-300 hover:scale-[1.02] hover:border-gold-400 ${paymentMethod === 'card' ? 'border-gold-500 bg-gold-50 ring-1 ring-gold-500' : 'border-gray-200 bg-white'}`}
                  >
                      <div className={`p-3 rounded-full ${paymentMethod === 'card' ? 'bg-gold-200 text-gold-800' : 'bg-gray-100 text-gray-500'}`}>
                        <CreditCard size={32} />
                      </div>
                      <div className="text-center">
                        <span className="font-bold block text-soil-900">بطاقة بنكية</span>
                        <span className="text-xs text-gray-500">دفع آمن عبر الإنترنت</span>
                      </div>
                       {paymentMethod === 'card' && <CheckCircle size={20} className="text-gold-600 mt-2" />}
                  </button>
              </div>

              {/* Card Information Form */}
              {paymentMethod === 'card' && (
                  <div className="mt-6 p-6 rounded-xl border border-gray-200 animate-fade-in-up bg-white shadow-sm">
                      <h3 className="font-bold text-soil-900 mb-4 flex items-center gap-2">
                          <CreditCard size={18} className="text-gold-600" />
                          بيانات البطاقة
                      </h3>
                      <div className="space-y-4">
                          <div className="space-y-2">
                              <label className="text-sm font-bold text-soil-800">الاسم على البطاقة</label>
                              <div className="relative">
                                  <User className="absolute right-3 top-3 text-gray-400" size={18} />
                                  <input
                                      type="text"
                                      name="nameOnCard"
                                      value={cardData.nameOnCard}
                                      onChange={handleCardChange}
                                      className={getInputClasses(!!errors.nameOnCard)}
                                      placeholder="الاسم كما يظهر على البطاقة"
                                  />
                              </div>
                              {errors.nameOnCard && <p className="text-red-500 text-xs">{errors.nameOnCard}</p>}
                          </div>
                          
                          <div className="space-y-2">
                              <label className="text-sm font-bold text-soil-800">رقم البطاقة</label>
                              <div className="relative">
                                  <CreditCard className="absolute right-3 top-3 text-gray-400" size={18} />
                                  <input
                                      type="text"
                                      name="cardNumber"
                                      value={cardData.cardNumber}
                                      onChange={handleCardChange}
                                      className={getInputClasses(!!errors.cardNumber)}
                                      placeholder="0000 0000 0000 0000"
                                      dir="ltr"
                                  />
                              </div>
                              {errors.cardNumber && <p className="text-red-500 text-xs">{errors.cardNumber}</p>}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                  <label className="text-sm font-bold text-soil-800">تاريخ الانتهاء</label>
                                  <div className="relative">
                                      <Calendar className="absolute right-3 top-3 text-gray-400" size={18} />
                                      <input
                                          type="text"
                                          name="expiry"
                                          value={cardData.expiry}
                                          onChange={handleCardChange}
                                          className={getInputClasses(!!errors.expiry)}
                                          placeholder="MM/YY"
                                          dir="ltr"
                                      />
                                  </div>
                                   {errors.expiry && <p className="text-red-500 text-xs">{errors.expiry}</p>}
                              </div>
                              <div className="space-y-2">
                                  <label className="text-sm font-bold text-soil-800">CVV</label>
                                  <div className="relative">
                                      <Lock className="absolute right-3 top-3 text-gray-400" size={18} />
                                      <input
                                          type="password"
                                          name="cvv"
                                          value={cardData.cvv}
                                          onChange={handleCardChange}
                                          className={getInputClasses(!!errors.cvv)}
                                          placeholder="123"
                                          dir="ltr"
                                          maxLength={4}
                                      />
                                  </div>
                                   {errors.cvv && <p className="text-red-500 text-xs">{errors.cvv}</p>}
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              <div className="flex gap-4 mt-8">
                 <button 
                  onClick={handleBackStep}
                  className="w-1/3 bg-gray-100 text-soil-800 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors"
                >
                  رجوع
                </button>
                <button 
                  onClick={() => handleNext()}
                  className="flex-1 bg-soil-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gold-600 transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <span>متابعة للمراجعة</span>
                  <ChevronLeft size={20} className="rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 'review' && (
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-serif font-bold text-soil-900 mb-6">مراجعة الطلب</h2>
              
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-6 mb-8">
                <div>
                   <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-soil-800 flex items-center gap-2">
                        <MapPin size={18} className="text-gold-600" />
                         عنوان التوصيل
                      </h3>
                      <button onClick={() => setStep('shipping')} className="text-xs text-gold-600 hover:underline">تعديل</button>
                   </div>
                   <p className="text-gray-600 text-sm leading-relaxed pr-6">
                      {formData.firstName} {formData.lastName}<br/>
                      {formData.address}<br/>
                      {formData.city}, {formData.zip}<br/>
                      {formData.phone}
                   </p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                   <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-soil-800 flex items-center gap-2">
                        <CreditCard size={18} className="text-gold-600" />
                         طريقة الدفع
                      </h3>
                      <button onClick={() => setStep('payment')} className="text-xs text-gold-600 hover:underline">تعديل</button>
                   </div>
                   <p className="text-gray-600 text-sm pr-6">
                      {paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'بطاقة بنكية'}
                   </p>
                   {paymentMethod === 'card' && (
                       <p className="text-gray-500 text-xs pr-6 mt-1" dir="ltr">
                           Card ending in {cardData.cardNumber.slice(-4)}
                       </p>
                   )}
                </div>
              </div>

              <div className="flex gap-4">
                 <button 
                  onClick={handleBackStep}
                  disabled={loading}
                  className="w-1/3 bg-gray-100 text-soil-800 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors"
                >
                  رجوع
                </button>
                <button 
                  onClick={handleFinalSubmit}
                  disabled={loading}
                  className="flex-1 bg-soil-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gold-600 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                       جاري المعالجة...
                    </span>
                  ) : (
                    <span>تأكيد الطلب</span>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Order Summary (Persistent) */}
        <div className="hidden lg:block">
            <div className="bg-soil-50 p-8 rounded-3xl sticky top-24 border border-gold-200 shadow-xl">
                <h2 className="text-xl font-serif font-bold text-soil-900 mb-6">ملخص السلة</h2>

                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {displayCart.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center bg-white p-3 rounded-xl shadow-sm">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                            <div className="flex-1">
                                <h4 className="font-bold text-soil-900 text-sm">{item.name}</h4>
                                <div className="flex justify-between items-center mt-1">
                                  <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                                  <span className="font-bold text-gold-600 text-sm">{item.price * item.quantity} درهم</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div className="flex justify-between text-gray-600 text-sm">
                        <span>المجموع الفرعي</span>
                        <span>{displayTotal} درهم</span>
                    </div>
                    <div className="flex justify-between text-gray-600 text-sm">
                        <span>الشحن</span>
                        <span className="text-green-600 font-bold">مجاني</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-soil-900 pt-2 border-t border-gray-200">
                        <span>الإجمالي</span>
                        <span>{displayTotal} درهم</span>
                    </div>
                </div>
                
                <div className="mt-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 text-soil-800 mb-2">
                        <CheckCircle size={16} className="text-gold-500" />
                        <span className="text-xs font-bold">ضمان استرجاع الأموال</span>
                    </div>
                    <div className="flex items-center gap-3 text-soil-800 mb-2">
                        <CheckCircle size={16} className="text-gold-500" />
                        <span className="text-xs font-bold">منتجات أصلية 100%</span>
                    </div>
                    <div className="flex items-center gap-3 text-soil-800">
                        <CheckCircle size={16} className="text-gold-500" />
                        <span className="text-xs font-bold">شحن آمن وسريع</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Mobile Summary Toggle (Optional - simplified for now) */}
        <div className="lg:hidden mt-8 border-t pt-8">
            <h3 className="font-bold text-soil-900 mb-4">ملخص الطلب ({displayTotal} درهم)</h3>
             <div className="flex -space-x-4 space-x-reverse overflow-x-auto pb-4">
                {displayCart.map((item) => (
                    <img key={item.id} src={item.image} alt={item.name} className="w-16 h-16 rounded-lg border-2 border-white shadow-md flex-shrink-0" />
                ))}
             </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
