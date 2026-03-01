import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Palette, ChevronLeft, ChevronRight, X, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ProjectImage {
  src: string;
  caption: string;
  tags: string[];
}

interface Project {
  id: string;
  title: string;
  category: 'design' | 'development' | 'both';
  description: string;
  longDescription: string;
  heroImage: string;
  images: ProjectImage[];
  technologies: string[];
  platforms: string[];
  link?: string;
}

// Edooket Project Images
const edooketImages: ProjectImage[] = [
  { src: '/images/projects/edooket/mobile/Edooket\'Mobile-First Screen.png', caption: 'Onboarding screen with engaging illustration and clear value proposition for the smart school solution.', tags: ['UI Design', 'Onboarding', 'Mobile'] },
  { src: '/images/projects/edooket/mobile/Edooket\'Mobile-Homepage.png', caption: 'Main homepage featuring social feed, course navigation, and quick access to key features.', tags: ['UX Design', 'Navigation', 'Mobile'] },
  { src: '/images/projects/edooket/mobile/Edooket\'Mobile-Create New Assignment.png', caption: 'Assignment creation interface with intuitive form design and clear action buttons.', tags: ['Form Design', 'Education', 'Mobile'] },
  { src: '/images/projects/edooket/mobile/Edooket\'Mobile-Ettendance entry by name.png', caption: 'Attendance tracking system with search functionality and student list management.', tags: ['Data Entry', 'Management', 'Mobile'] },
  { src: '/images/projects/edooket/mobile/Edooket\'Mobile-Event details.jpg', caption: 'Event details page showing comprehensive information with visual hierarchy.', tags: ['Information Architecture', 'Events', 'Mobile'] },
  { src: '/images/projects/edooket/mobile/Edooket\'Mobile-previous assingmnet list.jpg', caption: 'Assignment history view with status indicators and filtering options.', tags: ['List Design', 'History', 'Mobile'] },
  { src: '/images/projects/edooket/mobile/Edooket\'Mobile-Select days & time.jpg', caption: 'Date and time picker interface for scheduling assignments and events.', tags: ['Picker Design', 'Scheduling', 'Mobile'] },
  { src: '/images/projects/edooket/webapp/Edooket\'WebApp-Login Screen.png', caption: 'Web login screen with clean form layout and intuitive authentication flow.', tags: ['Auth Design', 'Web', 'Forms'] },
  { src: '/images/projects/edooket/webapp/Edooket\'WebApp-Homepage (1).png', caption: 'Web dashboard with social feed, sidebar navigation, and activity widgets.', tags: ['Dashboard', 'Web', 'Social'] },
  { src: '/images/projects/edooket/webapp/Edooket\'WebApp-Assignment homepage.png', caption: 'Assignment management dashboard with course organization and quick actions.', tags: ['Dashboard', 'Assignments', 'Web'] },
  { src: '/images/projects/edooket/webapp/Edooket\'WebApp-Attendance stat(If has data).png', caption: 'Attendance analytics with data visualization and statistics overview.', tags: ['Analytics', 'Data Viz', 'Web'] },
  { src: '/images/projects/edooket/webapp/Edooket\'WebApp-Evalutation Home page.png', caption: 'Evaluation center for grading and assessment management.', tags: ['Evaluation', 'Grading', 'Web'] },
  { src: '/images/projects/edooket/webapp/Edooket\'WebApp-Student view of submitted assignments (With search).png', caption: 'Student assignment viewer with search and filter capabilities.', tags: ['Search', 'Student View', 'Web'] },
  { src: '/images/projects/edooket/wordpress/Edooket\'Wordpress\'web-Landign Page.png', caption: 'Marketing landing page showcasing the Edooket platform features and benefits.', tags: ['Landing Page', 'Marketing', 'WordPress'] },
  { src: '/images/projects/edooket/wordpress/Edooket\'Wordpress\'Mobile-Landing page MV.png', caption: 'Mobile-responsive landing page design for the Edooket website.', tags: ['Responsive', 'Landing Page', 'WordPress'] },
];

// Iungo Project Images
const iungoImages: ProjectImage[] = [
  { src: '/images/projects/iungo/mobile/Iungu\'MobileApp-Login onborarding.png', caption: 'Onboarding flow introducing users to the sports platform features.', tags: ['Onboarding', 'Sports', 'Mobile'] },
  { src: '/images/projects/iungo/mobile/Iungu\'MobileApp-Login page.png', caption: 'Login screen with social authentication options and clean form design.', tags: ['Auth', 'Mobile', 'Forms'] },
  { src: '/images/projects/iungo/mobile/Iungu\'MobileApp-Homepage  with Live score opened.png', caption: 'Homepage with live sports scores panel showing real-time match updates.', tags: ['Live Data', 'Sports', 'Mobile'] },
  { src: '/images/projects/iungo/mobile/Iungu\'MobileApp-Live Matches Pages.png', caption: 'Live matches view with detailed match information and statistics.', tags: ['Live Matches', 'Sports', 'Mobile'] },
  { src: '/images/projects/iungo/mobile/Iungu\'MobileApp-Search- Trending.png', caption: 'Search interface with trending topics and federations discovery.', tags: ['Search', 'Discovery', 'Mobile'] },
  { src: '/images/projects/iungo/webapp/Iungu\'WebApp-Homepage.png', caption: 'Web homepage with posts feed, live events, and navigation tabs.', tags: ['Social Feed', 'Web', 'Sports'] },
  { src: '/images/projects/iungo/webapp/Iungu\'WebApp-Live Matches.png', caption: 'Live matches dashboard with multiple sports and real-time updates.', tags: ['Live Dashboard', 'Web', 'Sports'] },
  { src: '/images/projects/iungo/webapp/Iungu\'WebApp-Message Landing.png', caption: 'Messaging interface for user communication and community building.', tags: ['Messaging', 'Community', 'Web'] },
  { src: '/images/projects/iungo/webapp/Iungu\'WebApp-My Profile.png', caption: 'User profile page with activity history and personal information.', tags: ['Profile', 'User', 'Web'] },
];

// Blift Project Images
const bliftImages: ProjectImage[] = [
  { src: '/images/projects/blift/Blift-Login Screen.png', caption: 'Clean login screen for IRCC services with form validation and social auth.', tags: ['Auth', 'Government', 'Web'] },
  { src: '/images/projects/blift/Blift-My Profile Screen.png', caption: 'User profile dashboard with personal information and case overview.', tags: ['Profile', 'Dashboard', 'Web'] },
  { src: '/images/projects/blift/Blift-Wallet Screen.png', caption: 'Wallet interface for managing payments and transactions.', tags: ['Wallet', 'Payments', 'Web'] },
  { src: '/images/projects/blift/Blift-Case Detail Screen.png', caption: 'Case detail view showing immigration application status and timeline.', tags: ['Case Management', 'Government', 'Web'] },
];

const projects: Project[] = [
  {
    id: 'edooket',
    title: 'Edooket',
    category: 'both',
    description: 'Smart School Solution - Complete educational platform with social features, assignments, and attendance tracking.',
    longDescription: 'Edooket is a comprehensive smart school solution designed to automate educational institutions. The platform includes a mobile app for students and teachers, a web dashboard for administrators, and a WordPress landing page for marketing. Key features include social feed, assignment management, attendance tracking, event scheduling, and evaluation systems.',
    heroImage: '/images/projects/edooket/mobile/Edooket\'Mobile-First Screen.png',
    images: edooketImages,
    technologies: ['Figma', 'React', 'HTML/CSS', 'WordPress', 'Design System'],
    platforms: ['Mobile App', 'Web App', 'WordPress'],
    link: '#',
  },
  {
    id: 'iungo',
    title: 'Iungo',
    category: 'design',
    description: 'Sports Social Platform - Live scores, federations, and community features for sports enthusiasts.',
    longDescription: 'Iungo is a sports-focused social platform that connects federations, athletes, and fans. The platform features live match scores, federation profiles, event discovery, and community messaging. Designed for both mobile and web with a focus on real-time data visualization and engaging social interactions.',
    heroImage: '/images/projects/iungo/mobile/Iungu\'MobileApp-Homepage  with Live score opened.png',
    images: iungoImages,
    technologies: ['Figma', 'UI/UX', 'Motion Design', 'Prototyping'],
    platforms: ['Mobile App', 'Web App'],
    link: '#',
  },
  {
    id: 'blift',
    title: 'Blift',
    category: 'both',
    description: 'IRCC Services Portal - Immigration, Refugees and Citizenship Canada services platform.',
    longDescription: 'Blift is a secure portal for Immigration, Refugees and Citizenship Canada (IRCC) services. The platform provides users with case tracking, document management, payment processing, and profile management. Designed with a focus on accessibility, security, and ease of use for diverse user groups.',
    heroImage: '/images/projects/blift/Blift-Login Screen.png',
    images: bliftImages,
    technologies: ['Figma', 'HTML/CSS', 'Accessibility', 'Form Design'],
    platforms: ['Web App'],
    link: '#',
  },
  {
    id: 'ibuildoff',
    title: 'iBuildOff',
    category: 'design',
    description: 'Construction Platform - UI/UX design for building and construction management.',
    longDescription: 'iBuildOff is a construction management platform designed to streamline project workflows, contractor coordination, and building processes. The UI/UX design focuses on clarity for field workers while providing comprehensive tools for project managers.',
    heroImage: '/images/projects/edooket/webapp/Edooket\'WebApp-Homepage (1).png',
    images: [],
    technologies: ['Figma', 'UI/UX', 'Design System', 'Prototyping'],
    platforms: ['Mobile App', 'Web App'],
    link: '#',
  },
  {
    id: 'prospotters',
    title: 'Prospotters',
    category: 'development',
    description: 'WordPress Website - Professional services website development and maintenance.',
    longDescription: 'Prospotters is a professional services website built on WordPress. The project involved custom theme development, plugin integration, performance optimization, and ongoing maintenance to ensure a smooth user experience.',
    heroImage: '/images/projects/edooket/wordpress/Edooket\'Wordpress\'web-Landign Page.png',
    images: [],
    technologies: ['WordPress', 'PHP', 'CSS', 'SEO'],
    platforms: ['Website'],
    link: '#',
  },
];

// Image Gallery Dialog Component
function ImageGalleryDialog({
  isOpen,
  onClose,
  images,
  projectTitle,
  initialIndex = 0
}: {
  isOpen: boolean;
  onClose: () => void;
  images: ProjectImage[];
  projectTitle: string;
  initialIndex?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!images.length) return null;

  const currentImage = images[currentIndex];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[96vw] w-[96vw] h-[96vh] bg-surface/95 backdrop-blur-2xl border-white/10 p-0 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
            <div>
              <h3 className="font-semibold text-lg">{projectTitle}</h3>
              <p className="text-sm text-white/50">{currentIndex + 1} of {images.length}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors !outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image Viewer */}
          <div className="flex-1 flex items-center justify-center relative p-6 overflow-auto">
            {/* Navigation Buttons */}
            {
              images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )
            }

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, { offset, velocity }) => {
                  const swipe = offset.x;
                  if (swipe < -50 || velocity.x < -500) {
                    nextImage();
                  } else if (swipe > 50 || velocity.x > 500) {
                    prevImage();
                  }
                }}
                className="flex items-center justify-center w-full h-full cursor-grab active:cursor-grabbing"
              >
                <img
                  src={currentImage.src}
                  alt={currentImage.caption}
                  className="max-w-[90vw] max-h-[80vh] w-auto h-auto object-contain rounded-lg shadow-2xl transition-transform duration-300 hover:scale-[1.15]"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Caption & Tags */}
          <div className="p-6 border-t border-white/10 bg-black/20">
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/80 mb-3"
            >
              {currentImage.caption}
            </motion.p>
            <div className="flex flex-wrap gap-2">
              {currentImage.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-electric/20 text-electric text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {
            images.length > 1 && (
              <div className="p-4 border-t border-white/10 bg-black/40">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
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
            )
          }
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function WorkSection() {
  const [activeTab, setActiveTab] = useState<'projects' | 'creative'>('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [galleryProject, setGalleryProject] = useState<{ project: Project; index: number } | null>(null);

  return (
    <section id="work" className="relative min-h-screen py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-electric text-sm font-medium uppercase tracking-widest mb-4 block">
            Selected Work
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Projects that <span className="text-gradient">define</span> me
          </h2>
          <p className="text-white/60 text-lg max-w-2xl">
            A curated collection of UI/UX designs, web applications, and creative work
            that showcase my range and expertise across different domains.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {[
            { id: 'projects', label: 'UI/UX Projects', icon: Layers },
            { id: 'creative', label: 'Creative Work', icon: Palette },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-electric text-white'
                    : 'glass text-white/60 hover:text-white hover:bg-white/10'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  {/* Card */}
                  <div className="glass rounded-3xl overflow-hidden hover:bg-white/5 transition-all duration-300">
                    {/* Hero Image */}
                    <div
                      className="relative aspect-[4/3] overflow-hidden"
                      onClick={() => project.images.length > 0 && setGalleryProject({ project, index: 0 })}
                    >
                      <img
                        src={project.heroImage}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Platform Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        {project.platforms.map((platform) => (
                          <span key={platform} className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs">
                            {platform}
                          </span>
                        ))}
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={cn(
                          'px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1',
                          project.category === 'design'
                            ? 'bg-purple-500/80 text-white'
                            : project.category === 'development'
                              ? 'bg-blue-500/80 text-white'
                              : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                        )}>
                          {project.category === 'design' && <Palette className="w-3 h-3" />}
                          {project.category === 'development' && <Code className="w-3 h-3" />}
                          {project.category === 'both' && <Layers className="w-3 h-3" />}
                          {project.category === 'design' ? 'Design' : project.category === 'development' ? 'Development' : 'Design + Dev'}
                        </span>
                      </div>

                      {/* Image Count */}
                      {project.images.length > 0 && (
                        <div className="absolute bottom-4 right-4 px-3 py-1 bg-electric/80 rounded-full text-xs font-medium">
                          {project.images.length} images
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-electric transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-white/60 text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span key={tech} className="px-2 py-1 bg-white/5 rounded text-xs text-white/60">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-1 bg-white/5 rounded text-xs text-white/60">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {project.images.length > 0 && (
                          <button
                            onClick={() => setGalleryProject({ project, index: 0 })}
                            className="flex-1 py-2 bg-electric/20 hover:bg-electric/30 text-electric rounded-lg text-sm font-medium transition-colors"
                          >
                            View Gallery
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="px-4 py-2 glass hover:bg-white/10 rounded-lg text-sm transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'creative' && (
            <motion.div
              key="creative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center py-20"
            >
              <p className="text-white/60 mb-4">Explore my creative work on the dedicated gallery page</p>
              <a
                href="#creative"
                className="inline-flex items-center gap-2 px-6 py-3 bg-electric rounded-full font-medium hover:bg-electric/90 transition-colors"
              >
                <Palette className="w-5 h-5" />
                View Four Marfelous Gallery
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Project Detail Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl bg-surface border-white/10 p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium',
                      selectedProject.category === 'design'
                        ? 'bg-purple-500/20 text-purple-400'
                        : selectedProject.category === 'development'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white'
                    )}>
                      {selectedProject.category === 'design' ? 'UI/UX Design' : selectedProject.category === 'development' ? 'Development' : 'Design + Development'}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold">{selectedProject.title}</h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-white/70 mb-6 leading-relaxed">
                {selectedProject.longDescription}
              </p>

              {/* Platforms */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">
                  Platforms
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.platforms.map((platform) => (
                    <span key={platform} className="px-3 py-1.5 bg-white/5 rounded-lg text-sm">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">
                  Technologies & Tools
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech) => (
                    <span key={tech} className="px-3 py-1.5 bg-electric/10 text-electric rounded-lg text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Image Gallery Preview */}
              {selectedProject.images.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">
                    Screenshots ({selectedProject.images.length})
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedProject.images.slice(0, 6).map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedProject(null);
                          setTimeout(() => setGalleryProject({ project: selectedProject, index: idx }), 100);
                        }}
                        className="aspect-square rounded-xl overflow-hidden hover:ring-2 hover:ring-electric transition-all"
                      >
                        <img src={img.src} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                    {selectedProject.images.length > 6 && (
                      <button
                        onClick={() => {
                          setSelectedProject(null);
                          setTimeout(() => setGalleryProject({ project: selectedProject, index: 6 }), 100);
                        }}
                        className="aspect-square rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <span className="text-2xl font-bold text-white/60">+{selectedProject.images.length - 6}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Gallery Dialog */}
      {galleryProject && (
        <ImageGalleryDialog
          isOpen={!!galleryProject}
          onClose={() => setGalleryProject(null)}
          images={galleryProject.project.images}
          projectTitle={galleryProject.project.title}
          initialIndex={galleryProject.index}
        />
      )}
    </section>
  );
}
