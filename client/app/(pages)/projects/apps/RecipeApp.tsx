import React, { useState } from 'react';
import { RecipeResponse } from '@/app/types';
import { ChefHat, Loader2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/app/utils/context/language/LanguageContext';

const ChefAssistant: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<RecipeResponse | null>(null);
    const [error, setError] = useState('');
    const { t } = useLanguage();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await fetch('/api/ai/gemini/generateText', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    type: "recipe"
                }),
            });

            const json = await res.json();

            if (json.error) {
                throw new Error(json.error);
            }

            setResult(json.data);

        } catch (err) {
            setError('Failed to generate recipe. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
                    <ChefHat size={32} />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{t('chef.title')}</h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    {t('chef.desc')}
                </p>
            </div>

            <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-8">
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="relative">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={t('chef.placeholder')}
                            className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 text-lg text-gray-700 focus:outline-none focus:border-green-500 pr-32 rtl:pr-6 rtl:pl-32 transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={loading || !prompt}
                            className="absolute right-2 rtl:left-2 rtl:right-auto top-2 bottom-2 bg-green-600 text-white px-6 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>{t('chef.generate')} <ArrowRight size={18} className="rtl:rotate-180" /></>}
                        </button>
                    </form>
                    {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
                </div>
            </div>

            {result && (
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-fade-in-up">
                    <div className="bg-green-50 px-8 py-6 border-b border-green-100">
                        <h2 className="text-2xl font-bold text-gray-900">{result.recipeName}</h2>
                    </div>
                    <div className="p-8">
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('chef.instructions')}</h3>
                            <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">{result.instructions}</p>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('chef.ingredients')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {result.ingredients.map((ingredient, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors group">
                                    <span className="text-gray-700">{ingredient}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChefAssistant;