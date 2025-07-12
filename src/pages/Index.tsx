import { MathJaxProvider } from '@/components/MathRenderer';
import { QuestionViewer } from '@/components/QuestionViewer';
import { LaTeXDemo } from '@/components/LaTeXDemo';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Zap } from 'lucide-react';

const Index = () => {
  const [currentView, setCurrentView] = useState<'questions' | 'demo'>('questions');

  return (
    <MathJaxProvider>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <div className="border-b border-border bg-card">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">LaTeX Question Renderer</h1>
              <div className="flex gap-2">
                <Button
                  variant={currentView === 'questions' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('questions')}
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Question Viewer
                </Button>
                <Button
                  variant={currentView === 'demo' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('demo')}
                  className="flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  LaTeX Demo
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {currentView === 'questions' ? <QuestionViewer /> : <LaTeXDemo />}
      </div>
    </MathJaxProvider>
  );
};

export default Index;
