/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import EmotePanel from './components/EmotePanel';
import { Emote } from './data/emotes';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [notification, setNotification] = useState<{ text: string; type: 'info' | 'success' } | null>(null);

  // Toggle menu with F3 key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F3') {
        e.preventDefault(); // Prevent browser search
        setIsMenuOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const handleEmoteSelect = (emote: Emote) => {
    setNotification({ text: `Playing emote: ${emote.label}`, type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background - Simulating GTA V Game View */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-500"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1605218427306-022ba8c696b9?q=80&w=2832&auto=format&fit=crop")',
          filter: isMenuOpen ? 'blur(4px) brightness(0.7)' : 'none',
          transform: isMenuOpen ? 'scale(1.02)' : 'scale(1)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="absolute top-20 left-1/2 z-50 bg-black/70 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-white font-medium shadow-xl pointer-events-none"
          >
            <span className="text-indigo-400 mr-2">ℹ</span> {notification.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Emote Panel */}
      <EmotePanel 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onEmoteSelect={handleEmoteSelect}
      />
      
      {/* Hint when closed */}
      {!isMenuOpen && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 bg-black/60 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 animate-pulse">
          Press <span className="font-bold text-indigo-400">F3</span> to open Emote Menu
        </div>
      )}
    </div>
  );
}
