'use client';

import { useEffect } from 'react';
import { useLang } from '../hook/useLang';
import { translations } from '../lang';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import PricingSection from '../components/PricingSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

// Main App Component
const App = () => {
    const { language } = useLang();

    const translate = translations[language];

    useEffect(() => {
        document.title = translate.head.title;
        document.head.querySelector('meta[name="description"]').setAttribute('content', translate.head.description);
    }, [language]);

    return (
        <div className="min-h-screen">
            <Navbar translate={translate} />
            <HeroSection translate={translate} />
            <AboutSection translate={translate} />
            <ServicesSection translate={translate} />
            <PricingSection translate={translate} />
            <ContactSection translate={translate} />
            <Footer translate={translate} />
        </div>
    );
};

export default App;