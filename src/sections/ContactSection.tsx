import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Send, Sparkles, CheckCircle, ArrowUpRight, MapPin, Briefcase, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIChat } from '@/components/AIChat';
import { YouTubePopup } from '@/components/YouTubePopup';

const socialLinks = [
  { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/azimul-haque-b30397212', color: 'hover:text-blue-400' },
  { name: 'Dribbble', icon: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.245.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"/></svg>, url: 'https://dribbble.com/oceanazim', color: 'hover:text-pink-400' },
];

const skills = [
  'UI/UX Design',
  'Motion Graphics',
  'Video Editing',
  'Photo Manipulation',
  'Brand Design',
  'Figma',
  'Adobe Creative Suite',
  'HTML/CSS',
];

export function ContactSection() {
  const [showAIChat, setShowAIChat] = useState(false);
  const [showYouTubePopup, setShowYouTubePopup] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Using FormSubmit.co service to send email directly
      const formData = new FormData();
      formData.append('name', formState.name);
      formData.append('email', formState.email);
      formData.append('message', formState.message);
      formData.append('_subject', `New message from ${formState.name} - Portfolio Contact`);
      formData.append('_template', 'table');
      formData.append('_captcha', 'false');

      const response = await fetch('https://formsubmit.co/ajax/oceanazim@gmail.com', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormState({ name: '', email: '', message: '' });
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setSubmitError('Failed to send message. Please try again or email directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative min-h-screen py-20 md:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electric/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-electric text-sm font-medium uppercase tracking-widest mb-4 block">
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Let's build the <span className="text-gradient">future</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Whether you're a recruiter with an opportunity, a founder with a vision, 
            or just want to say hello — I'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - Info & AI */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Profile Card */}
            <div className="glass rounded-3xl p-6 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-electric/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-electric">AH</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Azimul Haque</h3>
                  <p className="text-white/60 text-sm">UI/UX Designer & Visual Media Specialist</p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-white/60">
                  <MapPin className="w-4 h-4 text-electric" />
                  <span>Bangladesh (Remote Friendly)</span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <Briefcase className="w-4 h-4 text-electric" />
                  <span>4+ Years Experience</span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <Sparkles className="w-4 h-4 text-electric" />
                  <span>Available for Remote & Contract Work</span>
                </div>
              </div>
            </div>

            {/* AI Assistant Card */}
            <div className="mb-8">
              <div className="glass rounded-3xl p-6 mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-electric/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-electric" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Recruiter Assistant</h3>
                    <p className="text-sm text-white/50">Get instant answers about my experience</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm mb-4">
                  Describe your project or role requirements, and I'll help you understand 
                  how my skills align with your needs.
                </p>
                <button
                  onClick={() => setShowAIChat(!showAIChat)}
                  className="w-full py-3 bg-electric/20 hover:bg-electric/30 text-electric rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {showAIChat ? 'Close Assistant' : 'Chat with AI'}
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* AI Chat Interface */}
              {showAIChat && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="glass rounded-3xl overflow-hidden"
                >
                  <div className="h-[400px]">
                    <AIChat isOpen={true} onClose={() => setShowAIChat(false)} variant="embedded" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Skills */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
                Core Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-white/5 rounded-full text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
                Connect
              </h3>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center transition-all hover:bg-white/10',
                        social.color
                      )}
                      title={social.name}
                    >
                      <Icon />
                    </a>
                  );
                })}
                {/* YouTube Button */}
                <button
                  onClick={() => setShowYouTubePopup(true)}
                  className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center transition-all hover:bg-white/10 hover:text-red-500"
                  title="YouTube"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="glass rounded-3xl p-8">
              <h3 className="text-xl font-semibold mb-6">Send a message</h3>
              
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-[400px] flex flex-col items-center justify-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Message sent!</h4>
                  <p className="text-white/60">I'll get back to you soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-electric/50 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-electric/50 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-electric/50 transition-colors resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </div>

                  {submitError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                      {submitError}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-electric rounded-xl font-medium text-white hover:bg-electric/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Direct Email */}
            <div className="mt-6 text-center">
              <p className="text-white/40 text-sm mb-2">Or reach out directly</p>
              <a
                href="mailto:oceanazim@gmail.com"
                className="inline-flex items-center gap-2 text-electric hover:underline"
              >
                <Mail className="w-4 h-4" />
                oceanazim@gmail.com
              </a>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-32 pt-8 border-t border-white/10 text-center"
        >
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Azimul Haque. Crafted with code and passion.
          </p>
        </motion.div>
      </div>

      {/* YouTube Popup */}
      <YouTubePopup 
        isOpen={showYouTubePopup} 
        onClose={() => setShowYouTubePopup(false)} 
      />
    </section>
  );
}
