'use client';

import { useState, useEffect, useCallback } from "react";
import { sendEmail } from "../utils/send-email";
import { toast } from "react-toastify";
import FloatingBlocks from "./FloatingBlocks";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import Script from 'next/script';
import { useAnimateOnScroll } from "../hooks/useAnimateOnScroll";
import 'animate.css';

// Configurazione reCAPTCHA
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const ContactSection = ({ translate }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [recaptchaReady, setRecaptchaReady] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
    });

    const id = translate.nav.contact.toLowerCase().replace(' ', '-');
    
    // Use only fadeIn for Contact Section
    const { ref: titleRef, animateClass: titleAnimation, style: titleStyle } = useAnimateOnScroll('fadeIn', 0);
    const { ref: infoRef, animateClass: infoAnimation, style: infoStyle } = useAnimateOnScroll('fadeIn', 100);
    const { ref: formRef, animateClass: formAnimation, style: formStyle } = useAnimateOnScroll('fadeIn', 200);

    // Inizializza reCAPTCHA quando lo script è caricato
    const handleRecaptchaLoad = useCallback(() => {
        if (!window.grecaptcha) {
            console.error('grecaptcha not loaded');
            return;
        }

        window.grecaptcha.ready(() => {
            console.log('reCAPTCHA is ready');
            setRecaptchaReady(true);
        });
    }, []);

    // Esegui reCAPTCHA e ottieni il token
    const executeRecaptcha = async () => {
        return new Promise((resolve, reject) => {
            // Verifica che reCAPTCHA sia pronto
            if (!window.grecaptcha) {
                reject(new Error('reCAPTCHA not loaded'));
                return;
            }

            // Usa grecaptcha.ready per assicurarsi che sia inizializzato
            window.grecaptcha.ready(async () => {
                try {
                    const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { 
                        action: 'submit_contact_form' 
                    });
                    resolve(token);
                } catch (error) {
                    console.error('reCAPTCHA execution error:', error);
                    reject(error);
                }
            });
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verifica che reCAPTCHA sia pronto
        if (!recaptchaReady) {
            toast.error('Sistema di sicurezza non pronto. Riprova tra qualche secondo.');
            return;
        }

        if (!loading) {
            setLoading(true);
        }

        if (error) {
            setError(false);
        }

        try {
            let recaptchaToken = null;
            
            // Prova ad ottenere il token reCAPTCHA
            try {
                recaptchaToken = await executeRecaptcha();
            } catch (recaptchaError) {
                // Continua comunque ma logga l'errore
                // In produzione potresti voler bloccare l'invio
                toast.warning('Verifica di sicurezza non riuscita, ma procediamo comunque.');
            }
            
            // Invia il form con o senza token
            await sendEmail({
                ...formData,
                recaptchaToken // Potrebbe essere null se reCAPTCHA ha fallito
            });
            
            toast.success(translate.contact.form.success);
            setFormData({ 
                name: '', 
                email: '', 
                phone: '',
                service: '', 
                message: '' 
            });
        } catch (err) {
            setError(err.message || 'An error occurred');
            toast.error(translate.contact.form.error || 'Errore nell\'invio del messaggio');
        } finally {
            setLoading(false);
        }
    };

    // Debug: Log quando il componente monta
    useEffect(() => {
        // Verifica se grecaptcha è già disponibile (può succedere con fast refresh)
        if (window.grecaptcha) {
            handleRecaptchaLoad();
        }
    }, [handleRecaptchaLoad]);

    return (
        <>
            {/* Script reCAPTCHA v3 */}
            {RECAPTCHA_SITE_KEY && (
                <Script
                    src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
                    onLoad={handleRecaptchaLoad}
                    onError={(e) => {
                        console.error('Failed to load reCAPTCHA script:', e);
                        setRecaptchaReady(false);
                    }}
                    strategy="afterInteractive"
                />
            )}

            <section id={id} className="py-20 bg-gradient-to-br from-white-50 via-white to-blue-50 relative">
                <FloatingBlocks position="left" />

                <div className="container mx-auto px-6 max-w-[1480px] m-auto">
                    <div
                        ref={titleRef}
                        style={titleStyle}
                        className={`text-center mb-16 py-12 ${titleAnimation}`}
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                            {translate.contact.title1} <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{translate.contact.title2}</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-10">
                            {translate.contact.subtitle}
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        <div
                            ref={infoRef}
                            style={infoStyle}
                            className={infoAnimation}
                        >
                            <h3 className="text-3xl font-bold mb-6">{translate.contact.heading}</h3>
                            <p className="text-gray-600 text-lg mb-8 leading-8">
                                {translate.contact.description}
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">{translate.contact.info.email}</h4>
                                        <p className="text-gray-600">
                                            <a className="hover:text-purple-500" href="mailto:info@almastack.it">info@almastack.it</a>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">{translate.contact.info.phone}</h4>
                                        <p className="text-gray-600 flex gap-2">
                                            <a href="tel:+393883986292" className="hover:text-purple-500">3883986292</a>
                                            <span>-</span>
                                            <a href="tel:+393342872489" className="hover:text-purple-500">3342872489</a>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">{translate.contact.info.location}</h4>
                                        <p className="text-gray-600">{translate.contact.info.locationValue}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            ref={formRef}
                            style={formStyle}
                            className={`bg-white rounded-2xl shadow-xl p-8 ${formAnimation}`}
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {translate.contact.form.name} *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        required
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder={translate.contact.form.placeholder.name}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {translate.contact.form.email} *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        required
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder={translate.contact.form.placeholder.email}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {translate.contact.form.phone}
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder={translate.contact.form.placeholder.phone}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {translate.contact.form.service} *
                                    </label>
                                    <select
                                        value={formData.service}
                                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                        name="service"
                                        title={translate.contact.form.selectService}
                                    >
                                        <option value="">{translate.contact.form.selectService}</option>
                                        <option value="fullstack">{translate.services.items.fullstack.title}</option>
                                        <option value="landing">{translate.services.items.landing.title}</option>
                                        <option value="ai">{translate.services.items.ai.title}</option>
                                        <option value="ecommerce">{translate.services.items.ecommerce.title}</option>
                                        <option value="consulting">{translate.services.items.consulting.title}</option>
                                        <option value="uiux">{translate.services.items.uiux.title}</option>
                                        <option value="other">{translate.services.items.other.title}</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {translate.contact.form.message} *
                                    </label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        rows={5}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                        placeholder={translate.contact.form.placeholder.message}
                                        required
                                    />
                                </div>

                                {/* reCAPTCHA Notice - Solo se reCAPTCHA è configurato */}
                                {RECAPTCHA_SITE_KEY && (
                                    <div className="text-xs text-gray-500 text-center">
                                        This site is protected by reCAPTCHA and the Google{' '}
                                        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
                                            Privacy Policy
                                        </a>{' '}
                                        and{' '}
                                        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">
                                            Terms of Service
                                        </a>{' '}
                                        apply.
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    aria-label={translate.contact.form.submit}
                                    title={translate.contact.form.submit}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                                >
                                    {
                                        loading ? (
                                            <LoadingSpinner message={translate.contact.form.loading} />
                                        ) : (
                                            <>
                                                {translate.contact.form.submit} <ArrowRight className="w-5 h-5" />
                                            </>
                                        )
                                    }
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ContactSection;