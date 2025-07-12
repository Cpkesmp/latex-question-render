import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, BookOpen, Clock, Calendar } from 'lucide-react';
import { MathText } from './MathRenderer';
import { useToast } from '@/hooks/use-toast';

interface Question {
  question_id: string;
  question_latex: string;
  marks: number;
}

interface Section {
  section_name: string;
  description?: string | null;
  questions: Question[];
}

interface ExamData {
  name: string;
  course: string;
  start_date: string;
  end_date: string;
  total_time: string;
  total_marks: number;
  lessons: string[];
  questions: Section[];
}

const sampleExamData: ExamData = {
  "name": "Testing 1010",
  "course": "68139607dffb3e24eac39b3f",
  "start_date": "2025-06-28T04:50:00.000Z",
  "end_date": "2025-06-28T05:10:00.000Z",
  "total_time": "20",
  "total_marks": 61,
  "lessons": [
    "LESSON1", "LESSON2", "LESSON3", "LESSON4", "LESSON5",
    "LESSON6", "LESSON9", "LESSON8", "LESSON7", "LESSON10", "LESSON11"
  ],
  "questions": [
    {
      "section_name": "mcq",
      "description": null,
      "questions": [
        {
          "question_id": "6759d0c680d9a6515a778d1f",
          "question_latex": "What is the decimal expansion of $\\frac{1}{3}$?$\\\\$Options:$\\newline$ (A) 0.333...$\\newline$ (B) 0.3$\\newline$ (C) 0.3333$\\newline$ (D) 0.33333...",
          "marks": 1
        },
        {
          "question_id": "6759d0c680d9a6515a778d20",
          "question_latex": "Which of the following is an irrational number?$\\\\$ Options:$\\newline$ (A) $\\sqrt{4}$$\\newline$ (B) $\\sqrt{2}$$\\newline$ (C) $\\frac{3}{2}$$\\newline$ (D) 0.75",
          "marks": 1
        },
        {
          "question_id": "6759d0c680d9a6515a778d21",
          "question_latex": "Find the rational number between 1 and 2.$\\\\$Options:$\\newline$ (A) $\\frac{3}{2}$$\\newline$ (B) $\\frac{5}{2}$$\\newline$ (C) $\\frac{7}{2}$$\\newline$ (D) $\\frac{9}{2}$",
          "marks": 1
        }
      ]
    },
    {
      "section_name": "matching",
      "description": null,
      "questions": [
        {
          "question_id": "6759d0c680d9a6515a778d3f",
          "question_latex": "Match the following types of numbers with their correct representations on the number line: $\\newline$ $\\begin{array}{|c|c|} \\hline \\textnormal{Type of Number} & \\textnormal{Representation} \\\\ \\hline \\textnormal{Natural Numbers} & \\textnormal{Positive integers starting from 1} \\\\ \\textnormal{Whole Numbers} & \\textnormal{Non-negative integers} \\\\ \\textnormal{Integers} & \\textnormal{All positive and negative whole numbers} \\\\ \\textnormal{Rational Numbers} & \\textnormal{Numbers that can be expressed as } \\frac{p}{q} \\\\ \\hline \\end{array}$",
          "marks": 5
        },
        {
          "question_id": "6759d0c680d9a6515a778d5b",
          "question_latex": "\\textnormal{Match the following numbers with their classifications: $\\newline$ $\\begin{array}{|c|c|} \\hline \\textnormal{Number} & \\textnormal{Classification} \\\\ \\hline \\sqrt{3} & \\textnormal{(A) Rational} \\\\ 0.333\\ldots & \\textnormal{(B) Irrational} \\\\ \\frac{5}{2} & \\textnormal{(C) Terminating Decimal} \\\\ \\pi & \\textnormal{(D) Non-terminating, Recurring Decimal} \\\\ \\hline \\end{array}$",
          "marks": 3
        },
        {
          "question_id": "6759d0c680d9a6515a778d7d",
          "question_latex": "\\textnormal{Match the following numbers with their decimal expansions:} \\\\ $\\begin{array}{|c|c|} \\hline \\textnormal{Number} & \\textnormal{Decimal Expansion} \\\\ \\hline \\frac{1}{3} & 0.333\\ldots \\\\ \\hline \\frac{1}{4} & 0.25 \\\\ \\hline \\frac{1}{7} & 0.142857\\ldots \\\\ \\hline \\sqrt{2} & 1.414213\\ldots \\\\ \\hline \\end{array}$",
          "marks": 3
        },
        {
          "question_id": "6759d0c680d9a6515a778d88",
          "question_latex": "Match the following decimal expansions with their types: $\\newline$ $\\begin{array}{|c|c|} \\hline \\textnormal{Decimal Expansion} & \\textnormal{Type} \\\\ \\hline 0.5 & \\textnormal{?} \\\\ 0.333... & \\textnormal{?} \\\\ 1.414213... & \\textnormal{?} \\\\ 0.1010010001... & \\textnormal{?} \\\\ \\hline \\end{array}$",
          "marks": 3
        }
      ]
    }
  ]
};

export const QuestionViewer: React.FC = () => {
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text) as ExamData;
      setExamData(data);
      toast({
        title: "File loaded successfully",
        description: `Loaded exam: ${data.name}`,
      });
    } catch (error) {
      toast({
        title: "Error loading file",
        description: "Please check that the JSON format is correct.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadSampleJSON = () => {
    const dataStr = JSON.stringify(sampleExamData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample-exam.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Sample downloaded",
      description: "Sample JSON file has been downloaded.",
    });
  };

  const loadSampleData = () => {
    setExamData(sampleExamData);
    toast({
      title: "Sample data loaded",
      description: "Sample exam data has been loaded for preview.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!examData) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              MathJax Question Viewer
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload a JSON file with LaTeX questions or try the sample data
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={loading}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-lg font-medium">
                        {loading ? "Loading..." : "Click to upload JSON file"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Supports JSON files with LaTeX questions
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex justify-center gap-4">
                <Button onClick={loadSampleData} variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Load Sample Data
                </Button>
                <Button onClick={downloadSampleJSON}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Sample JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {examData.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(examData.start_date)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {examData.total_time} minutes
                </div>
                <div>
                  Total Marks: {examData.total_marks}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setExamData(null)} 
                variant="outline"
                size="sm"
              >
                Load New File
              </Button>
              <Button onClick={downloadSampleJSON} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Sample
              </Button>
            </div>
          </div>

          {/* Lessons */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Lessons Covered:
            </h3>
            <div className="flex flex-wrap gap-2">
              {examData.lessons.map((lesson, index) => (
                <Badge key={index} variant="secondary">
                  {lesson}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {examData.questions.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="bg-section-bg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="capitalize text-xl">
                      {section.section_name.replace('_', ' ')} Section
                    </span>
                    <Badge variant="outline">
                      {section.questions.length} questions
                    </Badge>
                  </div>
                  <Badge>
                    {section.questions.reduce((sum, q) => sum + q.marks, 0)} marks
                  </Badge>
                </CardTitle>
                {section.description && (
                  <p className="text-muted-foreground">{section.description}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {section.questions.map((question, questionIndex) => (
                  <Card key={question.question_id} className="bg-question-bg">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="secondary">
                          Question {questionIndex + 1}
                        </Badge>
                        <Badge>
                          {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
                        </Badge>
                      </div>
                      <div className="bg-math-bg border border-math-border rounded-lg p-4">
                        <MathText 
                          text={question.question_latex}
                          className="text-foreground leading-relaxed"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};