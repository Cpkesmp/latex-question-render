import React, { useEffect, useRef } from 'react';

interface MathRendererProps {
  children: React.ReactNode;
}

// Declare MathJax global type
declare global {
  interface Window {
    MathJax: any;
  }
}

export const MathJaxProvider: React.FC<MathRendererProps> = ({ children }) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    
    // Load MathJax script
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML';
    script.async = true;
    
    script.onload = () => {
      window.MathJax.Hub.Config({
        tex2jax: {
          inlineMath: [['$', '$'], ['\\(', '\\)']],
          displayMath: [['$$', '$$'], ['\\[', '\\]']],
          processEscapes: true,
          processEnvironments: true,
          skipTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
        },
        TeX: {
          extensions: ['AMSmath.js', 'AMSsymbols.js', 'autoload-all.js'],
          equationNumbers: { autoNumber: 'AMS' },
        },
        showProcessingMessages: false,
        messageStyle: 'none',
        displayAlign: 'left',
        displayIndent: '0em',
        showMathMenu: false,
      });
      
      window.MathJax.Hub.Startup.onload();
    };
    
    document.head.appendChild(script);
    initialized.current = true;

    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector(`script[src="${script.src}"]`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return <div>{children}</div>;
};

interface MathTextProps {
  text: string;
  className?: string;
}

export const MathText: React.FC<MathTextProps> = ({ text, className = "" }) => {
  const mathRef = useRef<HTMLDivElement>(null);

  // Process the text to handle LaTeX newlines and formatting
  const processedText = text
    .replace(/\$\\\\\$/g, '<br/>')
    .replace(/\$\\newline\$/g, '<br/>')
    .replace(/\\newline/g, '<br/>')
    .replace(/\\\\/g, '<br/>');

  useEffect(() => {
    if (mathRef.current && window.MathJax && window.MathJax.Hub) {
      // Queue the typesetting for this specific element
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, mathRef.current]);
    }
  }, [processedText]);

  return (
    <div 
      ref={mathRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: processedText }}
    />
  );
};