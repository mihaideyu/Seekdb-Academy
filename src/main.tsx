import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ProgressProvider } from '@/context/ProgressContext'
import { OnboardingProvider } from '@/context/OnboardingContext'
import { SidebarProvider } from '@/context/SidebarContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { ConfettiProvider } from '@/context/ConfettiContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
      <LanguageProvider>
        <ProgressProvider>
          <OnboardingProvider>
            <SidebarProvider>
              <ConfettiProvider>
                <App />
              </ConfettiProvider>
            </SidebarProvider>
          </OnboardingProvider>
        </ProgressProvider>
      </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
