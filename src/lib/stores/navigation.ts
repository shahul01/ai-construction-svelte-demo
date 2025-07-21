import { writable } from 'svelte/store';

export type Tab = 'dashboard' | 'projects' | 'safety' | 'quality' | 'equipment' | 'analytics';
export const activeTab = writable<Tab>('dashboard');
