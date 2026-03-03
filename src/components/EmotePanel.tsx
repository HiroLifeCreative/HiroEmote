import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Star, 
  X, 
  Music, 
  Box, 
  Footprints, 
  Smile, 
  Users, 
  Play,
  Heart,
  ChevronDown,
  ChevronRight,
  Settings,
  Menu,
  Repeat,
  Clock,
  Link,
  Send
} from 'lucide-react';
import { Emote, categories, initialEmotes, EmoteCategory } from '../data/emotes';

interface EmotePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onEmoteSelect: (emote: Emote) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Music,
  Box,
  Footprints,
  Smile,
  Users
};

export default function EmotePanel({ isOpen, onClose, onEmoteSelect }: EmotePanelProps) {
  // 'favorites' is now treated as a special expanded section or handled separately
  const [activeTab, setActiveTab] = useState<'emotes' | 'favorites' | 'settings' | 'shared' | 'recent'>('emotes');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['dance']);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [emotes, setEmotes] = useState<Emote[]>(initialEmotes);
  const [activeEmote, setActiveEmote] = useState<string | null>(null);
  const [loopedEmotes, setLoopedEmotes] = useState<string[]>([]);
  const [recentEmotes, setRecentEmotes] = useState<string[]>([]);

  // Load recent emotes from localStorage on mount
  useEffect(() => {
    const savedRecents = localStorage.getItem('recentEmotes');
    if (savedRecents) {
      try {
        setRecentEmotes(JSON.parse(savedRecents));
      } catch (e) {
        console.error('Failed to parse recent emotes', e);
      }
    }
  }, []);

  // Save recent emotes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('recentEmotes', JSON.stringify(recentEmotes));
  }, [recentEmotes]);

  // Shared Tab State
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [sharedDelay, setSharedDelay] = useState(0);
  const [isSharedLoop, setIsSharedLoop] = useState(false);
  const [isSharedSync, setIsSharedSync] = useState(true);

  // Mock Nearby Players
  const nearbyPlayers = [
    { id: 1, name: 'OfficerJenny', distance: '2m' },
    { id: 2, name: 'DrDisrespect', distance: '5m' },
    { id: 3, name: 'PlayerOne', distance: '12m' },
  ];

  // Settings state (mock)
  const [settings, setSettings] = useState({
    soundEffects: true,
    notifications: true,
    loopAnimations: true,
    allowMovement: false
  });

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(prev => prev.filter(fav => fav !== id));
    } else {
      setFavorites(prev => [...prev, id]);
    }
  };

  const toggleLoop = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (loopedEmotes.includes(id)) {
      setLoopedEmotes(prev => prev.filter(loop => loop !== id));
    } else {
      setLoopedEmotes(prev => [...prev, id]);
    }
  };

  const handlePlayEmote = (emote: Emote) => {
    setActiveEmote(emote.id);
    onEmoteSelect(emote);
    console.log(`Playing emote: ${emote.command}`);

    // Add to recent emotes
    setRecentEmotes(prev => {
      // Remove if exists, add to front, limit to 10
      const filtered = prev.filter(id => id !== emote.id);
      return [emote.id, ...filtered].slice(0, 10);
    });
  };

  const handleStopAnimation = () => {
    setActiveEmote(null);
    console.log('Stopping animation');
  };

  // Group emotes by category for the accordion
  const emotesByCategory = useMemo(() => {
    const grouped: Record<string, Emote[]> = {};
    
    // Initialize groups
    categories.forEach(cat => { grouped[cat.id] = []; });
    grouped['favorites'] = [];

    emotes.forEach(emote => {
      // Add to category
      if (grouped[emote.category]) {
        grouped[emote.category].push(emote);
      }
      // Add to favorites if applicable
      if (favorites.includes(emote.id)) {
        grouped['favorites'].push(emote);
      }
    });

    return grouped;
  }, [emotes, favorites]);

  // Get recent emote objects
  const recentEmoteObjects = useMemo(() => {
    return recentEmotes
      .map(id => emotes.find(e => e.id === id))
      .filter((e): e is Emote => e !== undefined);
  }, [recentEmotes, emotes]);

  // Search results flatten the list
  const searchResults = useMemo(() => {
    if (!searchQuery) return null;
    return emotes.filter(emote => 
      emote.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
      emote.command.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [emotes, searchQuery]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed right-0 top-0 h-full w-[380px] bg-black/80 backdrop-blur-md border-l border-blue-500/20 shadow-2xl z-50 flex font-sans text-white overflow-hidden"
        >
          {/* Vertical Navbar */}
          <div className="w-16 bg-zinc-900/60 border-r border-white/5 flex flex-col items-center py-4 gap-4">
            <div className="mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Smile size={20} className="text-white" />
              </div>
            </div>

            <NavButton 
              icon={Menu} 
              label="Menú" 
              isActive={activeTab === 'emotes'} 
              onClick={() => setActiveTab('emotes')} 
            />
            
            <NavButton 
              icon={Clock} 
              label="Recientes" 
              isActive={activeTab === 'recent'} 
              onClick={() => setActiveTab('recent')} 
            />

            <NavButton 
              icon={Heart} 
              label="Favoritos" 
              isActive={activeTab === 'favorites'} 
              onClick={() => setActiveTab('favorites')} 
            />

            <NavButton 
              icon={Users} 
              label="Compartir" 
              isActive={activeTab === 'shared'} 
              onClick={() => setActiveTab('shared')} 
            />
            
            <NavButton 
              icon={Settings} 
              label="Ajustes" 
              isActive={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')} 
            />

            <div className="mt-auto">
              <button 
                onClick={onClose}
                className="p-2 rounded-lg text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                title="Cerrar"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-5 pb-3 bg-zinc-900/30 border-b border-white/5">
              <h2 className="text-2xl font-bold tracking-tight text-white mb-0.5">
                {activeTab === 'emotes' && 'Emotes'}
                {activeTab === 'favorites' && 'Favoritos'}
                {activeTab === 'settings' && 'Configuración'}
                {activeTab === 'shared' && 'Compartir'}
                {activeTab === 'recent' && 'Recientes'}
              </h2>
              <p className="text-zinc-500 text-xs mb-3">
                {activeTab === 'emotes' && 'Explora todas las animaciones'}
                {activeTab === 'favorites' && 'Tus animaciones guardadas'}
                {activeTab === 'settings' && 'Personaliza tu experiencia'}
                {activeTab === 'shared' && 'Envía animaciones a otros jugadores'}
                {activeTab === 'recent' && 'Tus últimas 10 animaciones'}
              </p>

              {/* Search only visible in emotes/favorites/recent tabs */}
              {(activeTab === 'emotes' || activeTab === 'favorites' || activeTab === 'shared' || activeTab === 'recent') && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600"
                  />
                </div>
              )}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              
              {/* RECENT TAB */}
              {activeTab === 'recent' && (
                <div className="space-y-2">
                  {recentEmoteObjects.length > 0 ? (
                    recentEmoteObjects.map(emote => (
                      <EmoteCard 
                        key={`recent-${emote.id}`} 
                        emote={emote} 
                        isActive={activeEmote === emote.id}
                        isFavorite={favorites.includes(emote.id)}
                        isLooped={loopedEmotes.includes(emote.id)}
                        onPlay={() => handlePlayEmote(emote)}
                        onToggleFavorite={(e) => toggleFavorite(e, emote.id)}
                        onToggleLoop={(e) => toggleLoop(e, emote.id)}
                        draggable={true}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('emoteId', emote.id);
                          e.dataTransfer.setData('emoteLabel', emote.label);
                          e.dataTransfer.setData('emoteCommand', emote.command);
                        }}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                      <Clock size={48} className="mb-4 opacity-20" />
                      <p className="text-lg font-medium">Sin historial</p>
                      <p className="text-sm opacity-60">Tus últimas animaciones aparecerán aquí</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* SHARED TAB */}
              {activeTab === 'shared' && (
                <div className="space-y-4 p-1">
                  {/* Options */}
                  <div className="bg-zinc-900/40 rounded-2xl border border-white/5 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400">
                          <Clock size={18} />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm">Delay</h3>
                          <p className="text-xs text-zinc-500">{sharedDelay}s</p>
                        </div>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="10" 
                        step="1"
                        value={sharedDelay}
                        onChange={(e) => setSharedDelay(parseInt(e.target.value))}
                        className="w-20 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>

                    <div className="h-px bg-white/5" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400">
                          <Repeat size={18} />
                        </div>
                        <h3 className="font-bold text-sm">Bucle</h3>
                      </div>
                      <Switch checked={isSharedLoop} onChange={() => setIsSharedLoop(!isSharedLoop)} />
                    </div>

                    <div className="h-px bg-white/5" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400">
                          <Link size={18} />
                        </div>
                        <h3 className="font-bold text-sm">Sincronizar</h3>
                      </div>
                      <Switch checked={isSharedSync} onChange={() => setIsSharedSync(!isSharedSync)} />
                    </div>
                  </div>

                  <button 
                    disabled={!selectedPlayer || !activeEmote}
                    className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      !selectedPlayer || !activeEmote
                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                    }`}
                  >
                    <Send size={16} />
                    {activeEmote ? `Enviar ${emotes.find(e => e.id === activeEmote)?.label}` : 'Selecciona un Emote'}
                  </button>

                  {/* Draggable Emote List */}
                  <div className="space-y-2 pt-2">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider px-1">Emotes Disponibles</h3>
                    <div className="space-y-2">
                      {(searchResults || emotes).map(emote => (
                        <EmoteCard 
                          key={`shared-${emote.id}`} 
                          emote={emote} 
                          isActive={activeEmote === emote.id}
                          isFavorite={favorites.includes(emote.id)}
                          isLooped={loopedEmotes.includes(emote.id)}
                          onPlay={() => setActiveEmote(emote.id)}
                          onToggleFavorite={(e) => toggleFavorite(e, emote.id)}
                          onToggleLoop={(e) => toggleLoop(e, emote.id)}
                          draggable={true}
                          onDragStart={(e) => {
                            e.dataTransfer.setData('emoteId', emote.id);
                            // Set drag image or effect if needed
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <div className="space-y-3 p-1">
                  <div className="bg-zinc-900/40 rounded-2xl border border-white/5 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400">
                          <Music size={18} />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm">Efectos de Sonido</h3>
                          <p className="text-xs text-zinc-500">Sonidos al hacer click</p>
                        </div>
                      </div>
                      <Switch checked={settings.soundEffects} onChange={() => setSettings(s => ({...s, soundEffects: !s.soundEffects}))} />
                    </div>

                    <div className="h-px bg-white/5" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400">
                          <Star size={18} />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm">Notificaciones</h3>
                          <p className="text-xs text-zinc-500">Mostrar alertas en pantalla</p>
                        </div>
                      </div>
                      <Switch checked={settings.notifications} onChange={() => setSettings(s => ({...s, notifications: !s.notifications}))} />
                    </div>

                    <div className="h-px bg-white/5" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400">
                          <Repeat size={18} />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm">Animaciones en Bucle</h3>
                          <p className="text-xs text-zinc-500">Repetir animación automáticamente</p>
                        </div>
                      </div>
                      <Switch checked={settings.loopAnimations} onChange={() => setSettings(s => ({...s, loopAnimations: !s.loopAnimations}))} />
                    </div>

                    <div className="h-px bg-white/5" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400">
                          <Footprints size={18} />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm">Permitir Movimiento</h3>
                          <p className="text-xs text-zinc-500">Moverse durante la animación</p>
                        </div>
                      </div>
                      <Switch checked={settings.allowMovement} onChange={() => setSettings(s => ({...s, allowMovement: !s.allowMovement}))} />
                    </div>
                  </div>
                  
                  <div className="bg-blue-500/10 rounded-2xl border border-blue-500/20 p-4 text-center">
                    <p className="text-blue-300 text-xs font-medium">HiroEmote v2.0 Created Nelson Herrera</p>
                    <p className="text-blue-500/60 text-[10px] mt-0.5">Created with ❤️</p>
                  </div>
                </div>
              )}

              {/* FAVORITES TAB */}
              {activeTab === 'favorites' && (
                <div className="space-y-2">
                  {emotesByCategory['favorites'].length > 0 ? (
                    emotesByCategory['favorites'].map(emote => (
                      <EmoteCard 
                        key={`fav-tab-${emote.id}`} 
                        emote={emote} 
                        isActive={activeEmote === emote.id}
                        isFavorite={true}
                        isLooped={loopedEmotes.includes(emote.id)}
                        onPlay={() => handlePlayEmote(emote)}
                        onToggleFavorite={(e) => toggleFavorite(e, emote.id)}
                        onToggleLoop={(e) => toggleLoop(e, emote.id)}
                        draggable={true}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('emoteId', emote.id);
                          e.dataTransfer.setData('emoteLabel', emote.label);
                          e.dataTransfer.setData('emoteCommand', emote.command);
                        }}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                      <Heart size={48} className="mb-4 opacity-20" />
                      <p className="text-lg font-medium">No tienes favoritos</p>
                      <p className="text-sm opacity-60">Marca emotes con el corazón para verlos aquí</p>
                    </div>
                  )}
                </div>
              )}

              {/* EMOTES TAB (Main) */}
              {activeTab === 'emotes' && (
                <>
                  {searchQuery ? (
                    // Search Results
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-zinc-500 px-2 mb-2 uppercase tracking-wider">Resultados</h3>
                      {searchResults && searchResults.length > 0 ? (
                        searchResults.map(emote => (
                          <EmoteCard 
                            key={emote.id} 
                            emote={emote} 
                            isActive={activeEmote === emote.id}
                            isFavorite={favorites.includes(emote.id)}
                            isLooped={loopedEmotes.includes(emote.id)}
                            onPlay={() => handlePlayEmote(emote)}
                            onToggleFavorite={(e) => toggleFavorite(e, emote.id)}
                            onToggleLoop={(e) => toggleLoop(e, emote.id)}
                            draggable={true}
                            onDragStart={(e) => {
                              e.dataTransfer.setData('emoteId', emote.id);
                              e.dataTransfer.setData('emoteLabel', emote.label);
                              e.dataTransfer.setData('emoteCommand', emote.command);
                            }}
                          />
                        ))
                      ) : (
                        <div className="text-center py-10 text-zinc-500">
                          <p>No se encontraron resultados</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Categories Accordion
                    <div className="space-y-4">
                      {categories.map(cat => {
                        const Icon = iconMap[cat.icon];
                        const isExpanded = expandedCategories.includes(cat.id);
                        const count = emotesByCategory[cat.id]?.length || 0;

                        return (
                          <div key={cat.id} className={`overflow-hidden rounded-2xl border transition-all ${isExpanded ? 'border-white/10 bg-zinc-900/40' : 'border-transparent bg-zinc-900/20'}`}>
                            <button
                              onClick={() => toggleCategory(cat.id)}
                              className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-lg transition-colors ${isExpanded ? 'bg-zinc-800 text-white' : 'bg-zinc-800/50 text-zinc-500'}`}>
                                  <Icon size={18} />
                                </div>
                                <span className={`font-bold text-base ${isExpanded ? 'text-white' : 'text-zinc-400'}`}>{cat.label}</span>
                                <span className="bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded-md text-[10px] font-mono">
                                  {count}
                                </span>
                              </div>
                              {isExpanded ? <ChevronDown size={18} className="text-white" /> : <ChevronRight size={18} className="text-zinc-600" />}
                            </button>
                            
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-2 pt-0 space-y-2">
                                    {emotesByCategory[cat.id].map(emote => (
                                      <EmoteCard 
                                        key={emote.id} 
                                        emote={emote} 
                                        isActive={activeEmote === emote.id}
                                        isFavorite={favorites.includes(emote.id)}
                                        isLooped={loopedEmotes.includes(emote.id)}
                                        onPlay={() => handlePlayEmote(emote)}
                                        onToggleFavorite={(e) => toggleFavorite(e, emote.id)}
                                        onToggleLoop={(e) => toggleLoop(e, emote.id)}
                                        draggable={true}
                                        onDragStart={(e) => {
                                          e.dataTransfer.setData('emoteId', emote.id);
                                          e.dataTransfer.setData('emoteLabel', emote.label);
                                          e.dataTransfer.setData('emoteCommand', emote.command);
                                        }}
                                      />
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer Action */}
            <div className="p-4 bg-zinc-900/60 border-t border-white/5 backdrop-blur-lg">
              <button 
                onClick={handleStopAnimation}
                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-3 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 group"
              >
                <X size={18} className="group-hover:scale-110 transition-transform" />
                Cancelar Emote
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Nav Button Component
function NavButton({ icon: Icon, label, isActive, onClick }: { icon: React.ElementType, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 group w-full px-2 py-2 rounded-lg transition-all ${
        isActive ? 'bg-white/10 text-blue-400' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
      }`}
    >
      <Icon size={20} className={`transition-transform group-hover:scale-110 ${isActive ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

// Switch Component
function Switch({ checked, onChange }: { checked: boolean, onChange: () => void }) {
  return (
    <button 
      onClick={onChange}
      className={`w-12 h-7 rounded-full p-1 transition-colors ${checked ? 'bg-blue-600' : 'bg-zinc-700'}`}
    >
      <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

// Subcomponent for individual emote cards to keep main file clean
interface EmoteCardProps {
  emote: Emote;
  isActive: boolean;
  isFavorite: boolean;
  isLooped?: boolean;
  onPlay: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onToggleLoop?: (e: React.MouseEvent) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}

const EmoteCard: React.FC<EmoteCardProps> = ({ 
  emote, 
  isActive, 
  isFavorite, 
  isLooped,
  onPlay, 
  onToggleFavorite, 
  onToggleLoop,
  draggable, 
  onDragStart 
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      draggable={draggable}
      onDragStart={onDragStart}
      className={`group relative flex items-center justify-between p-2 pl-3 rounded-xl border transition-all cursor-pointer ${
        isActive
          ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-900/20'
          : 'bg-black/40 border-white/5 hover:bg-zinc-800 hover:border-white/10'
      } ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
      onClick={onPlay}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg transition-colors ${
          isActive ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-400 group-hover:text-white group-hover:bg-zinc-700'
        }`}>
          {isActive ? <Play size={16} fill="currentColor" /> : <Play size={16} />}
        </div>
        <div>
          <h3 className={`font-bold text-sm ${isActive ? 'text-white' : 'text-zinc-200'}`}>
            {emote.label}
          </h3>
          <p className={`text-[10px] font-mono ${isActive ? 'text-blue-200' : 'text-zinc-500'}`}>{emote.command}</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {onToggleLoop && (
          <button
            onClick={onToggleLoop}
            className={`p-2 rounded-lg transition-colors ${
              isLooped
                ? 'text-blue-400 bg-blue-500/10'
                : isActive 
                  ? 'text-blue-200 hover:bg-white/20 hover:text-white' 
                  : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/5'
            }`}
            title="Loop"
          >
            <Repeat size={16} />
          </button>
        )}

        <button
          onClick={onToggleFavorite}
          className={`p-2 rounded-lg transition-colors mr-1 ${
            isFavorite
              ? 'text-yellow-400 hover:bg-black/20'
              : isActive 
                ? 'text-blue-200 hover:bg-white/20 hover:text-white' 
                : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/5'
          }`}
        >
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
    </motion.div>
  );
};
