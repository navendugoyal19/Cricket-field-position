export type FielderCategory = 'keeper' | 'bowler' | 'slip' | 'close' | 'ring' | 'boundary';

export interface Position {
  id: string;
  name: string;
  label: string;
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
  category: FielderCategory;
}

export interface Fielder extends Position {
  isActive: boolean;
}

export interface FieldPreset {
  id: string;
  name: string;
  description: string;
  fielderIds: string[];
}

export interface SavedSetup {
  id: string;
  name: string;
  fielders: Fielder[];
  isLeftHanded: boolean;
  createdAt: number;
}


