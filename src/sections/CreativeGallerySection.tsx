import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Youtube, Sparkles, Camera, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { YouTubePopup } from '@/components/YouTubePopup';

interface GalleryImage {
  src: string;
  title: string;
  description: string;
  category: 'photo-manipulation' | 'motion-graphics' | 'tutorial';
}

const fourMarfelousImages: GalleryImage[] = [
  { src: '/images/projects/fourmarfelous/Marfelous-0.jpg', title: 'The Wizard', description: 'Magical photo manipulation with glowing green effects emanating from an ancient book.', category: 'photo-manipulation' },
  { src: '/images/projects/fourmarfelous/Marfelous-2.jpg', title: 'Fire Butterfly', description: 'Creative composition featuring fire butterflies emerging from darkness.', category: 'photo-manipulation' },
  { src: '/images/projects/fourmarfelous/Marfelous-5.jpg', title: 'The Portal', description: 'Doctor Strange-inspired portal effect with spinning sparks and dramatic sky.', category: 'photo-manipulation' },
  { src: '/images/projects/fourmarfelous/Marfelous-6.jpg', title: 'Levitation', description: 'Floating photography composition with scattered memories and photos.', category: 'photo-manipulation' },
  { src: '/images/projects/fourmarfelous/Marfelous-7.jpg', title: 'Mystical Portal', description: 'Another portal creation with different lighting and environment.', category: 'photo-manipulation' },
  { src: '/images/projects/fourmarfelous/Marfelous-9.jpg', title: 'The Reader', description: 'Creative levitation shot with floating photographs around the subject.', category: 'photo-manipulation' },
  { src: '/images/projects/fourmarfelous/Marfelous-10.jpg', title: 'Fire Portal', description: 'Fiery portal effect with dramatic sparks and energy.', category: 'photo-manipulation' },
  { src: '/images/projects/fourmarfelous/Marfelous-13.jpg', title: 'Mystical Energy', description: 'Green magical energy effects with atmospheric lighting.', category: 'photo-manipulation' },
  { src: '/images/projects/fourmarfelous/Marfelous-15.jpg', title: 'The Conjurer', description: 'Magical spell casting with dramatic green smoke effects.', category: 'photo-manipulation' },
  { src: '/images/projects/fourmarfelous/Marfelous-16.jpg', title: 'Energy Burst', description: 'Intense magical energy emanating from the subject.', category: 'photo-manipulation' },
  { src: '/images/projects/fourmarfelous/Marfelous-17.jpg', title: 'The Spellbook', description: 'Wizard reading from an enchanted book with magical aura.', category: 'photo-manipulation' },
  { src: '/images/projects/fourmarfelous/Marfelous-18.jpg', title: 'Butterfly Magic', description: 'Gentle butterfly effects with warm lighting.', category: 'photo-manipulation' },
  { src: '/images/projects/fourmarfelous/Marfelous-20.jpg', title: 'Portal Master', description: 'Creating a dimensional portal with intense visual effects.', category: 'photo-manipulation' },
  { src: '/images/projects/fourmarfelous/Marfelous-21.jpg', title: 'Memory Lane', description: 'Floating memories visualization with scattered photographs.', category: 'photo-manipulation' },
  { src: '/images/projects/fourmarfelous/Marfelous-22.jpg', title: 'The Magician', description: 'Performing magic with dramatic lighting and effects.', category: 'photo-manipulation' },
  { src: '/images/projects/fourmarfelous/Marfelous-23.jpg', title: 'Fire Magic', description: 'Intense fire effects with sparks and energy.', category: 'photo-manipulation' },
  { src: '/images/projects/fourmarfelous/Marfelous-24.jpg', title: 'The Sorcerer', description: 'Powerful magical being with glowing effects.', category: 'photo-manipulation' },
  { src: '/images/projects/fourmarfelous/Marfelous-29.jpg', title: 'Dimensional Rift', description: 'Opening a portal between dimensions.', category: 'photo-manipulation' },
  { src: '/images/projects/fourmarfelous/Marfelous-32.jpg', title: 'The Enchanter', description: 'Casting enchantments with mystical energy.', category: 'photo-manipulation' },
  { src: '/images/projects/fourmarfelous/Marfelous-33.jpg', title: 'Magic Unleashed', description: 'Unleashing powerful magical forces.', category: 'photo-manipulation' },
  { src: '/images/projects/fourmarfelous/Marfelous-34.jpg', title: 'The Vision', description: 'Seeing through magical visions and prophecies.', category: 'photo-manipulation' },
  { src: '/images/projects/fourmarfelous/Marfelous-35.jpg', title: 'Butterfly Dreams', description: 'Dreamy composition with delicate butterfly effects.', category: 'photo-manipulation' },
];

// Image Lightbox Component
function ImageLightbox({ 
  isOpen, 
  onClose, 
  images, 
  currentIndex,
  onNavigate 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  images: GalleryImage[]; 
  currentIndex: number;
  onNavigate: (index: number) => void;
}) {
  if (!images.length) return null;

  const currentImage = images[currentIndex];

  const nextImage = () => {
    onNavigate((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    onNavigate((currentIndex - 1 + images.length) % images.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] bg-black/98 backdrop-blur-2xl border-white/10 p-0 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 flex-shrink-0">
            <div>
              <h3 className="font-semibold text-lg">{currentImage.title}</h3>
              <p className="text-sm text-white/50">{currentIndex + 1} of {images.length}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image Viewer - Full Width */}
          <div className="flex-1 flex items-center justify-center relative px-20 py-4 overflow-auto">
            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image - Full display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center w-full h-full"
              >
                <img
                  src={currentImage.src}
                  alt={currentImage.title}
                  className="max-w-full max-h-[70vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Caption */}
          <div className="p-6 text-center flex-shrink-0">
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/70 max-w-2xl mx-auto"
            >
              {currentImage.description}
            </motion.p>
          </div>

          {/* Thumbnail Strip */}
          <div className="p-4 border-t border-white/10 flex-shrink-0">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => onNavigate(idx)}
                  className={cn(
                    'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
                    currentIndex === idx ? 'border-electric' : 'border-transparent opacity-50 hover:opacity-75'
                  )}
                >
                  <img src={img.src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CreativeGallerySection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'photo-manipulation'>('all');
  const [showYouTubePopup, setShowYouTubePopup] = useState(false);

  const filteredImages = filter === 'all' 
    ? fourMarfelousImages 
    : fourMarfelousImages.filter(img => img.category === filter);

  return (
    <section id="creative" className="relative min-h-screen py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-electric text-sm font-medium uppercase tracking-widest mb-4 block">
            Creative Work
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Four <span className="text-gradient">Marfelous</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            A creative journey through photo manipulation, motion graphics, and visual storytelling. 
            Explore magical worlds, portals, and imaginative compositions.
          </p>

          {/* YouTube Channel Link - Opens Popup */}
          <button
            onClick={() => setShowYouTubePopup(true)}
            className="inline-flex items-center gap-3 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full font-medium transition-colors"
          >
            <Youtube className="w-5 h-5" />
            Subscribe on YouTube
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 gap-8 max-w-lg mx-auto mb-12"
        >
          {[
            { value: '22+', label: 'Creations', icon: Camera },
            { value: 'YouTube', label: 'Channel', icon: Youtube },
            { value: 'Tutorials', label: 'Available', icon: Wand2 },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-electric/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-electric" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-white/50 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center gap-2 mb-8"
        >
          {[
            { id: 'all', label: 'All Work' },
            { id: 'photo-manipulation', label: 'Photo Manipulation' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as typeof filter)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                filter === f.id
                  ? 'bg-electric text-white'
                  : 'glass text-white/60 hover:text-white'
              )}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Masonry Grid */}
        <motion.div
          layout
          className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"
        >
          <AnimatePresence>
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.src}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedImage(index)}
                className="break-inside-avoid group cursor-pointer relative overflow-hidden rounded-xl"
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <h4 className="font-semibold text-sm">{image.title}</h4>
                  <p className="text-xs text-white/60 line-clamp-2">{image.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* YouTube CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-white/40 mb-4">Want to learn how these are made?</p>
          <button
            onClick={() => setShowYouTubePopup(true)}
            className="inline-flex items-center gap-2 px-6 py-3 glass rounded-full hover:bg-white/10 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-electric" />
            Watch tutorials on YouTube
          </button>
        </motion.div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <ImageLightbox
          isOpen={selectedImage !== null}
          onClose={() => setSelectedImage(null)}
          images={filteredImages}
          currentIndex={selectedImage}
          onNavigate={setSelectedImage}
        />
      )}

      {/* YouTube Popup */}
      <YouTubePopup 
        isOpen={showYouTubePopup} 
        onClose={() => setShowYouTubePopup(false)} 
      />
    </section>
  );
}
