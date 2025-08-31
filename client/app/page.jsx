'use client';

import { useSearchParams } from 'next/navigation';
import { useLang } from '../hooks/useLang';
import { translations } from '../lang';

import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import FoundersSection from '../components/FounderSection';
import PricingSection from '../components/PricingSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

// Main App Component
const App = () => {
    const searchParams = useSearchParams();
    const { language } = useLang(searchParams.get('lang') || 'it');

    const translate = translations[language];

    return (
        <div className="min-h-screen w-screen overflow-x-hidden">
            <Navbar translate={translate} />
            <HeroSection translate={translate} />
            <AboutSection translate={translate} />
            <ServicesSection translate={translate} />
            <FoundersSection translate={translate} />
            <PricingSection translate={translate} />
            <ContactSection translate={translate} />
            <Footer translate={translate} />
        </div>
    );
};

export default App;