import { MathJaxProvider } from '@/components/MathRenderer';
import { QuestionViewer } from '@/components/QuestionViewer';

const Index = () => {
  return (
    <MathJaxProvider>
      <QuestionViewer />
    </MathJaxProvider>
  );
};

export default Index;
