import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MathText, AdvancedMath } from './MathRenderer';
import { BookOpen, Zap, Settings, TestTube } from 'lucide-react';

const latexExamples = {
  basic: {
    title: "Basic LaTeX",
    examples: [
      { 
        name: "Fractions", 
        latex: "\\frac{a}{b} = \\frac{numerator}{denominator}" 
      },
      { 
        name: "Exponents & Subscripts", 
        latex: "x^2 + y_1 = z_{max}" 
      },
      { 
        name: "Greek Letters", 
        latex: "\\alpha + \\beta = \\gamma, \\Delta x = \\pi r^2" 
      },
      { 
        name: "Square Roots", 
        latex: "\\sqrt{x} + \\sqrt[3]{y} = \\sqrt{a^2 + b^2}" 
      }
    ]
  },
  
  advanced: {
    title: "Advanced Mathematics",
    examples: [
      { 
        name: "Integrals", 
        latex: "\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}" 
      },
      { 
        name: "Summations", 
        latex: "\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}" 
      },
      { 
        name: "Limits", 
        latex: "\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1" 
      },
      { 
        name: "Complex Expressions", 
        latex: "f(x) = \\frac{1}{\\sqrt{2\\pi\\sigma^2}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}" 
      }
    ]
  },
  
  matrices: {
    title: "Matrices & Arrays",
    examples: [
      { 
        name: "Simple Matrix", 
        latex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}" 
      },
      { 
        name: "Determinant", 
        latex: "\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc" 
      },
      { 
        name: "Array with Cases", 
        latex: "f(x) = \\begin{cases} x^2 & \\text{if } x \\geq 0 \\\\ -x^2 & \\text{if } x < 0 \\end{cases}" 
      },
      { 
        name: "System of Equations", 
        latex: "\\begin{align} x + y &= 5 \\\\ 2x - y &= 1 \\end{align}" 
      }
    ]
  },
  
  tables: {
    title: "LaTeX Tables",
    examples: [
      { 
        name: "Basic Table", 
        latex: "\\begin{array}{|c|c|} \\hline \\text{Number} & \\text{Type} \\\\ \\hline \\sqrt{2} & \\text{Irrational} \\\\ \\frac{1}{2} & \\text{Rational} \\\\ \\hline \\end{array}" 
      },
      { 
        name: "Classification Table", 
        latex: "\\begin{array}{|l|c|r|} \\hline \\textbf{Function} & \\textbf{Domain} & \\textbf{Range} \\\\ \\hline f(x) = x^2 & \\mathbb{R} & [0, \\infty) \\\\ g(x) = \\ln x & (0, \\infty) & \\mathbb{R} \\\\ \\hline \\end{array}" 
      }
    ]
  }
};

export const LaTeXDemo: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState<string>('');
  const [customLatex, setCustomLatex] = useState('\\frac{d}{dx}[f(x)] = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <Zap className="h-8 w-8 text-primary" />
          Advanced LaTeX Rendering
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Powerful LaTeX rendering with advanced preprocessing, auto-detection, 
          and comprehensive mathematical notation support.
        </p>
      </div>

      <Tabs defaultValue="examples" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="examples" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Examples
          </TabsTrigger>
          <TabsTrigger value="playground" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Playground
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Features
          </TabsTrigger>
        </TabsList>

        <TabsContent value="examples" className="space-y-6">
          {Object.entries(latexExamples).map(([key, section]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.examples.map((example, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{example.name}</Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setCustomLatex(example.latex)}
                      >
                        Try This
                      </Button>
                    </div>
                    <div className="bg-math-bg border border-math-border rounded-lg p-4">
                      <MathText 
                        text={example.latex}
                        mode="display"
                        className="text-center"
                      />
                    </div>
                    <details className="text-sm">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        View LaTeX Code
                      </summary>
                      <pre className="bg-muted p-2 rounded mt-2 overflow-x-auto">
                        <code>{example.latex}</code>
                      </pre>
                    </details>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="playground" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>LaTeX Playground</CardTitle>
              <p className="text-muted-foreground">
                Type or paste LaTeX code below to see it rendered in real-time.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">LaTeX Input:</label>
                <textarea
                  value={customLatex}
                  onChange={(e) => setCustomLatex(e.target.value)}
                  className="w-full h-32 p-3 border border-input rounded-md font-mono text-sm resize-vertical"
                  placeholder="Enter LaTeX code here..."
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Rendered Output:</label>
                <div className="min-h-[100px] bg-math-bg border border-math-border rounded-lg p-6">
                  <MathText 
                    text={customLatex}
                    mode="auto"
                    className="text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setCustomLatex('\\frac{a}{b}')}
                >
                  Fraction
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setCustomLatex('\\sqrt{x^2 + y^2}')}
                >
                  Square Root
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setCustomLatex('\\int_{0}^{1} x^2 dx')}
                >
                  Integral
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setCustomLatex('\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}')}
                >
                  Matrix
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🔍 Smart Detection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Automatically detects inline vs display math and applies appropriate formatting.
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Arrays and matrices → Display mode</li>
                  <li>• Simple expressions → Inline mode</li>
                  <li>• Automatic LaTeX wrapping</li>
                  <li>• Preprocesses common patterns</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">⚡ Advanced Processing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Robust text preprocessing handles various LaTeX formats and edge cases.
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Handles \\textnormal commands</li>
                  <li>• Fixes spacing and newlines</li>
                  <li>• Converts common patterns</li>
                  <li>• Error recovery with fallbacks</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🎨 Enhanced Styling</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Beautiful styling with loading states and responsive design.
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Loading animations</li>
                  <li>• Responsive overflow handling</li>
                  <li>• Theme-aware colors</li>
                  <li>• Professional typography</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🛠 Developer Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Comprehensive API with multiple rendering modes and customization options.
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Multiple rendering modes</li>
                  <li>• Custom macro support</li>
                  <li>• Error handling & fallbacks</li>
                  <li>• TypeScript interfaces</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Available LaTeX Packages & Extensions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Core</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• base</li>
                    <li>• ams</li>
                    <li>• newcommand</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Math</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• mathtools</li>
                    <li>• amsmath</li>
                    <li>• amssymb</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Text</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• textmacros</li>
                    <li>• configmacros</li>
                    <li>• noundefined</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Extensions</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• autoload</li>
                    <li>• require</li>
                    <li>• action</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};