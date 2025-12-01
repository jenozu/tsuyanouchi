import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-none font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center tracking-wide";
  
  const variants = {
    // Soft Black / Warm Charcoal background
    primary: "bg-[#2D2A26] text-[#F9F8F4] hover:bg-[#4A4036] border border-transparent",
    // Warm light gray/beige
    secondary: "bg-[#E5E0D8] text-[#2D2A26] hover:bg-[#D4CEC5] border border-transparent",
    // Outline with dark charcoal
    outline: "bg-transparent text-[#2D2A26] border border-[#2D2A26] hover:bg-[#2D2A26] hover:text-[#F9F8F4]",
    danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
        </span>
      ) : children}
    </button>
  );
};