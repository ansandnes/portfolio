import React from "react";
import GoogleTranslate from "./GoogleTranslate";

const Footer: React.FC = () => {
    return (

        <div className="max-w-6xl justify-around px-6 md:px-8 py-6 flex items-center text-sm text-slate-400">
            <div> Built with Next.js/React & Tailwind</div>
            {/* Google Translate */}
            <div className="mt-12 mb-8 flex justify-end">
                <GoogleTranslate />
            </div>
        </div>

    );
};

export default Footer;