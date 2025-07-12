import React from 'react';
import { MathJax, MathJaxContext } from 'react-mathjax2';

interface MathRendererProps {
  children: React.ReactNode;
}

const mathJaxConfig = {
  displayAlign: 'left',
  displayIndent: '0em',
  showMathMenu: false,
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
};

export const MathJaxProvider: React.FC<MathRendererProps> = ({ children }) => {
  return (
    <MathJaxContext 
      script="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML"
      config={mathJaxConfig}
    >
      {children}
    </MathJaxContext>
  );
};

interface MathTextProps {
  text: string;
  className?: string;
}

export const MathText: React.FC<MathTextProps> = ({ text, className = "" }) => {
  // Process the text to handle LaTeX newlines and formatting
  const processedText = text
    .replace(/\$\\\\\$/g, '<br/>')
    .replace(/\$\\newline\$/g, '<br/>')
    .replace(/\\newline/g, '<br/>')
    .replace(/\\\\/g, '<br/>');

  return (
    <div className={className}>
      <MathJax>
        <div dangerouslySetInnerHTML={{ __html: processedText }} />
      </MathJax>
    </div>
  );
};