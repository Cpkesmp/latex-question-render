import React, { useEffect, useRef, useState } from 'react';

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
  const [mathJaxLoaded, setMathJaxLoaded] = useState(false);

  useEffect(() => {
    // Check if MathJax is already loaded
    if (window.MathJax) {
      setMathJaxLoaded(true);
      return;
    }

    // Configure MathJax before loading the script
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true,
        packages: ['base', 'ams', 'newcommand', 'configmacros']
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
        ignoreHtmlClass: 'tex2jax_ignore',
        processHtmlClass: 'tex2jax_process'
      },
      startup: {
        typeset: false,
        ready: () => {
          window.MathJax.startup.defaultReady();
          setMathJaxLoaded(true);
        }
      }
    };

    // Load MathJax script
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=es6';
    script.async = true;
    document.head.appendChild(script);

    const mathJaxScript = document.createElement('script');
    mathJaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    mathJaxScript.async = true;
    mathJaxScript.id = 'MathJax-script';
    document.head.appendChild(mathJaxScript);

    return () => {
      // Cleanup on unmount
      const polyfillScript = document.querySelector('script[src*="polyfill.io"]');
      const mathjaxScript = document.getElementById('MathJax-script');
      if (polyfillScript) document.head.removeChild(polyfillScript);
      if (mathjaxScript) document.head.removeChild(mathjaxScript);
    };
  }, []);

  return <div className={mathJaxLoaded ? 'mathjax-loaded' : 'mathjax-loading'}>{children}</div>;
};

interface MathTextProps {
  text: string;
  className?: string;
}

export const MathText: React.FC<MathTextProps> = ({ text, className = "" }) => {
  const mathRef = useRef<HTMLDivElement>(null);
  const [processedText, setProcessedText] = useState('');

  useEffect(() => {
    // Process the text to handle LaTeX newlines and formatting
    let processed = text
      .replace(/\$\\\\\$/g, '<br/>')
      .replace(/\$\\newline\$/g, '<br/>')
      .replace(/\\newline/g, '<br/>')
      .replace(/\\\\/g, '\\\\') // Keep double backslashes for LaTeX
      .replace(/\n/g, '<br/>'); // Handle actual newlines

    setProcessedText(processed);
  }, [text]);

  useEffect(() => {
    if (mathRef.current && window.MathJax && processedText) {
      // Clear the element first
      mathRef.current.innerHTML = processedText;
      
      // Typeset the math
      if (window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([mathRef.current]).catch((err: any) => {
          console.warn('MathJax typeset error:', err);
        });
      } else if (window.MathJax.Hub) {
        // Fallback for MathJax v2
        window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, mathRef.current]);
      }
    }
  }, [processedText]);

  return (
    <div 
      ref={mathRef}
      className={`${className} tex2jax_process`}
      style={{ lineHeight: '1.6' }}
    >
      {!window.MathJax && (
        <div dangerouslySetInnerHTML={{ __html: processedText }} />
      )}
    </div>
  );
};