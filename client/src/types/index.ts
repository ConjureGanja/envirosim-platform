// client/src/types/index.ts

export interface World {
  id: string;
  name: string;
  concept: string;
  genre: string;
  tone: string;
  description: string;
  lore: {
    history: { year: string; event: string; description: string }[];
    factions: { name: string; description: string }[];
  };
  characters: Character[];
  locations: Location[];
  plotPoints: PlotPoint[];
  assets: Asset[];
}

export interface Character {
  id: string;
  name: string;
  role: string;
  archetype: string;
  description: string;
  imagePrompt: string;
}

export interface Location {
  id: string;
  name: string;
  type: string;
  description: string;
  imagePrompt: string;
}

export interface PlotPoint {
  title: string;
  description: string;
}

export interface Asset {
  id: string;
  type: 'image' | 'diagram' | 'model';
  url: string;
  description: string;
}
