import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Briefcase, Gamepad2, MessageSquare, Home, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const navItems = [
  { id: 'hero', label: 'Home', icon: Home },
  { id: 'work', label: 'Work', icon: Briefcase },
  { id: 'creative', label: 'Creative', icon: Palette },
  { id: 'playground', label: 'Play', icon: Gamepad2 },
  { id: 'contact', label: 'Contact', icon: MessageSquare },
];

export function Navigation({ activeSection, onNavigate }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation - Floating Dock */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: isScrolled ? 0 : -100, 
          opacity: isScrolled ? 1 : 0 
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:block"
      >
        <div className="glass-strong rounded-full px-2 py-2 flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  'relative px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all duration-300',
                  isActive 
                    ? 'text-white' 
                    : 'text-white/50 hover:text-white/80'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Menu Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: isScrolled ? 1 : 0 }}
          onClick={() => setIsMobileMenuOpen(true)}
          className={cn(
            'fixed top-4 right-4 z-50 w-12 h-12 glass rounded-full flex items-center justify-center',
            !isScrolled && 'pointer-events-none'
          )}
        >
          <Menu className="w-5 h-5 text-white" />
        </motion.button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-void/98 backdrop-blur-xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 w-12 h-12 glass rounded-full flex items-center justify-center"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Nav Items */}
              <div className="h-full flex flex-col items-center justify-center gap-6">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleNavClick(item.id)}
                      className={cn(
                        'flex items-center gap-4 text-3xl font-semibold transition-colors',
                        isActive ? 'text-electric' : 'text-white/50'
                      )}
                    >
                      <Icon className="w-8 h-8" />
                      {item.label}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Mobile Dock (always visible on mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="glass-strong mx-4 mb-4 rounded-2xl px-2 py-2 flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  'relative p-3 rounded-xl transition-colors',
                  isActive ? 'text-electric' : 'text-white/50'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeMobileNav"
                    className="absolute inset-0 bg-electric/10 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
