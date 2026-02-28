import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Youtube } from 'lucide-react';

interface YouTubePopupProps {
  isOpen: boolean;
  onClose: () => void;
  channelUrl?: string;
}

export function YouTubePopup({ isOpen, onClose, channelUrl = 'https://www.youtube.com/@FourMarfelous' }: YouTubePopupProps) {
  // Extract channel ID from URL
  const getEmbedUrl = (url: string) => {
    // Handle @username format
    if (url.includes('@')) {
      const username = url.split('@')[1];
      return `https://www.youtube.com/embed?listType=user_uploads&list=${username}`;
    }
    // Handle channel ID format
    const channelMatch = url.match(/channel\/([^/?]+)/);
    if (channelMatch) {
      return `https://www.youtube.com/channel/${channelMatch[1]}`;
    }
    return url;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Popup Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full max-w-6xl h-[85vh] bg-[#0f0f0f] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0f0f0f] border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <Youtube className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Four Marfelous</h3>
                  <p className="text-xs text-white/50">YouTube Channel</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in YouTube
                </a>
                <button
                  onClick={onClose}
                  className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>
            </div>

            {/* Browser-like address bar */}
            <div className="px-4 py-2 bg-[#1a1a1a] border-b border-white/5 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 bg-[#0f0f0f] rounded-lg px-3 py-1.5 text-sm text-white/50 flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span className="truncate">youtube.com/@FourMarfelous</span>
              </div>
            </div>

            {/* YouTube Embed */}
            <div className="flex-1 h-[calc(85vh-120px)] bg-[#0f0f0f]">
              <iframe
                src={getEmbedUrl(channelUrl)}
                title="Four Marfelous YouTube Channel"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// YouTube Button Component
interface YouTubeButtonProps {
  onClick: () => void;
  variant?: 'button' | 'link';
  children?: React.ReactNode;
}

export function YouTubeButton({ onClick, variant = 'button', children }: YouTubeButtonProps) {
  if (variant === 'link') {
    return (
      <button
        onClick={onClick}
        className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors"
      >
        <Youtube className="w-5 h-5" />
        {children || 'View Channel'}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-3 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full font-medium transition-colors text-white"
    >
      <Youtube className="w-5 h-5" />
      {children || 'Subscribe on YouTube'}
    </button>
  );
}
