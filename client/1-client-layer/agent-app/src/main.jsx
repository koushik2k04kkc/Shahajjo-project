import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../public/locales/en/translation.json'
import bn from '../public/locales/bn/translation.json'
import UnifiedApp from './UnifiedApp'
import { queryClient } from './lib/queryClient'
import './styles/globals.css'
i18n.use(initReactI18next).init({resources:{en:{translation:en},bn:{translation:bn}},lng:localStorage.getItem('shahajjo_language')||'en',fallbackLng:'en',interpolation:{escapeValue:false}})
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><QueryClientProvider client={queryClient}><UnifiedApp/></QueryClientProvider></React.StrictMode>)
