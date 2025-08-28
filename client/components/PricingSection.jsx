'use client';

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import FloatingBlocks from "./FloatingBlocks";

const PricingSection = ({ translate }) => {
    const id = translate.nav.pricing.toLowerCase().replace(' ', '-');

    const setUrlHash = (hash) => {
        window.location.hash = hash;
    };

    const plans = [
        {
            name: translate.pricing.plans.landing.name,
            price: translate.pricing.plans.landing.price,
            description: translate.pricing.plans.landing.description,
            features: translate.pricing.plans.landing.features,
            popular: false
        },
        {
            name: translate.pricing.plans.website.name,
            price: translate.pricing.plans.website.price,
            description: translate.pricing.plans.website.description,
            features: translate.pricing.plans.website.features,
            popular: true
        },
        {
            name: translate.pricing.plans.consulting.name,
            price: translate.pricing.plans.consulting.price,
            description: translate.pricing.plans.consulting.description,
            features: translate.pricing.plans.consulting.features,
            popular: false
        }
    ];

    return (
        <section id={id} className="py-20 bg-white relative">
            <FloatingBlocks position="right" />

            <div className="container mx-auto px-6 max-w-[1480px] m-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 py-12"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                        {translate.pricing.title1} <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{translate.pricing.title2}</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-10">
                        {translate.pricing.subtitle}
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
                                ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl scale-105'
                                : 'bg-gray-50 shadow-xl'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
                                        {translate.pricing.popular}
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
                                onClick={() => setUrlHash(translate.nav.contact.toLowerCase().replace(' ', '-'))}
                                className={`w-full py-3 rounded-full font-semibold transition-all ${plan.popular
                                    ? 'bg-white text-blue-600 hover:bg-gray-100'
                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                                    }`}
                            >
                                {translate.pricing.startNow}
                            </motion.button>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-28 py-18 text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl"
                >
                    <h3 className="text-2xl font-bold mb-4">{translate.pricing.enterprise.title}</h3>
                    <p className="text-gray-600 mb-6">
                        {translate.pricing.enterprise.subtitle}
                    </p>
                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={`#${translate.nav.contact.toLowerCase().replace(' ', '-')}`}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
                    >
                        {translate.pricing.requestQuote}
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
};

export default PricingSection;