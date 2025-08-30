'use client';

import { useState } from "react";
import { sendEmail } from "../utils/send-email";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import FloatingBlocks from "./FloatingBlocks";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

const ContactSection = ({ translate }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
    });

    const id = translate.nav.contact.toLowerCase().replace(' ', '-');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loading) {
            setLoading(true);
        }

        if (error) {
            setError(false);
        }

        try {
            await sendEmail(formData);
            toast.success(translate.contact.form.success);
            setFormData({ name: '', email: '', service: '', message: '' });
        } catch (err) {
            console.log(err);
            setError(err.message || 'An error occurred');
            toast.error(translate.contact.form.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id={id} className="py-20 bg-gradient-to-br from-white-50 via-white to-blue-50 relative">
            <FloatingBlocks position="right" />

            <div className="container mx-auto px-6 max-w-[1480px] m-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 py-12"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                        {translate.contact.title1} <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{translate.contact.title2}</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-10">
                        {translate.contact.subtitle}
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
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
                                        <a className="hover:text-purple-500" href="mailto:info.almastack@gmail.com">info.almastack@gmail.com</a>
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
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl shadow-xl p-8"
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

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
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
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;