import { useState, useCallback } from 'react';
import type { ChatMessage } from '@/types';

// Load API key from environment, fallback to the provided key
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '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';

const SYSTEM_PROMPT = `You are an AI recruiter assistant for Azimul Haque's portfolio. Your role is to:

1. Be professional, clear, persuasive, and trust-building
2. Help visitors find what they're looking for quickly
3. Guide recruiters to relevant skills and projects
4. Answer questions about Azimul's expertise

About Azimul Haque:
- UI/UX Designer & Visual Media Specialist based in Bangladesh
- 4+ years of experience (since 2021)
- Available for remote and contract work

Core Skills:
- UI/UX Design (Web & Mobile)
- Graphic Design & Branding
- Motion Graphics
- Video Editing
- Poster & Marketing Design
- Visual Storytelling
- Design Systems
- Creative Direction

Tools:
- Figma, Adobe Photoshop, Adobe Illustrator
- Adobe After Effects, Adobe Premiere Pro
- HTML & CSS (for design-to-dev handoff)

Key Projects:
1. Edooket - Smart School Solution (Mobile app, WebApp & WordPress) - Complete educational platform with social feed, assignments, attendance tracking
2. Iungo - Sports/Social platform with live scores (Mobile & WebApp)
3. Blift - IRCC (Immigration) services portal with clean authentication flows
4. iBuildOff - Construction/Building platform UI/UX
5. Prospotters - WordPress website development

Creative Work:
- Four Marfelous YouTube channel - Motion graphics, photo manipulation tutorials, short-form social media videos
- Photo manipulation and digital art

Specializations:
- Motion Design
- Social Media Visuals
- Marketing Creatives
- AI-assisted Creative Workflows
- UI/UX for SaaS & Web Apps

Azimul's approach:
- Thinks in systems, not just pixels
- Understands business needs
- Designs with purpose, not just aesthetics
- Values consistency over trends
- Results over decoration

Respond concisely (2-3 sentences max) and guide users toward relevant sections.
If someone describes a job or project, analyze requirements and suggest relevant skills.
Always maintain a helpful, professional tone.`;

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm Azimul's AI assistant. What brings you here today? Looking for a UI/UX designer, exploring projects, or have a specific role in mind? I'm here to help!",
  timestamp: new Date(),
};

export function useGroqAI() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      console.log("Attempting Groq API Request...");

      // Use Vite proxy in development to avoid CORS issues, otherwise use direct URL
      const targetUrl = import.meta.env.DEV
        ? '/api/groq/openai/v1/chat/completions'
        : 'https://api.groq.com/openai/v1/chat/completions';

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content },
          ],
          temperature: 0.7,
          max_tokens: 200,
        }),
      });

      console.log("Groq API Response Status:", response.status, response.ok);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Error body:", errorBody);
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const aiContent = data.choices?.[0]?.message?.content || 'I apologize, but I could not process your request.';

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

    } catch (err) {
      console.error("API Error on this key:", err);
      setError(err instanceof Error ? err.message : 'An error occurred');

      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having a little trouble connecting right now, but I'm here to help! You can explore the Work section for projects or the Creative Gallery for visual work.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
