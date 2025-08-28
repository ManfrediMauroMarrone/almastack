'use client';

import { useEffect, useState } from "react";
import useHash from "../hook/useHash";
import { useLang } from "../hook/useLang";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";
import { Menu, X } from "lucide-react";

const Navbar = ({ translate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    
    const hash = useHash();
    const { language, setLanguage } = useLang();

    const navItems = [translate.nav.about, translate.nav.services, translate.nav.pricing, translate.nav.contact];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        console.log(hash)
    }, [hash])

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
                        <select onChange={(e) => setLanguage(e.target.value)} value={language} className="outline-none cursor-pointer">
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

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden mt-4 "
                        >
                            {navItems.map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                                    className={`block py-3 hover:text-indigo-600 transition-colors font-medium ${hash === item.toLowerCase().replace(' ', '-') ? 'text-indigo-600' : 'text-gray-700'}`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item}
                                </a>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
};

export default Navbar;