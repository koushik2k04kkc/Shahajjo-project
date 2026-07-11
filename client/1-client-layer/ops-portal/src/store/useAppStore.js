import { create } from 'zustand'

export const useAppStore = create((set) => ({
  role: 'Agent operator',
  language: localStorage.getItem('ops_language') || 'EN',
  activeView: 'Overview',
  setRole: (role) => set({ role }),
  setLanguage: (language) => { localStorage.setItem('ops_language', language); document.documentElement.lang = language === 'BN' ? 'bn' : 'en'; set({ language }) },
  setActiveView: (activeView) => set({ activeView }),
}))
