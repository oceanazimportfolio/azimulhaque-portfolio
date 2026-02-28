import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
  onOpenAIChat: () => void;
}

export function HeroSection({ onNavigate, onOpenAIChat }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const titleWords = ['AZIMUL', 'HAQUE'];

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-electric/5 via-transparent to-transparent opacity-50" />
      
      {/* Animated content */}
      <motion.div 
        style={{ opacity, scale, y }}
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-white/70">
            <Sparkles className="w-4 h-4 text-electric" />
            Available for Remote & Contract Work
          </span>
        </motion.div>

        {/* Main Title */}
        <div className="overflow-hidden mb-6">
          {titleWords.map((word, wordIndex) => (
            <div key={word} className="overflow-hidden">
              <motion.h1
                initial={{ y: '100%' }}
                animate={isLoaded ? { y: 0 } : {}}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.3 + wordIndex * 0.15,
                  ease: [0.23, 1, 0.32, 1]
                }}
                className={cn(
                  'text-[14vw] md:text-[12vw] lg:text-[10vw] font-bold leading-[0.9] tracking-[-0.04em]',
                  wordIndex === 1 && 'text-gradient'
                )}
              >
                {word}
              </motion.h1>
            </div>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto mb-4 leading-relaxed"
        >
          UI/UX Designer & Visual Media Specialist
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-sm md:text-base text-white/40 max-w-2xl mx-auto mb-10"
        >
          Motion Graphics • Video Editing • Digital Design • Creative Direction
        </motion.p>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-white/50 text-base max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          I'm a multidisciplinary designer who combines UI/UX expertise with strong visual storytelling, 
          motion design, and video editing. I think in systems, understand business needs, and design with purpose.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => onNavigate('work')}
            className="group relative px-8 py-4 bg-white text-black rounded-full font-medium flex items-center gap-2 overflow-hidden btn-shine"
          >
            <span className="relative z-10">View My Work</span>
            <ArrowDown className="w-4 h-4 relative z-10 group-hover:translate-y-1 transition-transform" />
          </button>
          
          <button
            onClick={onOpenAIChat}
            className="group px-8 py-4 glass rounded-full font-medium flex items-center gap-2 hover:bg-white/10 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-electric" />
            <span>Talk to AI Assistant</span>
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: '4+', label: 'Years Experience' },
            { value: '6+', label: 'Projects Delivered' },
            { value: '25+', label: 'Happy Clients' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-white/50 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/40 uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-white/40 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-electric/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-electric/5 rounded-full blur-3xl" />
    </section>
  );
}
