import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css'
import App from './App.tsx'

import LoggedInPage from "./pages/LoggedIn";
import LoginPage from "./pages/Login";

import { ThemeProvider } from "@/components/theme-provider"

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme" >

         <BrowserRouter>

            <Routes>

               <Route path='/' element={<App />} />
               <Route path='/login' element={<LoginPage />} />
               <Route path='/loggedin' element={<LoggedInPage />} />

            </Routes>

         </BrowserRouter>

      </ThemeProvider>
   </StrictMode>,
)
