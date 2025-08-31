'use client';

import { Check } from "lucide-react";
import FloatingBlocks from "./FloatingBlocks";
import { ArrowDownRight } from "./ArrowRightIcon";
import { useAnimateOnScroll } from "../hooks/useAnimateOnScroll";
import 'animate.css';

// Separate component for animated pricing card
const PricingCard = ({ plan, index, translate, setUrlHash }) => {
    const { ref, animateClass, style } = useAnimateOnScroll('fadeInUp', index * 100);
    
    return (
        <div
            ref={ref}
            style={style}
            className={`relative rounded-2xl p-8 ${animateClass} ${plan.popular
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
            <div className="text-4xl font-bold mb-4 flex gap-2 relative">
                <span className="absolute top-2 left-1">
                    <ArrowDownRight size={18} className="text-gray-300" />
                </span>
                <sup className="text-sm">{plan.from}</sup> {plan.price}
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

            <button
                onClick={() => setUrlHash(translate.nav.contact.toLowerCase().replace(' ', '-'))}
                className={`w-full py-3 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 ${plan.popular
                    ? 'bg-white text-blue-600 hover:bg-gray-100'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                    }`}
            >
                {translate.pricing.startNow}
            </button>
        </div>
    );
};

const PricingSection = ({ translate }) => {
    const id = translate.nav.pricing.toLowerCase().replace(' ', '-');
    
    const { ref: titleRef, animateClass: titleAnimation, style: titleStyle } = useAnimateOnScroll('fadeInUp', 0);
    const { ref: enterpriseRef, animateClass: enterpriseAnimation, style: enterpriseStyle } = useAnimateOnScroll('fadeIn', 100);

    const setUrlHash = (hash) => {
        window.location.hash = hash;
    };

    const plans = [
        {
            name: translate.pricing.plans.landing.name,
            from: translate.pricing.plans.landing.from,
            price: translate.pricing.plans.landing.price,
            description: translate.pricing.plans.landing.description,
            features: translate.pricing.plans.landing.features,
            popular: false
        },
        {
            name: translate.pricing.plans.website.name,
            from: translate.pricing.plans.website.from,
            price: translate.pricing.plans.website.price,
            description: translate.pricing.plans.website.description,
            features: translate.pricing.plans.website.features,
            popular: true
        },
        {
            name: translate.pricing.plans.consulting.name,
            from: translate.pricing.plans.consulting.from,
            price: translate.pricing.plans.consulting.price,
            description: translate.pricing.plans.consulting.description,
            features: translate.pricing.plans.consulting.features,
            popular: false
        }
    ];

    return (
        <section id={id} className="py-20 bg-white relative">
            <FloatingBlocks position="left" />

            <div className="container mx-auto px-6 max-w-[1480px] m-auto">
                <div
                    ref={titleRef}
                    style={titleStyle}
                    className={`text-center mb-16 py-12 ${titleAnimation}`}
                >
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                        {translate.pricing.title1} <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{translate.pricing.title2}</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-10">
                        {translate.pricing.subtitle}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <PricingCard 
                            key={index}
                            plan={plan}
                            index={index}
                            translate={translate}
                            setUrlHash={setUrlHash}
                        />
                    ))}
                </div>

                <div
                    ref={enterpriseRef}
                    style={enterpriseStyle}
                    className={`mt-28 py-18 text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl ${enterpriseAnimation}`}
                >
                    <h3 className="text-3xl font-bold mb-4">{translate.pricing.enterprise.title}</h3>
                    <p className="text-gray-600 mb-8 text-lg">
                        {translate.pricing.enterprise.subtitle}
                    </p>
                    <a
                        href={`#${translate.nav.contact.toLowerCase().replace(' ', '-')}`}
                        className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                    >
                        {translate.pricing.requestQuote}
                    </a>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;