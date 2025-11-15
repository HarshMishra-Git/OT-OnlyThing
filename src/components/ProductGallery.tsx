import { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden border-2 border-gray-200 group">
          <div
            className="relative w-full h-full cursor-zoom-in"
            onClick={() => setIsZoomed(!isZoomed)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <img
              src={images[selectedIndex]}
              alt={`${productName} - Image ${selectedIndex + 1}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300"
              style={{
                transform: isZoomed ? `scale(2)` : 'scale(1)',
                transformOrigin: isZoomed ? `${mousePosition.x}% ${mousePosition.y}%` : 'center',
              }}
            />
            
            {/* Zoom Hint */}
            {!isZoomed && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-sm">
                <div className="px-6 py-3 bg-white text-black font-bold rounded-full flex items-center gap-2">
                  <Maximize2 size={18} />
                  Click to Zoom
                </div>
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
          >
            <Maximize2 size={18} />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/80 backdrop-blur-sm text-white text-sm font-bold rounded-full">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                  selectedIndex === index
                    ? 'border-black shadow-lg'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <img
                  src={image}
                  alt={`${productName} - Thumbnail ${index + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
          >
            <X size={24} className="text-white" />
          </button>

          <button
            onClick={handlePrevious}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110"
          >
            <ChevronLeft size={28} className="text-white" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110"
          >
            <ChevronRight size={28} className="text-white" />
          </button>

          <div className="max-w-5xl max-h-[90vh] mx-auto px-20">
            <img
              src={images[selectedIndex]}
              alt={`${productName} - Image ${selectedIndex + 1}`}
              loading="lazy"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Lightbox Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm font-bold rounded-full">
            {selectedIndex + 1} / {images.length}
          </div>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 max-w-md overflow-x-auto px-4">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedIndex === index
                    ? 'border-white scale-110'
                    : 'border-white/30 hover:border-white/60'
                }`}
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} loading="lazy" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
