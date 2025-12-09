"use client";

import { useEffect } from "react";
import "@/app/assets/css/googleTranslate.css";

export default function GoogleTranslate() {
    useEffect(() => {
        // Only initialize once
        if ((window as any).googleTranslateElementInitDone) return;

        (window as any).googleTranslateElementInitDone = true;

        // Function to initialize the widget
        (window as any).googleTranslateElementInit = () => {
            new (window as any).google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    layout: (window as any).google.translate.TranslateElement.InlineLayout.HORIZONTAL,
                },
                "google_translate_element"
            );
        };

        // Load the Google Translate script
        const script = document.createElement("script");
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);

        // Cleanup on unmount
        return () => {
            document.body.removeChild(script);
            delete (window as any).googleTranslateElementInit;
        };
    }, []);

    return (
        <div className="google-translate-container">
            <div id="google_translate_element"></div>
        </div>
    );
}
