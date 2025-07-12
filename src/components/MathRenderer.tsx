import React, { useEffect, useRef, useState, useCallback } from 'react';

interface MathRendererProps {
  children: React.ReactNode;
}

// Declare MathJax global type
declare global {
  interface Window {
    MathJax: any;
  }
}

// Advanced LaTeX preprocessing utilities
class LaTeXProcessor {
  static preprocessText(text: string): string {
    return text
      // Handle various newline formats
      .replace(/\$\\\\\$/g, '\\\\')
      .replace(/\$\\newline\$/g, '\\\\')
      .replace(/\\newline/g, '\\\\')
      
      // Fix common LaTeX spacing issues
      .replace(/\\\s+/g, '\\\\')
      .replace(/\s*\\\\\s*/g, '\\\\')
      
      // Handle textnormal correctly
      .replace(/\\textnormal\s*\{([^}]*)\}/g, '\\text{$1}')
      .replace(/\\textnormal\s+([^\s\\]+)/g, '\\text{$1}')
      
      // Handle array environments
      .replace(/(\s*)&(\s*)/g, ' & ')
      .replace(/\\\\\s*\\\\/g, '\\\\')
      
      // Handle ldots
      .replace(/\\ldots/g, '\\cdots')
      
      // Clean up extra spaces
      .replace(/\s+/g, ' ')
      .trim();
  }

  static detectMathMode(text: string): 'inline' | 'display' | 'auto' {
    // Display math indicators
    const displayIndicators = [
      '\\begin{array}', '\\begin{matrix}', '\\begin{align}',
      '\\begin{equation}', '\\begin{gather}', '\\frac{',
      '\\sum', '\\int', '\\prod', '\\lim'
    ];
    
    // Check if should be display math
    if (displayIndicators.some(indicator => text.includes(indicator))) {
      return 'display';
    }
    
    // Check if already wrapped
    if ((text.startsWith('$$') && text.endsWith('$$')) || 
        (text.startsWith('$') && text.endsWith('$'))) {
      return 'auto';
    }
    
    return 'inline';
  }

  static wrapMath(text: string, mode: 'inline' | 'display' | 'auto' = 'auto'): string {
    const processed = this.preprocessText(text);
    
    if (mode === 'auto') {
      mode = this.detectMathMode(processed);
    }
    
    // If already wrapped, return as is
    if ((processed.startsWith('$$') && processed.endsWith('$$')) || 
        (processed.startsWith('$') && processed.endsWith('$'))) {
      return processed;
    }
    
    return mode === 'display' ? `$$${processed}$$` : `$${processed}$`;
  }
}

export const MathJaxProvider: React.FC<MathRendererProps> = ({ children }) => {
  const [mathJaxLoaded, setMathJaxLoaded] = useState(false);
  const [mathJaxReady, setMathJaxReady] = useState(false);

  useEffect(() => {
    // Check if MathJax is already loaded
    if (window.MathJax && window.MathJax.startup) {
      setMathJaxLoaded(true);
      setMathJaxReady(true);
      return;
    }

    // Advanced MathJax configuration
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true,
        packages: {
          '[+]': ['base', 'ams', 'newcommand', 'configmacros', 'action', 'require', 
                  'autoload', 'mathtools', 'textmacros', 'noundefined']
        },
        // Custom macros for better LaTeX support
        macros: {
          textnormal: ['\\text{#1}', 1],
          textrm: ['\\mathrm{#1}', 1],
          textbf: ['\\mathbf{#1}', 1],
          textit: ['\\mathit{#1}', 1],
          newline: '\\\\',
          R: '\\mathbb{R}',
          Q: '\\mathbb{Q}',
          Z: '\\mathbb{Z}',
          N: '\\mathbb{N}',
          C: '\\mathbb{C}',
          implies: '\\Rightarrow',
          iff: '\\Leftrightarrow',
          ldots: '\\cdots'
        },
        // Enable advanced features
        tags: 'ams',
        maxMacros: 10000,
        maxBuffer: 5 * 1024
      },
      chtml: {
        scale: 1,
        minScale: 0.5,
        matchFontHeight: false,
        displayAlign: 'left',
        displayIndent: '0em'
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
        ignoreHtmlClass: 'tex2jax_ignore',
        processHtmlClass: 'tex2jax_process',
        renderActions: {
          addMenu: [0, '', '']
        }
      },
      startup: {
        typeset: false,
        ready: () => {
          window.MathJax.startup.defaultReady();
          setMathJaxLoaded(true);
          setMathJaxReady(true);
        }
      }
    };

    // Load polyfill for older browsers
    const polyfillScript = document.createElement('script');
    polyfillScript.src = 'https://polyfill.io/v3/polyfill.min.js?features=es6';
    polyfillScript.async = true;
    document.head.appendChild(polyfillScript);

    // Load MathJax v3
    const mathJaxScript = document.createElement('script');
    mathJaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml-full.js';
    mathJaxScript.async = true;
    mathJaxScript.id = 'MathJax-script';
    document.head.appendChild(mathJaxScript);

    return () => {
      // Cleanup on unmount
      const polyfillScript = document.querySelector('script[src*="polyfill.io"]');
      const mathjaxScript = document.getElementById('MathJax-script');
      if (polyfillScript && polyfillScript.parentNode) {
        polyfillScript.parentNode.removeChild(polyfillScript);
      }
      if (mathjaxScript && mathjaxScript.parentNode) {
        mathjaxScript.parentNode.removeChild(mathjaxScript);
      }
    };
  }, []);

  return (
    <div className={`mathjax-container ${mathJaxReady ? 'ready' : 'loading'}`}>
      {children}
    </div>
  );
};

interface MathTextProps {
  text: string;
  className?: string;
  mode?: 'inline' | 'display' | 'auto';
  enableAdvancedProcessing?: boolean;
}

export const MathText: React.FC<MathTextProps> = ({ 
  text, 
  className = "", 
  mode = 'auto',
  enableAdvancedProcessing = true 
}) => {
  const mathRef = useRef<HTMLDivElement>(null);
  const [processedText, setProcessedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const processText = useCallback((inputText: string) => {
    if (enableAdvancedProcessing) {
      return LaTeXProcessor.wrapMath(inputText, mode);
    } else {
      // Simple processing fallback
      return inputText.includes('$') ? inputText : `$${inputText}$`;
    }
  }, [mode, enableAdvancedProcessing]);

  useEffect(() => {
    const processed = processText(text);
    setProcessedText(processed);
  }, [text, processText]);

  useEffect(() => {
    if (mathRef.current && window.MathJax && processedText && !isProcessing) {
      setIsProcessing(true);
      
      // Clear previous content
      mathRef.current.textContent = processedText;
      
      // Advanced typesetting with error handling
      const typesetPromise = window.MathJax.typesetPromise 
        ? window.MathJax.typesetPromise([mathRef.current])
        : Promise.resolve();

      typesetPromise
        .then(() => {
          setIsProcessing(false);
        })
        .catch((err: any) => {
          console.warn('MathJax typeset error:', err);
          setIsProcessing(false);
          
          // Enhanced fallback with better formatting
          if (mathRef.current) {
            const fallbackHTML = processedText
              .replace(/\$\$([^$]+)\$\$/g, '<div class="math-display">$1</div>')
              .replace(/\$([^$]+)\$/g, '<span class="math-inline">$1</span>')
              .replace(/\\\\/g, '<br/>')
              .replace(/\\text\{([^}]+)\}/g, '<span class="text-normal">$1</span>');
            
            mathRef.current.innerHTML = fallbackHTML;
          }
        });
    }
  }, [processedText, isProcessing]);

  return (
    <div 
      ref={mathRef}
      className={`math-content ${className} ${isProcessing ? 'processing' : ''}`}
      style={{ 
        lineHeight: '1.8',
        minHeight: '1.2em'
      }}
    >
      {!window.MathJax && (
        <div className="math-fallback">
          {processedText.replace(/\$+/g, '').replace(/\\\\/g, ' ')}
        </div>
      )}
    </div>
  );
};

// Advanced component for complex mathematical expressions
interface AdvancedMathProps {
  children: string;
  environment?: 'equation' | 'align' | 'array' | 'matrix' | 'cases';
  numbered?: boolean;
  className?: string;
}

export const AdvancedMath: React.FC<AdvancedMathProps> = ({ 
  children, 
  environment = 'equation',
  numbered = false,
  className = ""
}) => {
  const wrappedContent = numbered 
    ? `\\begin{${environment}}${children}\\end{${environment}}`
    : `\\begin{${environment}*}${children}\\end{${environment}*}`;

  return (
    <MathText 
      text={wrappedContent}
      mode="display"
      className={`advanced-math ${className}`}
      enableAdvancedProcessing={true}
    />
  );
};