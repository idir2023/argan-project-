
import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType) => void;
}

type AuthMode = 'login' | 'signup' | 'verify';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (mode === 'signup') {
        setMode('verify');
      } else if (mode === 'login') {
        // Simulate login success
        onLogin({
          name: 'عميل أرغانيا', // Default name for demo if logging in without signup
          email: formData.email
        });
        onClose();
      }
    }, 1500);
  };

  const handleVerification = () => {
    setLoading(true);
    // Simulate verifying link click
    setTimeout(() => {
      setLoading(false);
      onLogin({
        name: formData.name,
        email: formData.email
      });
      onClose();
    }, 1500);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] transition-opacity"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[90] overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="relative h-32 bg-soil-900 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/moroccan-flower.png')]"></div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
          <h2 className="text-3xl font-serif font-bold text-gold-400 relative z-10">
            {mode === 'login' && 'تسجيل الدخول'}
            {mode === 'signup' && 'إنشاء حساب'}
            {mode === 'verify' && 'تأكيد البريد'}
          </h2>
        </div>

        {/* Body */}
        <div className="p-8">
          
          {mode === 'verify' ? (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gold-100 rounded-full flex items-center justify-center mx-auto">
                <Mail size={40} className="text-gold-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-soil-900 mb-2">تحقق من بريدك الإلكتروني</h3>
                <p className="text-gray-600 text-sm">
                  لقد أرسلنا رابط تأكيد إلى <strong>{formData.email}</strong>.<br/>
                  يرجى النقر على الرابط في الرسالة لتفعيل حسابك.
                </p>
              </div>
              
              <div className="border-t border-gray-100 pt-6">
                <p className="text-xs text-gray-400 mb-4">محاكاة (لأغراض العرض التوضيحي):</p>
                <button 
                  onClick={handleVerification}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle size={20} />}
                  <span>محاكاة: تم النقر على الرابط</span>
                </button>
              </div>
              
              <button 
                onClick={() => setMode('signup')}
                className="text-sm text-gray-500 hover:text-soil-900"
              >
                تغيير البريد الإلكتروني
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-soil-800">الاسم الكامل</label>
                  <div className="relative">
                    <User className="absolute right-3 top-3 text-gray-400" size={20} />
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pr-12 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                      placeholder="الاسم"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-soil-800">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 text-gray-400" size={20} />
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pr-12 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-soil-800">كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 text-gray-400" size={20} />
                  <input 
                    type="password" 
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pr-12 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-soil-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gold-600 transition-colors shadow-lg flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'login' ? 'دخول' : 'متابعة'}</span>
                    <ArrowLeft size={20} />
                  </>
                )}
              </button>

              <div className="text-center pt-4">
                <span className="text-gray-500 text-sm">
                  {mode === 'login' ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
                </span>
                <button 
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="mr-2 text-gold-600 font-bold hover:underline"
                >
                  {mode === 'login' ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthModal;
