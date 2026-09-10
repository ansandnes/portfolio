import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    isLoading = false,
    className = '',
    ...props
}) => {
    const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary text-white hover:bg-emerald-600 focus:ring-emerald-500 shadow-lg shadow-emerald-900/20",
        secondary: "bg-secondary text-white hover:bg-blue-600 focus:ring-blue-500 shadow-lg shadow-blue-900/20",
        outline: "border-2 border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white focus:ring-slate-500",
        ghost: "text-slate-400 hover:text-white hover:bg-slate-800",
    };

    return (
        <button
            className={`${baseStyle} ${variants[variant]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            <div className="flex items-center justify-center gap-2">
                {isLoading && (
                    <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {children}
            </div>
        </button>
    );
};

export default Button;