import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Palette, RefreshCw, MousePointerClick, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface Score {
  name: string;
  country: string;
  score: number;
}

import { getData } from 'country-list';

// Returns the emoji flag for a given ISO 3166-1 alpha-2 code
const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const COUNTRIES = getData().map(c => ({
  code: c.code,
  name: c.name,
  emoji: getFlagEmoji(c.code)
})).sort((a, b) => a.name.localeCompare(b.name));

const getTopScores = async (gameId: string): Promise<Score[]> => {
  try {
    const response = await fetch('/api/scores');
    if (!response.ok) throw new Error('Fetch failed');
    const data = await response.json();
    return data[gameId] || [];
  } catch (err) {
    console.error('Error fetching scores:', err);
    return [];
  }
};

const saveScore = async (gameId: string, score: Score, ascending: boolean = false) => {
  try {
    // 1. Get latest scores first
    const response = await fetch('/api/scores');
    const allScores = await response.json();
    const gameScores = allScores[gameId] || [];

    // 2. Add new score and sort
    gameScores.push(score);
    gameScores.sort((a: Score, b: Score) => ascending ? a.score - b.score : b.score - a.score);

    // 3. Keep top 5 and upload
    allScores[gameId] = gameScores.slice(0, 5);

    await fetch('/api/scores', {
      method: 'POST',
      body: JSON.stringify(allScores)
    });
  } catch (err) {
    console.error('Error saving score:', err);
  }
};

const checkIsTopScore = (existingScores: Score[], score: number, ascending: boolean = false): boolean => {
  if (existingScores.length < 5) return true;
  const worstScore = existingScores[existingScores.length - 1].score;
  return ascending ? score < worstScore : score > worstScore;
};

function Leaderboard({ gameId, ascending, refreshKey }: { gameId: string, ascending?: boolean, refreshKey?: number }) {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getTopScores(gameId).then(data => {
      if (mounted) {
        setScores(data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [gameId, refreshKey]);

  if (loading) return (
    <div className="mt-8 w-full max-w-sm mx-auto glass rounded-2xl p-8 border border-white/10 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-electric border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (scores.length === 0) return null;

  return (
    <div className="mt-8 w-full max-w-sm mx-auto glass rounded-2xl p-4 border border-white/10 relative z-10">
      <div className="flex items-center gap-2 mb-4 justify-center text-white">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h4 className="font-bold text-lg">Global Top 5</h4>
      </div>
      <div className="space-y-2">
        {scores.map((s, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-sm text-white">
            <div className="flex items-center gap-3">
              <span className="text-white/40 w-4 font-bold">{i + 1}.</span>
              <span className="text-xl">{COUNTRIES.find(c => c.code === s.country)?.emoji || '🏳️'}</span>
              <span className="font-medium truncate max-w-[120px]">{s.name}</span>
            </div>
            <span className="font-bold text-electric">
              {ascending ? `${s.score}ms` : s.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreEntryModal({ isOpen, onClose, onSubmit, score, unit }: { isOpen: boolean, onClose: () => void, onSubmit: (name: string, country: string) => void, score: number, unit: string }) {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('US');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md glass border-white/10 bg-black/80 text-white shadow-[0_0_40px_rgba(255,46,0,0.15)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="text-yellow-500" /> New High Score!
          </DialogTitle>
          <DialogDescription className="text-white/60">
            You achieved a top 5 score of  <strong className="text-white">{score}{unit}</strong>! Enter your name to join the leaderboard.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Your Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex h-10 w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-electric"
              placeholder="Enter your name"
              maxLength={15}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="flex h-10 w-full rounded-md border border-white/20 bg-black/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-electric [&>option]:bg-zinc-900 border-none appearance-none"
            >
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors">
            Cancel
          </button>
          <button
            disabled={!name.trim()}
            onClick={() => { onSubmit(name.trim(), country); onClose(); }}
            className="px-6 py-2 bg-electric text-white text-sm font-medium rounded-full hover:bg-electric/80 disabled:opacity-50 transition-colors"
          >
            Submit Score
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Experience 1: Click Speed Test
function ClickSpeedExperience() {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [leaderboardKey, setLeaderboardKey] = useState(0);

  const startGame = () => {
    setClicks(0);
    setTimeLeft(5);
    setIsPlaying(true);
    setIsFinished(false);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsPlaying(false);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (isFinished && clicks > 0) {
      getTopScores('clickspeed').then(scores => {
        if (checkIsTopScore(scores, clicks)) {
          const timer = setTimeout(() => setShowModal(true), 500);
          return () => clearTimeout(timer);
        }
      });
    }
  }, [isFinished, clicks]);

  const handleScoreSubmit = async (name: string, country: string) => {
    await saveScore('clickspeed', { name, country, score: clicks });
    setLeaderboardKey(prev => prev + 1);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center overflow-y-auto min-h-full py-12 pt-[10rem] pb-24 relative no-scrollbar">
      {!isPlaying && !isFinished && (
        <>
          <motion.button
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={startGame}
            className="w-32 h-32 rounded-full bg-electric flex items-center justify-center text-white font-bold text-lg hover:scale-105 transition-transform shrink-0"
          >
            START
          </motion.button>
          <Leaderboard refreshKey={leaderboardKey} gameId="clickspeed" />
        </>
      )}

      {isPlaying && (
        <div className="flex flex-col items-center shrink-0">
          <p className="text-xl font-bold text-white mb-6 bg-white/10 px-4 py-2 rounded-full">
            Time: {timeLeft}s
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setClicks(c => c + 1)}
            className="w-48 h-48 rounded-full bg-electric flex items-center justify-center text-white font-bold text-4xl shadow-[0_0_40px_rgba(255,46,0,0.4)] cursor-pointer select-none"
          >
            CLICK!
          </motion.button>
          <p className="text-2xl mt-6 font-medium">Score: {clicks}</p>
        </div>
      )}

      {isFinished && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex flex-col items-center w-full"
        >
          <p className="text-5xl font-bold mb-2">{(clicks / 5).toFixed(1)} <span className="text-2xl text-white/50">CPS</span></p>
          <p className="text-white/50 mb-8">Total Clicks: {clicks}</p>
          <button
            onClick={startGame}
            className="px-8 py-3 bg-white/10 rounded-full text-sm font-medium hover:bg-white/20 transition-colors mb-4 shrink-0"
          >
            Try Again
          </button>
          <Leaderboard refreshKey={leaderboardKey} gameId="clickspeed" />
        </motion.div>
      )}

      {(!isPlaying || isFinished) && (
        <ScoreEntryModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleScoreSubmit}
          score={clicks}
          unit=" clicks"
        />
      )}
    </div>
  );
}

// Experience 2: Color Harmony Generator
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
  const [showModal, setShowModal] = useState(false);
  const [leaderboardKey, setLeaderboardKey] = useState(0);

  const startGame = () => {
    setState('waiting');
    const delay = Math.random() * 2000 + 1500;
    timeoutRef.current = setTimeout(() => {
      setState('ready');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = async () => {
    if (state === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState('idle');
      alert('Too early! Wait for green.');
    } else if (state === 'ready') {
      const time = Date.now() - startTime;
      setReactionTime(time);
      if (!bestTime || time < bestTime) setBestTime(time);
      setState('result');

      const scores = await getTopScores('reaction');
      if (checkIsTopScore(scores, time, true)) {
        setShowModal(true);
      }
    }
  };

  const reset = () => {
    setState('idle');
    setReactionTime(0);
  };

  const handleScoreSubmit = async (name: string, country: string) => {
    await saveScore('reaction', { name, country, score: reactionTime }, true);
    setLeaderboardKey(prev => prev + 1);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center overflow-y-auto min-h-full py-12 pt-[10rem] pb-24 relative no-scrollbar">
      {state === 'idle' && (
        <>
          <motion.button
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={startGame}
            className="w-32 h-32 rounded-full bg-electric flex items-center justify-center text-white font-bold text-lg hover:scale-105 transition-transform shrink-0"
          >
            START
          </motion.button>
          <Leaderboard refreshKey={leaderboardKey} gameId="reaction" ascending />
        </>
      )}

      {(state === 'waiting' || state === 'ready') && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={handleClick}
          className={cn(
            'w-40 h-40 rounded-full flex items-center justify-center text-white font-bold text-xl transition-colors shrink-0',
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
          className="text-center flex flex-col items-center w-full"
        >
          <p className="text-4xl font-bold mb-2">{reactionTime}ms</p>
          {bestTime && (
            <p className="text-white/50 text-sm mb-4">Best: {bestTime}ms</p>
          )}
          <button
            onClick={reset}
            className="px-6 py-2 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors mb-4 shrink-0"
          >
            Try Again
          </button>
          <Leaderboard refreshKey={leaderboardKey} gameId="reaction" ascending />
        </motion.div>
      )}

      <ScoreEntryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleScoreSubmit}
        score={reactionTime}
        unit="ms"
      />
    </div>
  );
}

const experiences = [
  {
    id: 'clickspeed',
    title: 'Click Speed Test',
    description: 'How many clicks per second?',
    icon: MousePointerClick,
    component: ClickSpeedExperience,
    color: 'from-purple-500/20 to-pink-500/20',
  },
  {
    id: 'reaction',
    title: 'Reaction Test',
    description: 'How fast are your reflexes?',
    icon: Target,
    component: ReactionTimeExperience,
    color: 'from-electric/20 to-orange-500/20',
  },
  {
    id: 'color',
    title: 'Color Harmony',
    description: 'Generate beautiful color palettes',
    icon: Palette,
    component: ColorHarmonyExperience,
    color: 'from-blue-500/20 to-cyan-500/20',
  }
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
            Three interactive experiences that showcase the playful side of creative technology.
            Click any card to dive in.
          </p>
        </motion.div>

        {/* Experience Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-3 glass rounded-full text-sm font-medium hover:bg-white/10 transition-colors inline-block"
          >
            Let's collaborate
          </button>
        </motion.div>
      </div>
    </section>
  );
}
