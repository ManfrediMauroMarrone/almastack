'use client';

import Link from "next/link";
import Logo from "./Logo";
import { Mail, Phone, MapPin, Linkedin, Github, ArrowUpRight, Code, Sparkles, Send } from "lucide-react";

const Footer = ({ translate }) => {
    const currentYear = new Date().getFullYear();
    
    // Quick links for navigation
    const quickLinks = [
        { href: `#${translate.nav.about.toLowerCase().replace(' ', '-')}`, label: translate.nav.about },
        { href: `#${translate.nav.services.toLowerCase().replace(' ', '-')}`, label: translate.nav.services },
        { href: `#${translate.nav.founders.toLowerCase().replace(' ', '-')}`, label: translate.nav.founders },
        { href: `#${translate.nav.pricing.toLowerCase().replace(' ', '-')}`, label: translate.nav.pricing },
        { href: `#${translate.nav.contact.toLowerCase().replace(' ', '-')}`, label: translate.nav.contact },
    ];
    
    // Services links
    const servicesLinks = [
        { href: `#${translate.nav.services.toLowerCase().replace(' ', '-')}`, label: translate.services.items.fullstack.title },
        { href: `#${translate.nav.services.toLowerCase().replace(' ', '-')}`, label: translate.services.items.ai.title },
        { href: `#${translate.nav.services.toLowerCase().replace(' ', '-')}`, label: translate.services.items.ecommerce.title },
        { href: `#${translate.nav.services.toLowerCase().replace(' ', '-')}`, label: translate.services.items.consulting.title },
    ];
    
    // Social media links
    const socialLinks = [
        { 
            href: "https://www.linkedin.com/company/almastack/", 
            icon: Linkedin, 
            label: "LinkedIn",
            color: "hover:text-blue-400"
        },
        { 
            href: "https://github.com/almastack", 
            icon: Github, 
            label: "GitHub",
            color: "hover:text-gray-400"
        },
    ];

    return (
        <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
            {/* Main Footer Content */}
            <div className="container mx-auto px-6 py-16 max-w-[1480px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    
                    {/* Company Info */}
                    <div className="space-y-4">
                        <Logo />
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {translate.footer.tagline}
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3 pt-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-gray-700 ${social.color}`}
                                    >
                                        <Icon size={18} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <Sparkles size={16} className="text-purple-400" />
                            {translate.footer.quickLinks || "Quick Links"}
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <a 
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-1 group"
                                    >
                                        <span>{link.label}</span>
                                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <Code size={16} className="text-blue-400" />
                            {translate.footer.services || "Services"}
                        </h3>
                        <ul className="space-y-3">
                            {servicesLinks.map((link) => (
                                <li key={link.label}>
                                    <a 
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-1 group"
                                    >
                                        <span>{link.label}</span>
                                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <Send size={16} className="text-blue-400" />
                            {translate.footer.contactInfo || "Contact Info"}
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <a 
                                    href="mailto:info@almastack.it"
                                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-start gap-3 group"
                                >
                                    <Mail size={16} className="mt-0.5 text-gray-500 group-hover:text-purple-400 transition-colors" />
                                    <span>info@almastack.it</span>
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="tel:+393883986292"
                                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-start gap-3 group"
                                >
                                    <Phone size={16} className="mt-0.5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                                    <div>
                                        <span>+39 388 398 6292</span>
                                    </div>
                                </a>
                                <a 
                                    href="tel:+393342872489"
                                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-start gap-3 group"
                                >
                                    <Phone size={16} className="mt-0.5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                                    <div>
                                        <span>+39 334 287 2489</span>
                                    </div>
                                </a>
                            </li>
                            <li className="text-gray-400 text-sm flex items-start gap-3">
                                <MapPin size={16} className="mt-0.5 text-gray-500" />
                                <span>{translate.contact.info.locationValue || "Italy"}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter Section (Optional) */}
                {/* <div className="mt-12 pt-8 border-t border-gray-800">
                    <div className="max-w-md mx-auto text-center lg:mx-0 lg:text-left">
                        <h3 className="text-lg font-semibold mb-2">
                            {translate.footer.newsletter?.title || "Stay Updated"}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                            {translate.footer.newsletter?.subtitle || "Subscribe to our newsletter for the latest updates"}
                        </p>
                        <form className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder={translate.footer.newsletter?.placeholder || "Enter your email"}
                                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                            >
                                {translate.footer.newsletter?.button || "Subscribe"}
                            </button>
                        </form>
                    </div>
                </div> */}
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-6 py-6 max-w-[1480px]">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-400">
                            <p>© {currentYear} Almastack. {translate.footer.rights}</p>
                            <span className="hidden md:inline">•</span>
                            <Link 
                                href="/privacy-policy" 
                                className="hover:text-white transition-colors"
                            >
                                {translate.footer.privacy}
                            </Link>
                            {/* <span className="hidden md:inline">•</span>
                            <Link 
                                href="/terms" 
                                className="hover:text-white transition-colors"
                            >
                                {translate.footer.terms || "Terms of Service"}
                            </Link> */}
                        </div>
                        
                        {/* Credits */}
                        <div className="text-xs text-gray-500">
                            <a 
                                href="https://www.vecteezy.com/free-vector/server"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-gray-400 transition-colors"
                            >
                                Server Vectors by Vecteezy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;