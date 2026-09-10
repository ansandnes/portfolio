import React from 'react';
import { Quote, Building2, User } from 'lucide-react';
import testimonials from "@/app/assets/testimonials/Testimonials";
import GoogleTranslate from '@/app/components/GoogleTranslate';


const Testimonials: React.FC = () => {

    return (
        <div className="pt-24 pb-20 max-w-7xl mx-auto px-6 animate-slide-up">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    What People <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">Say</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-3xl mx-auto">
                    Feedback from colleagues, managers, and clients I've had the pleasure of working with.
                </p>
            </div>

            {/* Vertical stacked layout */}
            <div className="flex flex-col gap-12">
                {testimonials.map((testimonial, index) => (
                    <div
                        key={testimonial.id}
                        className="group relative bg-surface/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-900/10 hover:-translate-y-1"
                    >
                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center text-emerald-500 shadow-xl group-hover:scale-110 transition-transform">
                            <Quote size={20} fill="currentColor" />
                        </div>

                        <div className="relative z-10">
                            <blockquote className="whitespace-pre-line text-slate-300 leading-relaxed mb-8 text-lg font-light italic">
                                "{testimonial.content}"
                            </blockquote>

                            <div className="flex items-center gap-4 pt-6 border-t border-slate-700/50">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white ring-4 ring-slate-800">
                                    <User size={20} />
                                </div>
                                <div>
                                    <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                                        {testimonial.name}
                                    </div>
                                    <div className="text-sm text-slate-400 flex items-center gap-1.5">
                                        <Building2 size={12} />
                                        {testimonial.role} at <span className="font-medium text-slate-300">{testimonial.company}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2">
                                {testimonial.traits.map(tag => (
                                    <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-md bg-emerald-500/5 text-emerald-400 border border-emerald-500/10">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2">
                                {testimonial.tech.map(tag => (
                                    <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-md bg-emerald-500/5 text-emerald-400 border border-emerald-500/10">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2">
                                {testimonial.impact.map(tag => (
                                    <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-md bg-emerald-500/5 text-emerald-400 border border-emerald-500/10">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className={`absolute inset-0 bg-gradient-to-br ${index % 2 === 0 ? 'from-emerald-500/5' : 'from-indigo-500/5'} to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Testimonials;
