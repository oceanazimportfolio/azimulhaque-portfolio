export interface Project {
  id: string;
  title: string;
  category: 'design' | 'development';
  description: string;
  image: string;
  technologies: string[];
  link?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  title: string;
  category: string;
}

export interface RecruiterInfo {
  company: string;
  role: string;
  skills: string[];
  experience: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
}
