import { useState } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Quote, Star } from 'lucide-react';
import FloatingBlocks from './FloatingBlocks';

// Founders Section Component
const FoundersSection = ({ translate }) => {
    const id = translate.nav.founders.toLowerCase().replace(' ', '-');
    const [hoveredFounder, setHoveredFounder] = useState(null);

    translate = translate?.founders;

    return (
        <section id={id} className="py-24 bg-white relative overflow-hidden">
            <FloatingBlocks position="right" />

            <div className="container mx-auto px-6 max-w-[1480px] m-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 py-12"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                        {translate.title1} <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{translate.title2}</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-10">
                        {translate.subtitle}
                    </p>
                </motion.div>

                {/* Founders Cards - Horizontal Layout */}
                <div className="grid lg:grid-cols-2 gap-8 mb-16">
                    {translate?.founders?.map((founder, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            onHoverStart={() => setHoveredFounder(index)}
                            onHoverEnd={() => setHoveredFounder(null)}
                            className="group"
                        >
                            <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-2xl p-8 shadow-xl transition-all duration-300">
                                <div className="flex gap-6">
                                    {/* Photo Column - Smaller */}
                                    <div className="flex-shrink-0">
                                        <motion.div
                                            className="relative"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="w-32 h-32 lg:w-36 lg:h-36 rounded-2xl overflow-hidden shadow-lg">
                                                <img
                                                    src={founder.image}
                                                    alt={founder.name}
                                                    width={144}
                                                    height={144}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Decorative Badge */}
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: hoveredFounder === index ? 1 : 0 }}
                                                className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center shadow-lg"
                                            >
                                                <Star className="w-5 h-5 text-white" />
                                            </motion.div>
                                        </motion.div>

                                        {/* LinkedIn Button Below Photo */}
                                        <motion.a
                                            href={founder.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-gradient-to-r hover:from-[#667eea] hover:to-[#764ba2] hover:text-white transition-all duration-300 group/link"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Linkedin className="w-4 h-4" />
                                            <span className="text-sm font-medium">LinkedIn</span>
                                        </motion.a>
                                    </div>

                                    {/* Content Column */}
                                    <div className="flex-1">
                                        <div className="mb-4">
                                            <h3 className="text-2xl lg:text-3xl font-bold mb-1">
                                                {founder.name}
                                            </h3>
                                            <p className="text-lg bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent font-medium">{founder.role}</p>
                                        </div>

                                        <p className="text-gray-600 mb-6 text-base lg:text-lg leading-relaxed">
                                            {founder.bio}
                                        </p>

                                        {/* Stats */}
                                        <div className="flex gap-6 mb-6">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                                                    {founder.stats.experience}
                                                </div>
                                                <div className="text-xs text-gray-500">{translate.experience}</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                                                    {founder.stats.projects}
                                                </div>
                                                <div className="text-xs text-gray-500">{translate.projects}</div>
                                            </div>
                                        </div>

                                        {/* Specialties */}
                                        {/* <div className="flex flex-wrap gap-2 mt-8">
                                            {founder.specialties.map((specialty, i) => (
                                                <motion.span
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: 0.3 + i * 0.1 }}
                                                    className="px-3 py-1.5 bg-white text-purple-700 rounded-full text-sm font-medium border border-purple-200/50 shadow-sm"
                                                >
                                                    {specialty}
                                                </motion.span>
                                            ))}
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mission Statement */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-2xl p-8 lg:p-10 lg:py-18 text-white relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
                        </div>

                        <div className="relative z-10 max-w-4xl mx-auto text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", duration: 0.6 }}
                                className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-4"
                            >
                                <Quote className="w-6 h-6 text-white" />
                            </motion.div>

                            <h3 className="text-2xl lg:text-3xl font-bold mb-3">{translate.mission}</h3>
                            <p className="text-lg lg:text-xl text-white/90 leading-relaxed">
                                {translate.missionText}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FoundersSection;