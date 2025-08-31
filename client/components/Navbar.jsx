'use client'

import { useEffect, useState } from "react";
import useHash from "../hooks/useHash";
import { useLang } from "../hooks/useLang";
import Logo from "./Logo";
import { Menu, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import 'animate.css';
import Link from "next/link";

const Navbar = ({ translate }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    
    const hash = useHash();
    const { language, setLanguage } = useLang(searchParams.get('lang') || 'it');

    const navItems = [translate.nav.about, translate.nav.services, translate.nav.founders, translate.nav.pricing, translate.nav.contact];

    const handleLangChange = (e) => {
        setLanguage(e.target.value);
        router.push(`?lang=${e.target.value}`);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed backdrop-blur-lg top-0 w-full z-50 transition-all duration-300 animate__animated animate__fadeInDown ${scrolled ? 'shadow-lg' : ''}`}
        >
            <div className="container mx-auto px-6 py-4 bg-white/80 backdrop-blur-xl">
                <div className="flex items-center justify-between max-w-[1480px] m-auto">
                    <Link href="/">
                        <Logo />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(' ', '-')}`}
                                className={`hover:text-indigo-600 transition-colors font-medium m ${hash === item.toLowerCase().replace(' ', '-') ? 'text-indigo-600' : 'text-gray-700'}`}
                            >
                                {item}
                            </a>
                        ))}
                        <a
                            href={`#${translate.nav.contact.toLowerCase().replace(' ', '-')}`}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-800 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                        >
                            {translate.nav.startProject}
                        </a>
                        <select onChange={handleLangChange} value={language} className="outline-none cursor-pointer">
                            <option value="it">IT</option>
                            <option value="en">EN</option>
                        </select>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-gray-700"
                        aria-label="Toggle Menu"
                        title="Toggle Menu"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div
                    className={`md:hidden fixed top-[72px] right-0 w-full h-full bg-white backdrop-blur-xl animate__animated ${
                        isOpen ? 'animate__slideInRight' : 'animate__slideOutRight'
                    }`}
                >
                    <div className="p-6 bg-white h-[calc(100vh-72px)] flex flex-col">
                        <div className="flex-grow">
                            {navItems.map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                                    onClick={() => setIsOpen(false)}
                                    className={`block py-4 hover:text-indigo-600 transition-colors font-medium text-lg ${
                                        hash === item.toLowerCase().replace(' ', '-') ? 'text-indigo-600' : 'text-gray-700'
                                    }`}
                                >
                                    {item}
                                </a>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <select 
                                value={language} 
                                onChange={handleLangChange} 
                                className="outline-none cursor-pointer text-gray-700 font-medium text-lg"
                            >
                                <option value="it">Italiano</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;