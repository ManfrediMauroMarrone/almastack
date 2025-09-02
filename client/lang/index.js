import { Bot, Rocket, Target, Zap } from "lucide-react";

export const translations = {
    it: {
        head: {
            title: "Almastack - Trasformiamo idee in realtà digitali",
            description: "Sviluppiamo soluzioni web innovative e scalabili per far crescere il tuo business nel mondo digitale."
        },
        nav: {
            about: 'Chi siamo',
            services: 'Servizi',
            founders: 'Founders',
            pricing: 'Prezzi',
            contact: 'Contatti',
            startProject: 'Inizia Progetto'
        },
        hero: {
            title1: 'Trasformiamo idee in',
            title2: 'realtà digitali',
            subtitle: 'Sviluppiamo soluzioni web innovative e scalabili per far crescere il tuo business nel mondo digitale.',
            cta1: 'Scopri i Servizi',
            cta2: 'Contattaci'
        },
        about: {
            title1: 'Chi',
            title2: 'Siamo',
            subtitle: 'Un team appassionato di sviluppatori e designer che trasforma le tue visioni in esperienze digitali straordinarie.',
            heading: 'Innovazione e Passione',
            text1: 'Almastack nasce dalla passione per la tecnologia e l\'innovazione. Siamo specializzati nello sviluppo di soluzioni web moderne, scalabili e performanti.',
            text2: 'Il nostro approccio combina creatività tecnica e design thinking per creare prodotti digitali che non solo funzionano perfettamente, ma che ispirano e coinvolgono gli utenti.',
            text3: 'Utilizziamo le tecnologie più moderne del panorama Tech - React, Next.js, Node.js, Python (e molto altro) - per garantire soluzioni all\'avanguardia e future-proof.',
            cta: 'Scopri come lavoriamo',
            boxes: [
                {
                    icon: <Zap />,
                    title: "Tecnologie Cutting-Edge",
                    description: "React, Node.js, Next.js, Python (e molto altro) e le più moderne tecnologie per soluzioni all'avanguardia",
                    gradient: "from-blue-50 to-cyan-50",
                    textGradient: "bg-gradient-to-r from-blue-600 to-cyan-600"
                },
                {
                    icon: <Target />,
                    title: "Approccio Agile",
                    description: "Metodologie agili per delivery rapidi e iterativi, con feedback continuo e risultati misurabili",
                    gradient: "from-purple-50 to-pink-50",
                    textGradient: "bg-gradient-to-r from-purple-600 to-pink-600"
                },
                {
                    icon: <Bot />,
                    title: "AI-Powered Solutions",
                    description: "Integriamo intelligenza artificiale per automatizzare processi e creare esperienze innovative",
                    gradient: "from-green-50 to-emerald-50",
                    textGradient: "bg-gradient-to-r from-green-600 to-emerald-600"
                },
                {
                    icon: <Rocket />,
                    title: "Performance First",
                    description: "Ottimizzazione estrema per Core Web Vitals, SEO e user experience impeccabile",
                    gradient: "from-orange-50 to-red-50",
                    textGradient: "bg-gradient-to-r from-orange-600 to-red-600"
                }
            ],
        },
        services: {
            title1: 'I Nostri',
            title2: 'Servizi',
            subtitle: 'Offriamo una gamma completa di servizi per portare il tuo business al livello successivo.',
            items: {
                fullstack: {
                    title: 'Full Stack Development',
                    description: 'Sviluppo completo di applicazioni web scalabili con React, Node.js e database moderni.',
                    features: ['API RESTful', 'Database Design', 'Cloud Deploy', 'Performance Optimization']
                },
                landing: {
                    title: 'Landing & Website',
                    description: 'Siti web e landing page ottimizzate per conversione e performance.',
                    features: ['Design Responsive', 'SEO Optimized', 'Fast Loading', 'CMS Integration']
                },
                ai: {
                    title: 'AI Integration',
                    description: 'Integrazione di intelligenza artificiale per automatizzare e migliorare i processi.',
                    features: ['ChatBot', 'Machine Learning', 'Data Analysis', 'Process Automation']
                },
                ecommerce: {
                    title: 'E-Commerce',
                    description: 'Piattaforme e-commerce complete per vendere online con successo.',
                    features: ['Payment Gateway', 'Inventory Management', 'Multi-currency', 'Analytics']
                },
                consulting: {
                    title: 'Consulenza Tech',
                    description: 'Consulenza strategica per ottimizzare la tua presenza digitale.',
                    features: ['Tech Stack Analysis', 'Architecture Design', 'Code Review', 'Team Training']
                },
                uiux: {
                    title: 'UI/UX Design',
                    description: 'Design interfaces moderne e user-friendly che deliziano gli utenti.',
                    features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems']
                },
                other: {
                    title: 'Altri Servizi',
                    description: 'Servizi aggiuntivi per soddisfare le tue esigenze specifiche.',
                    features: ['Personalizzazione', 'Integrazione API', 'Formazione', 'Supporto Continuo']
                }
            }
        },
        founders: {
            title1: 'Founders di',
            title2: 'Almastack',
            subtitle: 'Le menti creative dietro Almastack',
            mission: 'La nostra missione',
            missionText: 'Creare soluzioni digitali che non solo risolvono problemi, ma ispirano innovazione.',
            experience: 'Anni di esperienza',
            projects: 'Progetti completati',
            founders: [
                {
                    name: 'Alessandro D\'Antoni',
                    role: 'Co-Founder',
                    bio: 'Full Stack Developer con oltre 14 anni di esperienza nel settore. Specializzato in architetture scalabili e gestione di team di sviluppo per startup innovative.',
                    specialties: ['React', 'Node.js', 'Cloud', 'AI/ML', 'Python', 'DevOps'],
                    linkedin: 'https://www.linkedin.com/in/alessandrodantoni/',
                    image: '/alessandro_avatar-min.webp',
                    stats: { experience: '14+', projects: '100+' }
                },
                {
                    name: 'Manfredi Mauro Marrone',
                    role: 'Co-Founder',
                    bio: 'Full Stack Developer con oltre 5 anni di esperienza. Ha collaborato con diverse aziende IT, sviluppando soluzioni digitali moderne ed efficaci.',
                    specialties: ['React', 'Node.js', 'Cloud', 'AI/ML', 'Python', 'DevOps'],
                    linkedin: 'https://www.linkedin.com/in/manfredi-mauro-marrone-364153196/',
                    image: '/manfredi_avatar-min.webp',
                    stats: { experience: '5+', projects: '100+' }
                }
            ]
        },
        pricing: {
            title1: 'I Nostri',
            title2: 'Prezzi',
            subtitle: 'Prezzi trasparenti e competitivi. Per progetti Full Stack, AI ed E-commerce, contattaci per un preventivo personalizzato.',
            popular: 'Più Popolare',
            startNow: 'Inizia Ora',
            requestQuote: 'Richiedi Preventivo',
            enterprise: {
                title: 'Progetti Enterprise?',
                subtitle: 'Per progetti Full Stack, AI Integration ed E-commerce richiedi un preventivo personalizzato.'
            },
            plans: {
                landing: {
                    name: 'Landing Page',
                    from: 'Da',
                    price: '€500',
                    description: 'Landing page professionale ottimizzata per conversioni',
                    features: [
                        "Design Responsive",
                        "Animazioni Moderne",
                        "SEO Ottimizzato",
                        "Form Contatti",
                        "Analytics Integration",
                        "Hosting 1 Anno Incluso"
                    ]
                },
                website: {
                    name: 'Website Completo',
                    from: 'Da',
                    price: '€1.500',
                    description: 'Sito web multi-pagina completo e professionale',
                    features: [
                        "Fino a 10 Pagine",
                        "CMS Integration",
                        "Blog System",
                        "Multi-lingua",
                        "E-mail Professionale",
                        "Supporto 6 Mesi"
                    ]
                },
                consulting: {
                    name: 'Consulenza',
                    from: 'Da',
                    price: '€150/h',
                    description: 'Consulenza tecnica e strategica personalizzata',
                    features: [
                        "Analisi Tecnica",
                        "Architecture Review",
                        "Performance Audit",
                        "Security Assessment",
                        "Team Training",
                        "Documentazione"
                    ]
                }
            }
        },
        contact: {
            title1: 'Inizia il Tuo',
            title2: 'Progetto',
            subtitle: 'Raccontaci la tua idea e trasformiamola insieme in realtà.',
            heading: 'Parliamo del tuo progetto',
            description: 'Siamo sempre entusiasti di conoscere nuove idee e sfide. Contattaci per una consulenza gratuita.',
            form: {
                name: 'Nome',
                email: 'Email',
                phone: 'Telefono',
                service: 'Come possiamo aiutarti?',
                message: 'Messaggio',
                selectService: 'Seleziona un servizio',
                placeholder: {
                    name: 'Il tuo nome',
                    email: 'tua@email.com',
                    phone: 'Il tuo numero di telefono',
                    message: 'Descrivi il tuo progetto...'
                },
                submit: 'Invia Messaggio',
                required: 'Per favore compila tutti i campi obbligatori',
                success: 'Grazie per averci contattato! Ti risponderemo presto.',
                error: 'Qualcosa è andato storto. Per favore riprova più tardi.',
                loading: 'Invio...',
            },
            info: {
                email: 'Email',
                phone: 'Telefono',
                location: 'Sede',
                locationValue: 'Palermo, Italia'
            }
        },
        footer: {
            tagline: 'Trasformiamo idee in realtà digitali',
            privacy: 'Privacy Policy',
            terms: 'Termini',
            cookie: 'Cookie',
            rights: 'Almastack. Tutti i diritti riservati. Made with ❤️ in Italy'
        }
    },
    en: {
        head: {
            title: "Almastack - Transforming Ideas into Digital Realities",
            description: "We develop innovative and scalable web solutions to grow your business in the digital world."
        },
        nav: {
            about: 'About',
            services: 'Services',
            founders: 'Founders',
            pricing: 'Pricing',
            contact: 'Contact',
            startProject: 'Start Project'
        },
        hero: {
            title1: 'Transforming ideas into',
            title2: 'digital realities',
            subtitle: 'We develop innovative and scalable web solutions to grow your business in the digital world.',
            cta1: 'Discover Services',
            cta2: 'Contact Us'
        },
        about: {
            title1: 'About',
            title2: 'Us',
            subtitle: 'A passionate team of developers and designers transforming your visions into extraordinary digital experiences.',
            heading: 'Innovation and Passion',
            text1: 'Almastack was born from passion for technology and innovation. We specialize in developing modern, scalable, and high-performance web solutions.',
            text2: 'Our approach combines technical creativity and design thinking to create digital products that not only work perfectly but inspire and engage users.',
            text3: 'We use the most modern JavaScript technologies - React, Node.js, Next.js - to ensure cutting-edge and future-proof solutions.',
            cta: 'Discover how we work',
            boxes: [
                {
                    icon: <Zap />,
                    title: "Cutting-Edge Tech Stack",
                    description: "React, Next.js, Node.js and the latest JavaScript technologies for state-of-the-art solutions",
                    gradient: "from-blue-50 to-cyan-50",
                    textGradient: "bg-gradient-to-r from-blue-600 to-cyan-600"
                },
                {
                    icon: <Target />,
                    title: "Agile Approach",
                    description: "Agile methodologies for rapid, iterative delivery with continuous feedback and measurable results",
                    gradient: "from-purple-50 to-pink-50",
                    textGradient: "bg-gradient-to-r from-purple-600 to-pink-600"
                },
                {
                    icon: <Bot />,
                    title: "AI-Powered Solutions",
                    description: "We integrate artificial intelligence to automate processes and create innovative experiences",
                    gradient: "from-green-50 to-emerald-50",
                    textGradient: "bg-gradient-to-r from-green-600 to-emerald-600"
                },
                {
                    icon: <Rocket />,
                    title: "Performance First",
                    description: "Extreme optimization for Core Web Vitals, SEO and impeccable user experience",
                    gradient: "from-orange-50 to-red-50",
                    textGradient: "bg-gradient-to-r from-orange-600 to-red-600"
                }
            ],
        },
        founders: {
            title1: 'Inside',
            title2: 'Almastack',
            subtitle: 'The creative minds behind Almastack',
            mission: 'Our Mission',
            missionText: 'Creating digital solutions that not only solve problems but inspire innovation.',
            experience: 'Years of experience',
            projects: 'Completed projects',
            founders: [
                {
                    name: 'Alessandro D\'Antoni',
                    role: 'Co-Founder',
                    bio: 'Senior Full Stack Developer and AI specialist with over 14 years of experience. Specialized in scalable architectures for innovative startups.',
                    specialties: ['React', 'Node.js', 'Cloud', 'AI/ML', 'Python', 'DevOps'],
                    linkedin: 'https://www.linkedin.com/in/alessandrodantoni/',
                    image: '/alessandro_avatar-min.webp',
                    stats: { experience: '14+', projects: '100+' }
                },
                {
                    name: 'Manfredi Mauro Marrone',
                    role: 'Co-Founder',
                    bio: 'Full Stack Developer with over 5 years of industry experience. Worked with several IT companies, building modern and effective digital solutions.',
                    specialties: ['React', 'Node.js', 'Cloud', 'AI/ML', 'Python', 'DevOps'],
                    linkedin: 'https://www.linkedin.com/in/manfredi-mauro-marrone-364153196/',
                    image: '/manfredi_avatar-min.webp',
                    stats: { experience: '5+', projects: '100+' }
                }
            ]
        },
        services: {
            title1: 'Our',
            title2: 'Services',
            subtitle: 'We offer a complete range of services to take your business to the next level.',
            items: {
                fullstack: {
                    title: 'Full Stack Development',
                    description: 'Complete development of scalable web applications with React, Node.js and modern databases.',
                    features: ['RESTful API', 'Database Design', 'Cloud Deploy', 'Performance Optimization']
                },
                landing: {
                    title: 'Landing & Website',
                    description: 'Websites and landing pages optimized for conversion and performance.',
                    features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'CMS Integration']
                },
                ai: {
                    title: 'AI Integration',
                    description: 'Artificial intelligence integration to automate and improve processes.',
                    features: ['ChatBot', 'Machine Learning', 'Data Analysis', 'Process Automation']
                },
                ecommerce: {
                    title: 'E-Commerce',
                    description: 'Complete e-commerce platforms for successful online selling.',
                    features: ['Payment Gateway', 'Inventory Management', 'Multi-currency', 'Analytics']
                },
                consulting: {
                    title: 'Tech Consulting',
                    description: 'Strategic consulting to optimize your digital presence.',
                    features: ['Tech Stack Analysis', 'Architecture Design', 'Code Review', 'Team Training']
                },
                uiux: {
                    title: 'UI/UX Design',
                    description: 'Modern and user-friendly interface designs that delight users.',
                    features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems']
                },
                other: {
                    title: 'Other Services',
                    description: 'Additional services to meet your specific needs.',
                    features: ['Customization', 'API Integration', 'Training', 'Ongoing Support']
                }
            }
        },
        pricing: {
            title1: 'Our',
            title2: 'Pricing',
            subtitle: 'Transparent and competitive pricing. For Full Stack, AI and E-commerce projects, contact us for a custom quote.',
            popular: 'Most Popular',
            startNow: 'Start Now',
            requestQuote: 'Request Quote',
            enterprise: {
                title: 'Enterprise Projects?',
                subtitle: 'For Full Stack, AI Integration and E-commerce projects request a custom quote.'
            },
            plans: {
                landing: {
                    name: 'Landing Page',
                    from: "From",
                    price: '€500',
                    description: 'Professional landing page optimized for conversions',
                    features: [
                        "Responsive Design",
                        "Modern Animations",
                        "SEO Optimized",
                        "Contact Form",
                        "Analytics Integration",
                        "1 Year Hosting Included"
                    ]
                },
                website: {
                    name: 'Complete Website',
                    from: "From",
                    price: '€1.500',
                    description: 'Complete professional multi-page website',
                    features: [
                        'Up to 10 Pages',
                        'CMS Integration',
                        'Blog System',
                        'Multi-language',
                        'Professional Email',
                        '6 Months Support'
                    ]
                },
                consulting: {
                    name: 'Consulting',
                    from: "From",
                    price: '€150/h',
                    description: 'Personalized technical and strategic consulting',
                    features: [
                        "Analisi Tecnica",
                        "Architecture Review",
                        "Performance Audit",
                        "Security Assessment",
                        "Team Training",
                        "Documentazione"
                    ]
                }
            }
        },
        contact: {
            title1: 'Start Your',
            title2: 'Project',
            subtitle: 'Tell us your idea and let\'s transform it into reality together.',
            heading: 'Let\'s talk about your project',
            description: 'We are always excited to learn about new ideas and challenges. Contact us for a free consultation.',
            form: {
                name: 'Name',
                email: 'Email',
                phone: 'Phone',
                service: 'How can we help you?',
                message: 'Message',
                selectService: 'Select a service',
                placeholder: {
                    name: 'Your name',
                    email: 'your@email.com',
                    phone: 'your phone number',
                    message: 'Describe your project...'
                },
                submit: 'Send Message',
                required: 'Please fill in all required fields',
                success: 'Thank you for contacting us! We will respond soon.',
                error: 'Something went wrong. Please try again later.',
                loading: 'Sending...'
            },
            info: {
                email: 'Email',
                phone: 'Phone',
                location: 'Location',
                locationValue: 'Palermo, Italy'
            }
        },
        footer: {
            tagline: 'Transforming ideas into digital realities',
            privacy: 'Privacy Policy',
            terms: 'Terms',
            cookie: 'Cookie',
            rights: 'Almastack. All rights reserved. Made with ❤️ in Italy'
        }
    }
};