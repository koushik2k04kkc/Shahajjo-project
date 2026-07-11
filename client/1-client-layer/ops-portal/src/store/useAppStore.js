import { create } from 'zustand'

const initialLanguage = localStorage.getItem('ops_language') || 'EN'
document.documentElement.lang = initialLanguage === 'BN' ? 'bn-BD' : 'en'

export const useAppStore = create((set) => ({
  role: 'Agent operator',
  language: initialLanguage,
  activeView: 'Overview',
  setRole: (role) => set({ role }),
  setLanguage: (language) => { localStorage.setItem('ops_language', language); document.documentElement.lang = language === 'BN' ? 'bn-BD' : 'en'; set({ language }) },
  setActiveView: (activeView) => set({ activeView }),
}))
