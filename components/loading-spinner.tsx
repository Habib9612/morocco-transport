interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'white' | 'blue' | 'red';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6'
};

const colorClasses = {
  white: 'text-white',
  blue: 'text-blue-600',
  red: 'text-red-600'
};

export function LoadingSpinner({ 
  label = 'Loading', 
  size = 'md',
  color = 'white',
  className = ''
}: LoadingSpinnerProps) {
  return (
    <span 
      role="status" 
      aria-label={label} 
      className={`inline-flex items-center ${className}`}
    >
      <svg
        className={`animate-spin -ml-1 mr-3 ${sizeClasses[size]} ${colorClasses[color]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {label}
    </span>
  );
} 