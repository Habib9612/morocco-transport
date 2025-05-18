import { useEffect, useRef } from 'react';

interface ErrorMessageProps {
  message: string | null;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message && ref.current) {
      ref.current.focus();
    }
  }, [message]);

  if (!message) return null;

  return (
    <div
      ref={ref}
      role="alert"
      aria-live="polite"
      tabIndex={-1}
      className="p-4 mb-4 text-red-700 bg-red-100 rounded-md"
    >
      {message}
    </div>
  );
} 