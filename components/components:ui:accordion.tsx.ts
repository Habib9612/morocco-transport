import React, { useState } from 'react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="accordion-item border rounded mb-2">
      <h2 className="accordion-header">
        <button
          className={`accordion-button ${!isOpen ? 'collapsed' : ''}`}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          {title}
        </button>
      </h2>
      <div className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}>
        <div className="accordion-body">{children}</div>
      </div>
    </div>
  );
};

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ children, className = '' }) => {
  return (
    <div className={`accordion ${className}`}>
      {children}
    </div>
  );
};

export default Accordion;