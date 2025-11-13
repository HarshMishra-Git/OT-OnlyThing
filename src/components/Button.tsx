import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyles = 'relative px-8 py-3 font-bold text-sm tracking-wide uppercase transition-all duration-400 ease-luxury disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group';

  const variants = {
    primary: 'bg-black text-white hover:bg-gray-900 border-2 border-black transform hover:scale-105',
    secondary: 'bg-white text-black border-2 border-black hover:bg-black hover:text-white transform hover:scale-105',
    ghost: 'bg-transparent text-black border-2 border-transparent hover:border-black transform hover:scale-105'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      
      {/* Animated background for secondary variant */}
      {variant === 'secondary' && (
        <span className="absolute inset-0 bg-black scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-400 ease-luxury"></span>
      )}
      
      {/* Shimmer effect on hover */}
      <span className="absolute inset-0 bg-shimmer opacity-0 group-hover:opacity-100 group-hover:animate-shimmer"></span>
    </button>
  );
}
