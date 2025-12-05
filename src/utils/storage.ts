import type { Fielder, SavedSetup } from '../types';

const STORAGE_KEY = 'cricket-field-setups';

export function getSavedSetups(): SavedSetup[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveSetup(name: string, fielders: Fielder[], isLeftHanded: boolean): SavedSetup {
  const setups = getSavedSetups();
  const newSetup: SavedSetup = {
    id: `setup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    fielders,
    isLeftHanded,
    createdAt: Date.now(),
  };

  setups.push(newSetup);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(setups));
  return newSetup;
}

export function deleteSetup(id: string): void {
  const setups = getSavedSetups().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(setups));
}

export function loadSetup(id: string): SavedSetup | null {
  const setups = getSavedSetups();
  return setups.find(s => s.id === id) || null;
}


