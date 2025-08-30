'use client'

import { useEffect, useState } from "react";
import useHash from "../hook/useHash";
import { useLang } from "../hook/useLang";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";
import { Menu, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

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
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''
                }`}
        >
            <div className="container mx-auto px-6 py-4 bg-white/80 backdrop-blur-xl">
                <div className="flex items-center justify-between max-w-[1480px] m-auto">
                    <a href="#">
                        <Logo />
                    </a>

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
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={`#${translate.nav.contact.toLowerCase().replace(' ', '-')}`}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-800 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow"
                        >
                            {translate.nav.startProject}
                        </motion.a>
                        <select onChange={handleLangChange} value={language} className="outline-none cursor-pointer">
                            <option value="it">IT</option>
                            <option value="en">EN</option>
                        </select>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-gray-700"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="md:hidden fixed top-[72px] right-0 w-full h-full bg-white/95 backdrop-blur-xl"
                    >
                        <div className="p-6">
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
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;