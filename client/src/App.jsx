import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Code, Palette, Brain, ShoppingCart, Users, Layers, Menu, X, Check, ArrowRight, Mail, Phone, MapPin, Star } from 'lucide-react';
import { useLang } from './hook/useLang';
import { translations } from './lang';

// Logo Component
const Logo = () => (
    <svg width="180" height="40" viewBox="0 0 180 40" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#f093fb', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#f093fb', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#f5576c', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
            </linearGradient>
        </defs>
        <g id="stack-symbol">
            <rect x="0" y="6" width="40" height="8" rx="2" fill="url(#gradient1)" />
            <rect x="3" y="18" width="34" height="8" rx="2" fill="url(#gradient2)" />
            <rect x="6" y="30" width="28" height="8" rx="2" fill="url(#gradient3)" />
        </g>
        <text x="52" y="28" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto" fontSize="28" fontWeight="600" fill="url(#textGradient)" letterSpacing="-0.5">
            Almastack
        </text>
    </svg>
);

// Floating 3D Blocks Component
const FloatingBlocks = () => {
    const blocks = [
        { size: 40, x: 100, y: 50, delay: 0 },
        { size: 30, x: 200, y: 100, delay: 0.2 },
        { size: 35, x: 150, y: 200, delay: 0.4 },
        { size: 45, x: 250, y: 150, delay: 0.6 },
        { size: 30, x: 50, y: 150, delay: 0.8 },
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {blocks.map((block, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    style={{ left: `${block.x}px`, top: `${block.y}px` }}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0],
                    }}
                    transition={{
                        duration: 4,
                        delay: block.delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <div
                        className="relative"
                        style={{ width: block.size, height: block.size }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 transform rotate-45 rounded-lg" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 transform rotate-45 rounded-lg blur-xl" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

// Navbar Component
const Navbar = ({ translate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const { language, setLanguage } = useLang();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [translate.nav.about, translate.nav.services, translate.nav.pricing, translate.nav.contact];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg' : 'bg-transparent'
                }`}
        >
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between max-w-[1480px] m-auto">
                    <Logo />

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(' ', '-')}`}
                                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
                            >
                                {item}
                            </a>
                        ))}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow"
                        >
                            {translate.nav.startProject}
                        </motion.button>
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
                            className="md:hidden mt-4"
                        >
                            {navItems.map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                                    className="block py-3 text-gray-700 hover:text-purple-600 transition-colors font-medium"
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

// Hero Section
const HeroSection = ({ translate }) => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50">
            <FloatingBlocks />

            <div className="container mx-auto px-6 py-20 relative z-10 max-w-[1480px] m-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                            {translate.hero.title1}{' '}
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {translate.hero.title2}
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            {translate.hero.subtitle}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
                            >
                                {translate.hero.cta1} <ChevronRight />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all border border-purple-200"
                            >
                                {translate.hero.cta2}
                            </motion.button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative w-full h-96 lg:h-[500px]">
                            {/* 3D Stack Visualization */}
                            <motion.div
                                animate={{ rotateY: [0, 10, 0] }}
                                transition={{ duration: 6, repeat: Infinity }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <div className="relative w-64 h-64">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute inset-0 rounded-2xl border-4 border-purple-300"
                                            style={{
                                                transform: `translateZ(${i * 30}px) translateY(${i * 20}px)`,
                                                background: `linear-gradient(135deg, rgba(102,126,234,${0.1 - i * 0.02}), rgba(246,93,108,${0.1 - i * 0.02}))`
                                            }}
                                            animate={{ y: [0, -10, 0] }}
                                            transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// About Section
const AboutSection = () => {
    const stats = [
        { number: "50+", label: "Progetti Completati" },
        { number: "30+", label: "Clienti Soddisfatti" },
        { number: "5+", label: "Anni di Esperienza" },
        { number: "99%", label: "Customer Satisfaction" },
    ];

    return (
        <section id="chi-siamo" className="py-20 bg-white">
            <div className="container mx-auto px-6 max-w-[1480px] m-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                        Chi <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Siamo</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Un team appassionato di sviluppatori e designer che trasforma le tue visioni in esperienze digitali straordinarie.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-3xl font-bold mb-6">Innovazione e Passione</h3>
                        <p className="text-gray-600 mb-4">
                            Almastack nasce dalla passione per la tecnologia e l'innovazione. Siamo specializzati nello sviluppo di soluzioni web moderne, scalabili e performanti.
                        </p>
                        <p className="text-gray-600 mb-4">
                            Il nostro approccio combina creatività tecnica e design thinking per creare prodotti digitali che non solo funzionano perfettamente, ma che ispirano e coinvolgono gli utenti.
                        </p>
                        <p className="text-gray-600">
                            Utilizziamo le tecnologie più moderne del panorama JavaScript - React, Node.js, Next.js - per garantire soluzioni all'avanguardia e future-proof.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-6">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 text-center"
                            >
                                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// Services Section
const ServicesSection = () => {
    const services = [
        {
            icon: <Code className="w-8 h-8" />,
            title: "Full Stack Development",
            description: "Sviluppo completo di applicazioni web scalabili con React, Node.js e database moderni.",
            features: ["API RESTful", "Database Design", "Cloud Deploy", "Performance Optimization"]
        },
        {
            icon: <Layers className="w-8 h-8" />,
            title: "Landing & Website",
            description: "Siti web e landing page ottimizzate per conversione e performance.",
            features: ["Design Responsive", "SEO Optimized", "Fast Loading", "CMS Integration"]
        },
        {
            icon: <Brain className="w-8 h-8" />,
            title: "AI Integration",
            description: "Integrazione di intelligenza artificiale per automatizzare e migliorare i processi.",
            features: ["ChatBot", "Machine Learning", "Data Analysis", "Process Automation"]
        },
        {
            icon: <ShoppingCart className="w-8 h-8" />,
            title: "E-Commerce",
            description: "Piattaforme e-commerce complete per vendere online con successo.",
            features: ["Payment Gateway", "Inventory Management", "Multi-currency", "Analytics"]
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Consulenza Tech",
            description: "Consulenza strategica per ottimizzare la tua presenza digitale.",
            features: ["Tech Stack Analysis", "Architecture Design", "Code Review", "Team Training"]
        },
        {
            icon: <Palette className="w-8 h-8" />,
            title: "UI/UX Design",
            description: "Design interfaces moderne e user-friendly che deliziano gli utenti.",
            features: ["User Research", "Wireframing", "Prototyping", "Design Systems"]
        }
    ];

    return (
        <section id="servizi" className="py-20 bg-gradient-to-br from-purple-50 via-white to-pink-50">
            <div className="container mx-auto px-6 max-w-[1480px] m-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                        I Nostri <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Servizi</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Offriamo una gamma completa di servizi per portare il tuo business al livello successivo.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10, transition: { duration: 0.2 } }}
                            className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white mb-6">
                                {service.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                            <p className="text-gray-600 mb-6">{service.description}</p>
                            <ul className="space-y-2">
                                {service.features.map((feature, i) => (
                                    <li key={i} className="flex items-center text-sm text-gray-600">
                                        <Check className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Pricing Section
const PricingSection = () => {
    const plans = [
        {
            name: "Landing Page",
            price: "€1,500",
            description: "Landing page professionale ottimizzata per conversioni",
            features: [
                "Design Responsive",
                "Animazioni Moderne",
                "SEO Ottimizzato",
                "Form Contatti",
                "Analytics Integration",
                "Hosting 1 Anno Incluso"
            ],
            popular: false
        },
        {
            name: "Website Completo",
            price: "€3,500",
            description: "Sito web multi-pagina completo e professionale",
            features: [
                "Fino a 10 Pagine",
                "CMS Integration",
                "Blog System",
                "Multi-lingua",
                "E-mail Professionale",
                "Supporto 6 Mesi"
            ],
            popular: true
        },
        {
            name: "Consulenza",
            price: "€150/h",
            description: "Consulenza tecnica e strategica personalizzata",
            features: [
                "Analisi Tecnica",
                "Architecture Review",
                "Performance Audit",
                "Security Assessment",
                "Team Training",
                "Documentazione"
            ],
            popular: false
        }
    ];

    return (
        <section id="pricing" className="py-20 bg-white">
            <div className="container mx-auto px-6 max-w-[1480px] m-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                        I Nostri <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Prezzi</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Prezzi trasparenti e competitivi. Per progetti Full Stack, AI ed E-commerce, contattaci per un preventivo personalizzato.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative rounded-2xl p-8 ${plan.popular
                                ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-2xl scale-105'
                                : 'bg-gray-50 shadow-xl'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
                                        Più Popolare
                                    </span>
                                </div>
                            )}

                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <div className="text-4xl font-bold mb-4">
                                {plan.price}
                            </div>
                            <p className={`mb-6 ${plan.popular ? 'text-white/90' : 'text-gray-600'}`}>
                                {plan.description}
                            </p>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center">
                                        <Check className={`w-5 h-5 mr-3 flex-shrink-0 ${plan.popular ? 'text-white' : 'text-purple-600'
                                            }`} />
                                        <span className={plan.popular ? 'text-white/90' : 'text-gray-600'}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`w-full py-3 rounded-full font-semibold transition-all ${plan.popular
                                    ? 'bg-white text-purple-600 hover:bg-gray-100'
                                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                                    }`}
                            >
                                Inizia Ora
                            </motion.button>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center p-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl"
                >
                    <h3 className="text-2xl font-bold mb-4">Progetti Enterprise?</h3>
                    <p className="text-gray-600 mb-6">
                        Per progetti Full Stack, AI Integration ed E-commerce richiedi un preventivo personalizzato.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
                    >
                        Richiedi Preventivo
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};

// Contact Section
const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        service: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Handle form submission here
        alert('Grazie per averci contattato! Ti risponderemo presto.');
        setFormData({ name: '', email: '', service: '', message: '' });
    };

    return (
        <section id="contatti" className="py-20 bg-gradient-to-br from-purple-50 via-white to-pink-50">
            <div className="container mx-auto px-6 max-w-[1480px] m-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                        Inizia il Tuo <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Progetto</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Raccontaci la tua idea e trasformiamola insieme in realtà.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-3xl font-bold mb-6">Parliamo del tuo progetto</h3>
                        <p className="text-gray-600 mb-8">
                            Siamo sempre entusiasti di conoscere nuove idee e sfide. Contattaci per una consulenza gratuita.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Email</h4>
                                    <p className="text-gray-600">info@almastack.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Telefono</h4>
                                    <p className="text-gray-600">+39 123 456 7890</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Sede</h4>
                                    <p className="text-gray-600">Milano, Italia</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl shadow-xl p-8"
                    >
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nome *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="Il tuo nome"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="tua@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Servizio di Interesse
                                </label>
                                <select
                                    value={formData.service}
                                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                >
                                    <option value="">Seleziona un servizio</option>
                                    <option value="fullstack">Full Stack Development</option>
                                    <option value="landing">Landing & Website</option>
                                    <option value="ai">AI Integration</option>
                                    <option value="ecommerce">E-Commerce</option>
                                    <option value="consulting">Consulenza</option>
                                    <option value="uiux">UI/UX Design</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Messaggio *
                                </label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows={5}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Descrivi il tuo progetto..."
                                />
                            </div>

                            <motion.button
                                onClick={handleSubmit}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                Invia Messaggio <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// Footer Component
const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-6 max-w-[1480px] m-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0">
                        <Logo />
                        <p className="text-gray-400 mt-4">
                            Trasformiamo idee in realtà digitali
                        </p>
                    </div>

                    <div className="flex gap-6 text-gray-400">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie</a>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
                    <p>© 2024 Almastack. Tutti i diritti riservati. Made with ❤️ in Italy</p>
                </div>
            </div>
        </footer>
    );
};

// Main App Component
const App = () => {
    const { language } = useLang();

    const translate = translations[language];

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