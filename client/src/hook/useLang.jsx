import { createContext, useContext, useState } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('it');

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

/**
 * Custom hook to access language context
 * @returns {{ language: "it" | "en", setLanguage: (lang: "it" | "en") => void }} - language context values
 */
export const useLang = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLang must be used within a LanguageProvider");
    }
    return context;
};