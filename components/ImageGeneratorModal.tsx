
import React, { useState } from 'react';
import { X, Sparkles, Image as ImageIcon, Download, Loader2, Palette } from 'lucide-react';
import { generateArganImage } from '../services/geminiService';

interface ImageGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImageGeneratorModal: React.FC<ImageGeneratorModalProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('A set of Moroccan Argan oil bottles and Argan nuts, beautifully arranged on a wooden table with natural light, realistic product photography, minimal background, warm and bright tones, high-quality professional image suitable for an online store banner or product listing');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setError(null);
    setGeneratedImage(null);
    setLoading(true);

    try {
      // API Key Selection Logic for Paid Model
      // Using 'any' cast for window to access aistudio which might not be in standard Window interface
      const aiStudio = (window as any).aistudio;
      if (aiStudio && !await aiStudio.hasSelectedApiKey()) {
         await aiStudio.openSelectKey();
         // Assume success and proceed to mitigate race condition
      }

      const image = await generateArganImage(prompt, size);
      if (image) {
        setGeneratedImage(image);
      } else {
        setError("لم يتم إنشاء الصورة، يرجى المحاولة مرة أخرى.");
      }
    } catch (err: any) {
      console.error("Image Gen Error:", err);
      const errorMessage = err.message || JSON.stringify(err);
      
      // Handle Permission Denied (403) or Not Found (Invalid Key)
      if (
        errorMessage.includes("PERMISSION_DENIED") || 
        errorMessage.includes("The caller does not have permission") ||
        errorMessage.includes("Requested entity was not found") ||
        errorMessage.includes("403")
      ) {
         const aiStudio = (window as any).aistudio;
         if (aiStudio) {
             try {
                await aiStudio.openSelectKey();
             } catch (e) {
                console.error("Error opening key selector:", e);
             }
         }
         setError("هذا النموذج يتطلب مفتاح API من مشروع مدفوع (GCP Paid Project). يرجى اختيار مفتاح صالح.");
      } else {
         setError("حدث خطأ أثناء إنشاء الصورة. تأكد من اتصالك وحاول مجدداً.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90] transition-opacity"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl bg-white rounded-3xl shadow-2xl z-[100] overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-soil-900 to-soil-800 p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="bg-gold-500/20 p-2 rounded-lg">
              <Palette size={24} className="text-gold-400" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-gold-100">استوديو أرغانيا</h2>
              <p className="text-xs text-gray-300">صمم إبداعاتك بالذكاء الاصطناعي</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          <div className="space-y-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-soil-800 block">وصف الصورة (Prompt)</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="مثال: زجاجة زيت أرغان فاخرة على طاولة خشبية وسط الطبيعة المغربية وقت الغروب..."
                  className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none resize-none text-sm"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-soil-800 block">الدقة (Size)</label>
                <div className="flex gap-4">
                  {(['1K', '2K', '4K'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 text-sm font-bold transition-all ${
                        size === s 
                          ? 'border-gold-500 bg-gold-50 text-soil-900' 
                          : 'border-gray-200 text-gray-500 hover:border-gold-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full bg-soil-900 text-white py-3 rounded-xl font-bold hover:bg-gold-600 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>جاري الرسم... (قد يستغرق لحظات)</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>إنشاء الصورة</span>
                  </>
                )}
              </button>
              
              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-100 animate-fade-in">
                  <p className="font-bold mb-1">تنبيه</p>
                  <p>{error}</p>
                </div>
              )}
            </div>

            {/* Result Section */}
            {generatedImage && (
              <div className="border-t border-gray-100 pt-6 animate-fade-in">
                <h3 className="text-lg font-bold text-soil-900 mb-4 flex items-center gap-2">
                  <ImageIcon size={20} className="text-gold-600" />
                  النتيجة
                </h3>
                <div className="relative group rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-gray-100 min-h-[300px] flex items-center justify-center">
                  <img 
                    src={generatedImage} 
                    alt="Generated Art" 
                    className="w-full h-auto object-contain max-h-[400px]" 
                  />
                  <a 
                    href={generatedImage} 
                    download={`argania-design-${Date.now()}.png`}
                    className="absolute bottom-4 right-4 bg-white text-soil-900 px-4 py-2 rounded-full shadow-lg font-bold flex items-center gap-2 hover:bg-gold-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
                  >
                    <Download size={18} />
                    <span>تحميل</span>
                  </a>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
               باستخدام نموذج <code>gemini-3-pro-image-preview</code>. يتطلب مفتاح API مدفوع.
            </p>
             <div className="mt-2 text-xs text-gray-400">
                 <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-gold-600">
                   معلومات الفوترة
                 </a>
             </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ImageGeneratorModal;
