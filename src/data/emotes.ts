export type EmoteCategory = 'dance' | 'prop' | 'walk' | 'face' | 'shared';

export interface Emote {
  id: string;
  label: string;
  command: string;
  category: EmoteCategory;
  isFavorite?: boolean;
  icon?: string;
}

export const categories: { id: EmoteCategory; label: string; icon: string }[] = [
  { id: 'dance', label: 'Bailes', icon: 'Music' },
  { id: 'prop', label: 'Objetos', icon: 'Box' },
  { id: 'walk', label: 'Caminados', icon: 'Footprints' },
  { id: 'face', label: 'Expresiones', icon: 'Smile' },
  { id: 'shared', label: 'Compartidos', icon: 'Users' },
];

export const initialEmotes: Emote[] = [
  // Dances
  { id: 'dance1', label: 'Twerk', command: 'e twerk', category: 'dance' },
  { id: 'dance2', label: 'Salsa', command: 'e salsa', category: 'dance' },
  { id: 'dance3', label: 'Robot', command: 'e robot', category: 'dance' },
  { id: 'dance4', label: 'Hip Hop', command: 'e hiphop', category: 'dance' },
  { id: 'dance5', label: 'Ballet', command: 'e ballet', category: 'dance' },
  
  // Props
  { id: 'prop1', label: 'Coffee Cup', command: 'e coffee', category: 'prop' },
  { id: 'prop2', label: 'Smartphone', command: 'e phone', category: 'prop' },
  { id: 'prop3', label: 'Notepad', command: 'e notepad', category: 'prop' },
  { id: 'prop4', label: 'Umbrella', command: 'e umbrella', category: 'prop' },
  { id: 'prop5', label: 'Guitar', command: 'e guitar', category: 'prop' },
  { id: 'prop6', label: 'Briefcase', command: 'e briefcase', category: 'prop' },

  // Walking Styles
  { id: 'walk1', label: 'Gangster', command: 'walk gangster', category: 'walk' },
  { id: 'walk2', label: 'Posh', command: 'walk posh', category: 'walk' },
  { id: 'walk3', label: 'Injured', command: 'walk injured', category: 'walk' },
  { id: 'walk4', label: 'Drunk', command: 'walk drunk', category: 'walk' },
  
  // Expressions
  { id: 'face1', label: 'Angry', command: 'face angry', category: 'face' },
  { id: 'face2', label: 'Happy', command: 'face happy', category: 'face' },
  { id: 'face3', label: 'Shocked', command: 'face shocked', category: 'face' },
  { id: 'face4', label: 'Smug', command: 'face smug', category: 'face' },

  // Shared
  { id: 'shared1', label: 'Hug', command: 'e hug', category: 'shared' },
  { id: 'shared2', label: 'Handshake', command: 'e handshake', category: 'shared' },
  { id: 'shared3', label: 'Carry', command: 'e carry', category: 'shared' },
];
