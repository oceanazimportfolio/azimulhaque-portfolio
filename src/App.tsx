import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Navigation } from '@/components/Navigation';
import { AIChat, AIChatButton } from '@/components/AIChat';
import { HeroSection } from '@/sections/HeroSection';
import { WorkSection } from '@/sections/WorkSection';
import { CreativeGallerySection } from '@/sections/CreativeGallerySection';
import { PlaygroundSection } from '@/sections/PlaygroundSection';
import { ContactSection } from '@/sections/ContactSection';
import { cn } from '@/lib/utils';

// Loading Screen Component
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-void flex flex-col items-center justify-center"
    >
      {/* Logo/Brand */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <span className="text-2xl font-bold tracking-tight">
          AZIMUL<span className="text-electric">.</span>HAQUE
        </span>
      </motion.div>

      {/* Progress Circle */}
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
          />
          {/* Progress circle */}
          <motion.circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="#FF2E00"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={351.86}
            strokeDashoffset={351.86 - (351.86 * Math.min(progress, 100)) / 100}
            initial={{ strokeDashoffset: 351.86 }}
            animate={{ strokeDashoffset: 351.86 - (351.86 * Math.min(progress, 100)) / 100 }}
            transition={{ duration: 0.1 }}
          />
        </svg>
        {/* Percentage */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{Math.min(Math.round(progress), 100)}%</span>
        </div>
      </div>

      {/* Loading text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-white/40 text-sm uppercase tracking-widest"
      >
        Loading Portfolio
      </motion.p>
    </motion.div>
  );
}

// Custom Cursor Component
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device
    setIsTouch(window.matchMedia('(pointer: coarse)').matches);
    
    if (isTouch) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      // Smooth follow
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      
      if (cursor) {
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
      }
      
      requestAnimationFrame(animate);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"]');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <div
      ref={cursorRef}
      className={cn(
        'fixed top-0 left-0 w-5 h-5 border-2 border-electric rounded-full pointer-events-none z-[9999] mix-blend-difference transition-[width,height,border-color] duration-200',
        isHovering && 'w-12 h-12 border-white'
      )}
      style={{ willChange: 'transform' }}
    />
  );
}

// Main App Component
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  // Scroll to section handler
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  }, []);

  // Intersection Observer for active section
  useEffect(() => {
    const sections = ['hero', 'work', 'creative', 'playground', 'contact'];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.2, rootMargin: '-10% 0px -10% 0px' }
    );

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [isLoading]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const sections = ['hero', 'work', 'creative', 'playground', 'contact'];
      const currentIndex = sections.indexOf(activeSection);

      if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
        scrollToSection(sections[currentIndex + 1]);
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        scrollToSection(sections[currentIndex - 1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, scrollToSection]);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <>
          {/* Custom Cursor */}
          <CustomCursor />

          {/* Particle Background */}
          <ParticleBackground />

          {/* Navigation */}
          <Navigation activeSection={activeSection} onNavigate={scrollToSection} />

          {/* AI Chat Button */}
          <AIChatButton onClick={() => setIsAIChatOpen(true)} />

          {/* AI Chat Modal */}
          <AIChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />

          {/* Main Content */}
          <main ref={mainRef} className="relative z-10">
            <HeroSection 
              onNavigate={scrollToSection} 
              onOpenAIChat={() => setIsAIChatOpen(true)} 
            />
            <WorkSection />
            <CreativeGallerySection />
            <PlaygroundSection />
            <ContactSection />
          </main>

          {/* Scroll Progress Indicator */}
          <ScrollProgress />
        </>
      )}
    </>
  );
}

// Scroll Progress Component
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-2">
      <div className="w-1 h-24 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="w-full bg-electric rounded-full"
          style={{ height: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </div>
  );
}

export default App;
