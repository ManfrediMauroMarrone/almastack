'use client';

import { LanguageProvider } from "../hook/useLang";
import { ToastContainer } from 'react-toastify';

export function Providers({ children }) {
    return (
        <LanguageProvider>
            {children}
            <ToastContainer />
        </LanguageProvider>
    );
}