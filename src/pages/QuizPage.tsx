import { useState, useEffect } from 'react';
import { Play, CheckCircle, XCircle, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../types/database';

type Question = Database['public']['Tables']['quiz_questions']['Row'];

export function QuizPage() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ questionId: string; answer: string; isCorrect: boolean }[]>([]);
  const [quizState, setQuizState] = useState<'start' | 'playing' | 'finished'>('start');
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .order('created_at');

    if (error) {
      console.error('Error loading questions:', error);
      return;
    }

    setQuestions(data || []);
  };

  const startQuiz = () => {
    setQuizState('playing');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScore(0);
    setSelectedAnswer(null);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = async () => {
    if (!selectedAnswer || !user) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;

    setAnswers([
      ...answers,
      {
        questionId: currentQuestion.id,
        answer: selectedAnswer,
        isCorrect,
      },
    ]);

    if (isCorrect) {
      setScore(score + currentQuestion.points);
    }

    await supabase.from('user_answers').insert({
      user_id: user.id,
      question_id: currentQuestion.id,
      selected_answer: selectedAnswer as 'a' | 'b' | 'c' | 'd',
      is_correct: isCorrect,
    });

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      await finishQuiz(isCorrect ? score + currentQuestion.points : score);
    }
  };

  const finishQuiz = async (finalScore: number) => {
    setLoading(true);

    if (!user) return;

    const { data: existingScore } = await supabase
      .from('user_scores')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingScore) {
      await supabase
        .from('user_scores')
        .update({
          total_score: existingScore.total_score + finalScore,
          quiz_attempts: existingScore.quiz_attempts + 1,
          last_quiz_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
    } else {
      await supabase.from('user_scores').insert({
        user_id: user.id,
        total_score: finalScore,
        quiz_attempts: 1,
        last_quiz_at: new Date().toISOString(),
      });
    }

    setLoading(false);
    setQuizState('finished');
  };

  if (quizState === 'start') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 text-center">
          <div className="p-4 bg-blue-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Play className="text-blue-600" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz de Educação Financeira</h2>
          <p className="text-gray-600 mb-6">
            Teste seus conhecimentos respondendo {questions.length} perguntas sobre educação financeira.
            Cada resposta correta vale 1 ponto!
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>Instruções:</strong> Leia cada pergunta com atenção e selecione a alternativa que você considera correta.
              Suas respostas serão registradas e sua pontuação aparecerá no ranking.
            </p>
          </div>
          <button
            onClick={startQuiz}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Começar Quiz
          </button>
        </div>
      </div>
    );
  }

  if (quizState === 'finished') {
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const percentage = (correctAnswers / questions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 text-center">
          <div className="p-4 bg-green-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Award className="text-green-600" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz Concluído!</h2>
          <p className="text-gray-600 mb-8">Confira seu desempenho abaixo</p>

          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 mb-6">
            <p className="text-gray-600 mb-2">Sua Pontuação</p>
            <p className="text-5xl font-bold text-gray-900 mb-4">{score} pontos</p>
            <p className="text-lg text-gray-700">
              {correctAnswers} de {questions.length} respostas corretas ({percentage.toFixed(0)}%)
            </p>
          </div>

          <div className="space-y-3 mb-6 text-left">
            {answers.map((answer, index) => (
              <div
                key={index}
                className={`flex items-center p-4 rounded-lg ${
                  answer.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}
              >
                {answer.isCorrect ? (
                  <CheckCircle className="text-green-600 mr-3" size={24} />
                ) : (
                  <XCircle className="text-red-600 mr-3" size={24} />
                )}
                <div>
                  <p className="font-medium text-gray-900">Pergunta {index + 1}</p>
                  <p className="text-sm text-gray-600">
                    Sua resposta: {answer.answer.toUpperCase()} -{' '}
                    {answer.isCorrect ? 'Correto' : 'Incorreto'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={startQuiz}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Fazer Novamente
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Carregando perguntas...</p>
      </div>
    );
  }

  const options = [
    { key: 'a', text: currentQuestion.option_a },
    { key: 'b', text: currentQuestion.option_b },
    { key: 'c', text: currentQuestion.option_c },
    { key: 'd', text: currentQuestion.option_d },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-600">
              Pergunta {currentQuestionIndex + 1} de {questions.length}
            </span>
            <span className="text-sm font-medium text-blue-600">
              Pontuação: {score}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-6">{currentQuestion.question}</h3>

        <div className="space-y-3 mb-6">
          {options.map((option) => (
            <button
              key={option.key}
              onClick={() => handleAnswerSelect(option.key)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedAnswer === option.key
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold ${
                    selectedAnswer === option.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {option.key.toUpperCase()}
                </div>
                <span className="text-gray-900">{option.text}</span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleNextQuestion}
          disabled={!selectedAnswer || loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? 'Salvando...'
            : currentQuestionIndex < questions.length - 1
            ? 'Próxima Pergunta'
            : 'Finalizar Quiz'}
        </button>
      </div>
    </div>
  );
}
