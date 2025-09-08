'use client';

import { LanguageProvider } from "../hooks/useLang";
import { ToastContainer } from 'react-toastify';

export function Providers({ children }) {
    return (
        <LanguageProvider>
            {children}
            <ToastContainer />
        </LanguageProvider>
    );
}