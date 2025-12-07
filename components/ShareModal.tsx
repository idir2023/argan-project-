
import React, { useState } from 'react';
import { X, Link, Facebook, Twitter, Mail, MessageCircle, Check } from 'lucide-react';
import { Product } from '../types';

interface ShareModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ product, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  const shareUrl = window.location.href.split('#')[0] + `#products`; // Point to products section
  const shareText = `اكتشفي ${product.name} من أرغانيا - ذهب المغرب السائل. ${product.description}`;
  
  const socialLinks = [
    {
      name: 'واتساب',
      icon: MessageCircle,
      color: 'bg-[#25D366] hover:bg-[#20bd5a]',
      url: `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`
    },
    {
      name: 'فيسبوك',
      icon: Facebook,
      color: 'bg-[#1877F2] hover:bg-[#166fe5]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'تويتر (X)',
      icon: Twitter,
      color: 'bg-black hover:bg-gray-800',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'البريد',
      icon: Mail,
      color: 'bg-gray-600 hover:bg-gray-700',
      url: `mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`
    }
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] transition-opacity animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-3xl shadow-2xl z-[120] overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="bg-soil-900 p-5 flex justify-between items-center text-white">
          <h2 className="text-lg font-bold font-serif">مشاركة المنتج</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Product Preview */}
        <div className="p-4 bg-gray-50 flex gap-3 items-center border-b border-gray-100">
             <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
             <div className="overflow-hidden">
                 <h3 className="font-bold text-soil-900 text-sm truncate">{product.name}</h3>
                 <p className="text-xs text-gold-600 font-medium truncate">{product.category}</p>
             </div>
        </div>

        {/* Share Options */}
        <div className="p-6 grid grid-cols-2 gap-4">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${link.color} text-white p-3 rounded-xl flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105 shadow-sm`}
              >
                <Icon size={24} />
                <span className="text-xs font-bold">{link.name}</span>
              </a>
            );
          })}
        </div>

        {/* Copy Link Action */}
        <div className="px-6 pb-6">
          <button
            onClick={handleCopyLink}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${
              copied 
                ? 'bg-green-50 border-green-500 text-green-700' 
                : 'bg-white border-gray-200 text-soil-800 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            {copied ? <Check size={18} /> : <Link size={18} />}
            <span className="text-sm">{copied ? 'تم النسخ!' : 'نسخ الرابط'}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ShareModal;
