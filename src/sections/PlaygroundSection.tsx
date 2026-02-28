import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Target, Palette, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

// Experience 1: Kinetic Typography Playground
function KineticTypeExperience() {
  const [text, setText] = useState('TYPE HERE');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left - rect.width / 2) / 20,
      y: (e.clientY - rect.top - rect.height / 2) / 20,
    });
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
      className="h-full flex flex-col items-center justify-center p-6 cursor-crosshair"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value.toUpperCase())}
        className="absolute top-4 left-4 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-48 focus:outline-none focus:border-electric"
        placeholder="Type something..."
      />
      <div className="relative">
        {text.split('').map((char, i) => (
          <motion.span
            key={i}
            animate={{
              x: mousePos.x * (i % 2 === 0 ? 1 : -1) * (i + 1) * 0.5,
              y: mousePos.y * (i % 3 === 0 ? 1 : -1) * (i + 1) * 0.3,
              rotate: mousePos.x * (i % 2 === 0 ? 1 : -1) * 0.5,
            }}
            transition={{ type: 'spring', stiffness: 150, damping: 15 }}
            className="inline-block text-5xl md:text-7xl font-bold"
            style={{
              textShadow: `${mousePos.x * (i + 1) * 0.1}px ${mousePos.y * (i + 1) * 0.1}px 0 rgba(255, 46, 0, 0.5)`,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </div>
      <p className="absolute bottom-4 text-white/40 text-sm">Move your cursor</p>
    </div>
  );
}

// Experience 2: Magnetic Grid
function MagneticGridExperience() {
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const gridSize = 8;

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div 
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, i) => {
          const isHovered = hoveredCell === i;
          const distanceFromHover = hoveredCell !== null 
            ? Math.abs(Math.floor(i / gridSize) - Math.floor(hoveredCell / gridSize)) 
              + Math.abs((i % gridSize) - (hoveredCell % gridSize))
            : 10;
          
          return (
            <motion.div
              key={i}
              onMouseEnter={() => setHoveredCell(i)}
              onMouseLeave={() => setHoveredCell(null)}
              animate={{
                scale: isHovered ? 1.5 : Math.max(0.7, 1 - distanceFromHover * 0.1),
                backgroundColor: isHovered 
                  ? '#FF2E00' 
                  : distanceFromHover < 3 
                    ? `rgba(255, 46, 0, ${0.3 - distanceFromHover * 0.1})`
                    : 'rgba(255, 255, 255, 0.1)',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-8 h-8 md:w-10 md:h-10 rounded-lg cursor-pointer"
            />
          );
        })}
      </div>
    </div>
  );
}

// Experience 3: Color Harmony Generator
function ColorHarmonyExperience() {
  const [baseHue, setBaseHue] = useState(200);
  const [scheme, setScheme] = useState<'complementary' | 'triadic' | 'analogous'>('complementary');

  const generateColors = () => {
    switch (scheme) {
      case 'complementary':
        return [baseHue, (baseHue + 180) % 360];
      case 'triadic':
        return [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];
      case 'analogous':
        return [(baseHue - 30 + 360) % 360, baseHue, (baseHue + 30) % 360];
      default:
        return [baseHue];
    }
  };

  const colors = generateColors();

  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <div className="flex gap-2 mb-6">
        {(['complementary', 'triadic', 'analogous'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setScheme(s)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors',
              scheme === s ? 'bg-electric text-white' : 'bg-white/5 text-white/60'
            )}
          >
            {s}
          </button>
        ))}
      </div>
      
      <div className="flex gap-4 mb-6">
        {colors.map((hue, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-lg"
            style={{ backgroundColor: `hsl(${hue}, 70%, 50%)` }}
          />
        ))}
      </div>

      <input
        type="range"
        min="0"
        max="360"
        value={baseHue}
        onChange={(e) => setBaseHue(Number(e.target.value))}
        className="w-full max-w-xs"
      />
      <p className="text-white/40 text-sm mt-2">Drag to change hue</p>
    </div>
  );
}

// Experience 4: Reaction Time Challenge
function ReactionTimeExperience() {
  const [state, setState] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle');
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = () => {
    setState('waiting');
    const delay = Math.random() * 2000 + 1500;
    timeoutRef.current = setTimeout(() => {
      setState('ready');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (state === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState('idle');
      alert('Too early! Wait for green.');
    } else if (state === 'ready') {
      const time = Date.now() - startTime;
      setReactionTime(time);
      if (!bestTime || time < bestTime) setBestTime(time);
      setState('result');
    }
  };

  const reset = () => {
    setState('idle');
    setReactionTime(0);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      {state === 'idle' && (
        <motion.button
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          onClick={startGame}
          className="w-32 h-32 rounded-full bg-electric flex items-center justify-center text-white font-bold text-lg hover:scale-105 transition-transform"
        >
          START
        </motion.button>
      )}
      
      {(state === 'waiting' || state === 'ready') && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={handleClick}
          className={cn(
            'w-40 h-40 rounded-full flex items-center justify-center text-white font-bold text-xl transition-colors',
            state === 'waiting' ? 'bg-red-500' : 'bg-green-500'
          )}
        >
          {state === 'waiting' ? 'WAIT...' : 'CLICK!'}
        </motion.button>
      )}
      
      {state === 'result' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <p className="text-4xl font-bold mb-2">{reactionTime}ms</p>
          {bestTime && (
            <p className="text-white/50 text-sm mb-4">Best: {bestTime}ms</p>
          )}
          <button
            onClick={reset}
            className="px-6 py-2 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      )}
      
      <p className="absolute bottom-4 text-white/40 text-sm text-center">
        Test your reaction speed
      </p>
    </div>
  );
}

const experiences = [
  {
    id: 'kinetic',
    title: 'Kinetic Type',
    description: 'Interactive typography that responds to your cursor',
    icon: Sparkles,
    component: KineticTypeExperience,
    color: 'from-purple-500/20 to-pink-500/20',
  },
  {
    id: 'magnetic',
    title: 'Magnetic Grid',
    description: 'A grid of cells that attract and repel',
    icon: Zap,
    component: MagneticGridExperience,
    color: 'from-electric/20 to-orange-500/20',
  },
  {
    id: 'color',
    title: 'Color Harmony',
    description: 'Generate beautiful color palettes',
    icon: Palette,
    component: ColorHarmonyExperience,
    color: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    id: 'reaction',
    title: 'Reaction Test',
    description: 'How fast are your reflexes?',
    icon: Target,
    component: ReactionTimeExperience,
    color: 'from-green-500/20 to-emerald-500/20',
  },
];

export function PlaygroundSection() {
  const [activeExperience, setActiveExperience] = useState<string | null>(null);

  return (
    <section
      id="playground"
      className="relative min-h-screen py-20 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="text-electric text-sm font-medium uppercase tracking-widest mb-4 block">
            Interactive Playground
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Play with <span className="text-gradient">code</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Four interactive experiences that showcase the playful side of creative technology. 
            Click any card to dive in.
          </p>
        </motion.div>

        {/* Experience Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {experiences.map((exp, index) => {
            const Icon = exp.icon;
            const Component = exp.component;
            const isActive = activeExperience === exp.id;

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => !isActive && setActiveExperience(exp.id)}
                className={cn(
                  'relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500',
                  isActive ? 'md:col-span-2 h-[500px]' : 'h-[280px]'
                )}
              >
                {/* Background Gradient */}
                <div className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-50',
                  exp.color
                )} />
                
                {/* Glass Overlay */}
                <div className="absolute inset-0 glass" />

                {/* Content */}
                <div className="relative h-full">
                  {isActive ? (
                    <div className="h-full">
                      {/* Active Experience Header */}
                      <div className="flex items-center justify-between p-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-electric" />
                          <span className="font-semibold">{exp.title}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveExperience(null);
                          }}
                          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                      {/* Active Component */}
                      <Component />
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                        <Icon className="w-8 h-8 text-electric" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{exp.title}</h3>
                      <p className="text-white/50 text-sm">{exp.description}</p>
                      <div className="mt-4 text-electric text-sm font-medium">
                        Click to play →
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-white/40 mb-4">
            Want to see more interactive experiments?
          </p>
          <a
            href="#contact"
            className="px-6 py-3 glass rounded-full text-sm font-medium hover:bg-white/10 transition-colors inline-block"
          >
            Let's collaborate
          </a>
        </motion.div>
      </div>
    </section>
  );
}
