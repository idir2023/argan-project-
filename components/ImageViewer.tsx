
import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';

interface ImageViewerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ product, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Normalize images array
  const images = product ? (product.images && product.images.length > 0 ? product.images : [product.image]) : [];

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNext = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  // Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  const getHighResUrl = (url: string) => {
    try {
        if (url.includes('unsplash.com')) {
            const urlObj = new URL(url);
            urlObj.searchParams.set('w', '1600'); // High Res
            urlObj.searchParams.set('q', '90');
            return urlObj.toString();
        }
        return url;
    } catch {
        return url;
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div 
      className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center animate-fade-in backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close Button */}
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 md:top-6 md:right-6 text-white/60 hover:text-white p-2 z-50 transition-colors"
      >
        <X size={32} />
      </button>

      {/* Navigation Buttons (Desktop) */}
      {images.length > 1 && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); handlePrev(); }} 
            className="absolute left-2 md:left-8 text-white/50 hover:text-white p-3 hover:bg-white/10 rounded-full transition-all hidden md:block z-50"
          >
            <ChevronLeft size={48} />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); handleNext(); }} 
            className="absolute right-2 md:right-8 text-white/50 hover:text-white p-3 hover:bg-white/10 rounded-full transition-all hidden md:block z-50"
          >
            <ChevronRight size={48} />
          </button>
        </>
      )}

      {/* Main Content */}
      <div 
        className="flex flex-col items-center justify-center gap-6 w-full h-full p-4 md:p-10" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Image */}
        <div 
            className="relative w-full h-[60vh] md:h-[75vh] flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
          <img 
            src={getHighResUrl(images[currentIndex])} 
            alt={`${product.name} - View ${currentIndex + 1}`} 
            className="max-w-full max-h-full object-contain rounded-md shadow-2xl animate-fade-in select-none"
            key={currentIndex} // Force re-render for animation
            draggable={false}
          />
        </div>
        
        {/* Info & Dots */}
        <div className="flex flex-col items-center gap-4 w-full max-w-4xl">
            <h3 className="text-white text-xl md:text-2xl font-serif font-bold text-center">
                {product.name}
                <span className="block text-sm font-sans font-normal text-white/50 mt-1">
                    {currentIndex + 1} / {images.length}
                </span>
            </h3>

            {/* Dots Indicator */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentIndex ? 'bg-gold-500 w-4' : 'bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Thumbnails (optional, kept for larger screens) */}
            {images.length > 1 && (
                <div className="hidden md:flex gap-3 overflow-x-auto py-2 px-4 max-w-full custom-scrollbar">
                    {images.map((img, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                idx === currentIndex 
                                    ? 'border-gold-500 scale-105 opacity-100 ring-2 ring-gold-500/50' 
                                    : 'border-transparent opacity-40 hover:opacity-80'
                            }`}
                        >
                            <img 
                                src={img} 
                                alt={`Thumbnail ${idx}`} 
                                className="w-full h-full object-cover" 
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
