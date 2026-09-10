import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'no' | 'ar';

export const translations = {
    en: {
        brand: "Family Market",
        nav: { home: "Home", shop: "Shop", chef: "Smart Chef", login: "Log in", signup: "Sign up" },
        home: {
            title: "Groceries delivered fresh & fast",
            subtitle: "Experience the smartest way to shop. Use our AI Chef to turn recipes into shopping lists instantly.",
            cta_shop: "Start Shopping",
            cta_chef: "Try AI Chef",
            why_title: "Why Choose Us",
            why_subtitle: "A better way to buy food",
            feat_fresh: "Farm Fresh",
            feat_fresh_desc: "We partner directly with local farmers.",
            feat_safe: "Safe & Secure",
            feat_safe_desc: "Contactless delivery options.",
            feat_fast: "Fast Delivery",
            feat_fast_desc: "Same-day delivery available."
        },
        shop: {
            categories: "Categories",
            add: "Add to Cart",
            nutrition: "Nutrition per",
            calories: "Calories",
            protein: "Protein",
            carbs: "Carbs",
            fat: "Fat",
            close: "Close"
        },
        cart: {
            title: "Shopping Cart",
            empty: "Your cart is empty",
            empty_desc: "Looks like you haven't added anything yet.",
            start: "Start shopping",
            summary: "Order summary",
            subtotal: "Subtotal",
            shipping: "Shipping estimate",
            tax: "Tax estimate",
            total: "Order total",
            checkout: "Checkout",
            login_checkout: "You'll be asked to login to complete checkout.",
            remove: "Remove",
            checkout_title: "Secure Checkout",
            back: "Back to Cart",
            pay: "Pay",
            confirmed: "Order Confirmed!",
            confirmed_msg: "Thank you for shopping with Family Market.",
            continue: "Continue Shopping",
            receipt: "View Receipt",
            address: "Delivery Address",
            payment: "Payment Method"
        },
        chef: {
            title: "Smart Chef Assistant",
            desc: "Not sure what to have for dinner? Hire Andreas and he can use this app to give you suggestions every day!",
            placeholder: "What are you craving today?",
            generate: "Generate",
            instructions: "Instructions",
            ingredients: "Ingredients Needed",
            match_hint: "Click the + icon next to an ingredient to attempt to match it with products in our store."
        },
        auth: {
            signin_title: "Sign in to your account",
            signup_title: "Create your account",
            signin_cta: "Sign in",
            signup_cta: "Sign up",
            no_account: "Or create a new account",
            has_account: "Already have an account?",
            name: "Full Name",
            email: "Email address",
            password: "Password",
            demo: "(Demo: Any email/password works)"
        }
    },
    no: {
        brand: "Familie Marked",
        nav: { home: "Hjem", shop: "Butikk", chef: "Smart Kokk", login: "Logg inn", signup: "Registrer" },
        home: {
            title: "Matvarer levert ferskt & raskt",
            subtitle: "Opplev den smarteste måten å handle på. Bruk vår AI-kokk for å gjøre oppskrifter om til handlelister umiddelbart.",
            cta_shop: "Begynn å handle",
            cta_chef: "Prøv AI-kokk",
            why_title: "Hvorfor velge oss",
            why_subtitle: "En bedre måte å kjøpe mat på",
            feat_fresh: "Gårdsfersk",
            feat_fresh_desc: "Vi samarbeider direkte med lokale bønder.",
            feat_safe: "Trygt & Sikkert",
            feat_safe_desc: "Kontaktløse leveringsalternativer.",
            feat_fast: "Rask Levering",
            feat_fast_desc: "Samme dag levering tilgjengelig."
        },
        shop: {
            categories: "Kategorier",
            add: "Legg i kurv",
            nutrition: "Næringsinnhold per",
            calories: "Kalorier",
            protein: "Protein",
            carbs: "Karbohydrater",
            fat: "Fett",
            close: "Lukk"
        },
        cart: {
            title: "Handlekurv",
            empty: "Handlekurven din er tom",
            empty_desc: "Ser ut som du ikke har lagt til noe ennå.",
            start: "Begynn å handle",
            summary: "Ordresammendrag",
            subtotal: "Delsum",
            shipping: "Frakt",
            tax: "Moms",
            total: "Totalsum",
            checkout: "Til kassen",
            login_checkout: "Du må logge inn for å fullføre kjøpet.",
            remove: "Fjern",
            checkout_title: "Sikker Betaling",
            back: "Tilbake til kurv",
            pay: "Betal",
            confirmed: "Ordre Bekreftet!",
            confirmed_msg: "Takk for at du handler hos Familie Marked.",
            continue: "Fortsett å handle",
            receipt: "Se kvittering",
            address: "Leveringsadresse",
            payment: "Betalingsmetode"
        },
        chef: {
            title: "Smart Kokkeassistent",
            desc: "Usikker på hva du skal lage? Fortell oss hva du vil ha, så lager vi oppskriften og hjelper deg med handlekurven.",
            placeholder: "Hva har du lyst på i dag?",
            generate: "Generer",
            instructions: "Instruksjoner",
            ingredients: "Ingredienser",
            match_hint: "Klikk på + ikonet ved siden av en ingrediens for å finne den i butikken."
        },
        auth: {
            signin_title: "Logg inn på din konto",
            signup_title: "Opprett din konto",
            signin_cta: "Logg inn",
            signup_cta: "Registrer deg",
            no_account: "Eller opprett en ny konto",
            has_account: "Har du allerede en konto?",
            name: "Fullt Navn",
            email: "E-postadresse",
            password: "Passord",
            demo: "(Demo: Enhver e-post/passord fungerer)"
        }
    },
    ar: {
        brand: "سوق العائلة",
        nav: { home: "الرئيسية", shop: "التسوق", chef: "الشيف الذكي", login: "تسجيل الدخول", signup: "اشتراك" },
        home: {
            title: "توصيل البقالة طازجة وسريعة",
            subtitle: "جرب أذكى طريقة للتسوق. استخدم الشيف الذكي لتحويل الوصفات إلى قوائم تسوق على الفور.",
            cta_shop: "ابدأ التسوق",
            cta_chef: "جرب الشيف الذكي",
            why_title: "لماذا تختارنا",
            why_subtitle: "طريقة أفضل لشراء الطعام",
            feat_fresh: "طازج من المزرعة",
            feat_fresh_desc: "نتعاون مباشرة مع المزارعين المحليين.",
            feat_safe: "آمن ومضمون",
            feat_safe_desc: "خيارات توصيل بدون تلامس.",
            feat_fast: "توصيل سريع",
            feat_fast_desc: "التوصيل في نفس اليوم متاح."
        },
        shop: {
            categories: "الفئات",
            add: "أضف إلى السلة",
            nutrition: "التغذية لكل",
            calories: "سعرات حرارية",
            protein: "بروتين",
            carbs: "كربوهيدرات",
            fat: "دهون",
            close: "إغلاق"
        },
        cart: {
            title: "سلة التسوق",
            empty: "سلتك فارغة",
            empty_desc: "يبدو أنك لم تضف أي شيء بعد.",
            start: "ابدأ التسوق",
            summary: "ملخص الطلب",
            subtotal: "المجموع الفرعي",
            shipping: "تقدير الشحن",
            tax: "تقدير الضريبة",
            total: "الإجمالي",
            checkout: "الدفع",
            login_checkout: "سيُطلب منك تسجيل الدخول لإكمال الدفع.",
            remove: "إزالة",
            checkout_title: "دفع آمن",
            back: "العودة للسلة",
            pay: "دفع",
            confirmed: "تم تأكيد الطلب!",
            confirmed_msg: "شكراً لتسوقك مع سوق العائلة.",
            continue: "متابعة التسوق",
            receipt: "عرض الإيصال",
            address: "عنوان التوصيل",
            payment: "طريقة الدفع"
        },
        chef: {
            title: "مساعد الشيف الذكي",
            desc: "لست متأكداً ماذا تطبخ؟ أخبرنا ماذا تريد، وسنقوم بإنشاء الوصفة ومساعدتك في ملء سلتك.",
            placeholder: "ماذا تشتهي اليوم؟",
            generate: "توليد",
            instructions: "التعليمات",
            ingredients: "المكونات المطلوبة",
            match_hint: "انقر فوق رمز + بجوار المكون لمحاولة مطابقته مع المنتجات في متجرنا."
        },
        auth: {
            signin_title: "تسجيل الدخول إلى حسابك",
            signup_title: "إنشاء حسابك",
            signin_cta: "تسجيل الدخول",
            signup_cta: "اشتراك",
            no_account: "أو أنشئ حساباً جديداً",
            has_account: "هل لديك حساب بالفعل؟",
            name: "الاسم الكامل",
            email: "عنوان البريد الإلكتروني",
            password: "كلمة المرور",
            demo: "(تجريبي: أي بريد إلكتروني/كلمة مرور تعمل)"
        }
    }
};

const LanguageContext = createContext<any>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize with browser language if supported
    const getInitialLanguage = (): Language => {
        if (typeof window !== 'undefined') {
            const browserLang = navigator.language || navigator.language;
            if (browserLang.startsWith('no')) return 'no';
            if (browserLang.startsWith('ar')) return 'ar';
        }
        return 'en';
    };

    const [language, setLanguage] = useState<Language>(getInitialLanguage());

    // Update HTML lang & dir attributes
    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    const t = (path: string) => {
        const keys = path.split('.');
        let current: any = translations[language];
        for (const key of keys) {
            if (current[key] === undefined) return path;
            current = current[key];
        }
        return current;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};

// const LanguageContext = createContext<any>(undefined);

// export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const [language, setLanguage] = useState<Language>('en');

//     useEffect(() => {
//         document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
//         document.documentElement.lang = language;
//     }, [language]);

//     const t = (path: string) => {
//         const keys = path.split('.');
//         let current: any = translations[language];
//         for (const key of keys) {
//             if (current[key] === undefined) return path;
//             current = current[key];
//         }
//         return current;
//     };

//     return (
//         <LanguageContext.Provider value={{ language, setLanguage, t }}>
//             {children}
//         </LanguageContext.Provider>
//     );
// };

// export const useLanguage = () => {
//     const context = useContext(LanguageContext);
//     if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
//     return context;
// };
