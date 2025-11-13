import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { CheckCircle, Sparkles } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  key: string;
}

const questions: QuizQuestion[] = [
  {
    id: '1',
    question: 'What is your skin type?',
    options: ['Dry', 'Oily', 'Combination', 'Sensitive', 'Normal'],
    key: 'skinType',
  },
  {
    id: '2',
    question: 'What is your primary skin concern?',
    options: ['Acne', 'Aging', 'Pigmentation', 'Hydration', 'Sensitivity'],
    key: 'primaryConcern',
  },
  {
    id: '3',
    question: 'How would you describe your skin texture?',
    options: ['Smooth', 'Rough', 'Uneven', 'Bumpy', 'Flaky'],
    key: 'texture',
  },
  {
    id: '4',
    question: 'What is your age range?',
    options: ['18-25', '26-35', '36-45', '46-55', '56+'],
    key: 'ageRange',
  },
  {
    id: '5',
    question: 'How often do you experience breakouts?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
    key: 'breakouts',
  },
  {
    id: '6',
    question: 'What is your current skincare routine?',
    options: ['Minimal (1-2 products)', 'Basic (3-4 products)', 'Moderate (5-6 products)', 'Extensive (7+ products)', 'None'],
    key: 'routine',
  },
];

export function QuizPage() {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleAnswer = (answer: string) => {
    const question = questions[currentQuestion];
    setAnswers({ ...answers, [question.key]: answer });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuiz({ ...answers, [question.key]: answer });
    }
  };

  const submitQuiz = async (finalAnswers: Record<string, string>) => {
    setLoading(true);

    try {
      const sessionId = user?.id || `anon_${Date.now()}`;

      const { error } = await supabase.from('quiz_responses').insert({
        user_id: user?.id || null,
        session_id: sessionId,
        responses: finalAnswers,
      });

      if (error) throw error;

      setCompleted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-white border-2 border-black rounded-xl p-12 space-y-6 shadow-2xl animate-slideInUp">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle size={48} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ASSESSMENT COMPLETE
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Thank you for completing your skin assessment. Based on your responses,
              we recommend exploring our personalized product collection.
            </p>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                <strong>Your Profile:</strong>
              </p>
              <div className="text-left max-w-md mx-auto space-y-2 text-sm">
                {Object.entries(answers).map(([key, value]) => {
                  const question = questions.find((q) => q.key === key);
                  return (
                    <div key={key} className="border-b border-gray-200 pb-2">
                      <span className="font-bold">{question?.question}</span>
                      <br />
                      <span className="text-gray-600">{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="pt-8">
              <Button onClick={() => window.location.href = '/shop'}>
                View Recommended Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-purple-600" />
              <span className="text-sm font-bold text-gray-700">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            <span className="text-sm font-bold text-purple-600">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white border-2 border-black rounded-xl p-12 shadow-2xl animate-fadeIn">
          <h2 className="text-3xl md:text-4xl font-black mb-12 text-center leading-tight">
            {question.question}
          </h2>

          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={loading}
                className="w-full px-8 py-5 text-left border-2 border-gray-300 rounded-xl hover:border-black hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:scale-[1.02] hover:shadow-lg transition-all duration-200 font-bold disabled:opacity-50 group"
                style={{ animationDelay: `${index * 100}ms`, animation: 'slideInUp 0.5s ease-out' }}
              >
                <span className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-purple-500 group-hover:text-white flex items-center justify-center text-sm font-black transition-colors">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </span>
              </button>
            ))}
          </div>

          {currentQuestion > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="text-sm text-gray-600 hover:text-black font-bold hover:scale-105 transition-transform"
              >
                ← Previous Question
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
