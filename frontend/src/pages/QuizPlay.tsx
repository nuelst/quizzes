import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, CircleCheckBig, CircleHelp, CircleX, LoaderCircle, Smile, Target, Trophy, X, Zap } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { quizApi, attemptApi } from '../api';
import { QuizDetail, AnswerResult, AttemptResult } from '../types';
import { useUser } from '../hooks/useUser';
import styles from './QuizPlay.module.css';

type GameState = 'loading' | 'ready' | 'playing' | 'answered' | 'results' | 'error';

interface XpFloat {
  id: number;
  value: number;
  x: number;
  y: number;
}

export function QuizPlayPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { refreshUser } = useUser();

  const [gameState, setGameState] = useState<GameState>('loading');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attemptId, setAttemptId] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [finalResult, setFinalResult] = useState<AttemptResult | null>(null);
  const [xpFloats, setXpFloats] = useState<XpFloat[]>([]);
  const xpFloatId = useRef(0);

  const quizQuery = useQuery({
    queryKey: ['quiz', id],
    queryFn: () => quizApi.getById(id as string),
    enabled: !!id,
  });

  const startAttemptMutation = useMutation({
    mutationFn: (quizId: string) => attemptApi.start(quizId),
  });

  const submitAnswerMutation = useMutation({
    mutationFn: (payload: { attemptId: string; questionId: string; answerId: string }) =>
      attemptApi.submitAnswer(payload.attemptId, payload.questionId, payload.answerId),
  });

  const completeAttemptMutation = useMutation({
    mutationFn: (attemptId: string) => attemptApi.complete(attemptId),
  });

  useEffect(() => {
    if (!id) return;
    setGameState('loading');
    setCurrentIndex(0);
    setAttemptId('');
    setSelectedAnswer('');
    setAnswerResult(null);
    setFinalResult(null);
  }, [id]);

  useEffect(() => {
    if (quizQuery.isLoading) return;
    if (quizQuery.isError) {
      setGameState('error');
      return;
    }
    if (quizQuery.data && gameState === 'loading') {
      setGameState('ready');
    }
  }, [quizQuery.isLoading, quizQuery.isError, quizQuery.data, gameState]);

  const startQuiz = async () => {
    const quiz = quizQuery.data;
    if (!quiz) return;
    try {
      const attempt = await startAttemptMutation.mutateAsync(quiz.id);
      setAttemptId(attempt.id);
      setCurrentIndex(0);
      setGameState('playing');
    } catch {
      setGameState('error');
    }
  };

  const handleAnswer = async (answerId: string, event: React.MouseEvent) => {
    const quiz = quizQuery.data;
    if (gameState !== 'playing' || !quiz) return;
    setSelectedAnswer(answerId);
    setGameState('answered');

    const question = quiz.questions[currentIndex];
    try {
      const result = await submitAnswerMutation.mutateAsync({ attemptId, questionId: question.id, answerId });
      setAnswerResult(result);
      refreshUser();

      // Spawn floating XP
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      const floatId = ++xpFloatId.current;
      setXpFloats((prev) => [
        ...prev,
        { id: floatId, value: result.xpChange, x: rect.left + rect.width / 2, y: rect.top },
      ]);
      setTimeout(() => {
        setXpFloats((prev) => prev.filter((f) => f.id !== floatId));
      }, 1200);
    } catch {
      setGameState('error');
    }
  };

  const nextQuestion = async () => {
    const quiz = quizQuery.data;
    if (!quiz) return;
    const isLast = currentIndex === quiz.questions.length - 1;

    if (isLast) {
      try {
        const result = await completeAttemptMutation.mutateAsync(attemptId);
        setFinalResult(result);
        setGameState('results');
      } catch {
        setGameState('error');
      }
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer('');
      setAnswerResult(null);
      setGameState('playing');
    }
  };

  if (gameState === 'loading') {
    return (
      <div className={styles.centered}>
        <LoaderCircle className={styles.loadingGlobe} size={44} />
        <p>Carregando quiz...</p>
      </div>
    );
  }

  if (gameState === 'error') {
    return (
      <div className={styles.centered}>
        <p className={styles.errorMsg}>Algo deu errado. <button onClick={() => navigate('/quizzes')}>Voltar</button></p>
      </div>
    );
  }

  const quiz = quizQuery.data as QuizDetail | undefined;
  if (!quiz) return null;

  // Ready screen
  if (gameState === 'ready') {
    return (
      <div className={styles.page}>
        <div className={styles.readyCard}>
          <div className={styles.readyEmoji}><CircleHelp size={56} /></div>
          <h2 className={styles.readyTitle}>{quiz.title}</h2>
          <p className={styles.readyDesc}>{quiz.description}</p>
          <div className={styles.readyMeta}>
            <span><CircleHelp size={14} /> {quiz.totalQuestions} questões</span>
            <span><Zap size={14} /> +50 XP por acerto</span>
            <span><CircleX size={14} /> -15 XP por erro</span>
          </div>
          <button className={styles.startBtn} onClick={startQuiz}>
            Começar Quiz
          </button>
          <button className={styles.backLink} onClick={() => navigate('/quizzes')}>
            ← Voltar aos quizzes
          </button>
        </div>
      </div>
    );
  }

  // Results screen
  if (gameState === 'results' && finalResult) {
    const xpPositive = finalResult.xpEarned >= 0;
    const ResultIcon = finalResult.accuracy >= 70 ? Trophy : finalResult.accuracy >= 40 ? Smile : Target;
    return (
      <div className={styles.page}>
        <div className={styles.resultsCard}>
          <div className={styles.resultsEmoji}><ResultIcon size={56} /></div>
          <h2 className={styles.resultsTitle}>Quiz Concluído!</h2>
          <div className={styles.xpResult} style={{ color: xpPositive ? 'var(--green)' : 'var(--red)' }}>
            {xpPositive ? '+' : ''}{finalResult.xpEarned} XP
          </div>

          <div className={styles.resultStats}>
            <div className={styles.resultStat}>
              <span className={styles.resultStatNum} style={{ color: 'var(--green)' }}>
                {finalResult.totalRight}
              </span>
              <span>Acertos</span>
            </div>
            <div className={styles.resultStat}>
              <span className={styles.resultStatNum} style={{ color: 'var(--red)' }}>
                {finalResult.totalWrong}
              </span>
              <span>Erros</span>
            </div>
            <div className={styles.resultStat}>
              <span className={styles.resultStatNum}>{finalResult.accuracy}%</span>
              <span>Precisão</span>
            </div>
          </div>

          <div className={styles.resultActions}>
            <button className={styles.startBtn} onClick={startQuiz}>
              Jogar Novamente
            </button>
            <button className={styles.backLink} onClick={() => navigate('/quizzes')}>
              Ver outros quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing screen
  const question = quiz.questions[currentIndex];
  const progress = ((currentIndex + 1) / quiz.totalQuestions) * 100;

  return (
    <div className={styles.page}>
      {/* XP floating indicators */}
      {xpFloats.map((f) => (
        <div
          key={f.id}
          className={styles.xpFloat}
          style={{ left: f.x, top: f.y, color: f.value > 0 ? 'var(--green)' : 'var(--red)' }}
        >
          {f.value > 0 ? '+' : ''}{f.value} XP
        </div>
      ))}

      <div className={styles.gameContainer}>
        {/* Progress bar */}
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>

        <div className={styles.questionMeta}>
          <span className={styles.questionCount}>{currentIndex + 1} / {quiz.totalQuestions}</span>
          <span className={styles.quizTitle}>{quiz.title}</span>
        </div>

        <div className={styles.questionCard}>
          <div className={styles.questionIcon}><CircleHelp size={30} /></div>
          <h2 className={styles.questionText}>{question.text}</h2>
        </div>

        <div className={styles.answersGrid}>
          {question.answers.map((answer) => {
            let answerStyle = '';
            if (gameState === 'answered') {
              if (answer.id === answerResult?.correctAnswerId) answerStyle = styles.correct;
              else if (answer.id === selectedAnswer && !answerResult?.isCorrect) answerStyle = styles.wrong;
              else answerStyle = styles.dimmed;
            }
            return (
              <button
                key={answer.id}
                className={`${styles.answerBtn} ${answerStyle}`}
                onClick={(e) => handleAnswer(answer.id, e)}
                disabled={gameState === 'answered'}
              >
                <span className={styles.answerText}>{answer.text}</span>
                {gameState === 'answered' && answer.id === answerResult?.correctAnswerId && (
                  <span className={styles.answerIcon}><Check size={18} /></span>
                )}
                {gameState === 'answered' && answer.id === selectedAnswer && !answerResult?.isCorrect && (
                  <span className={styles.answerIcon}><X size={18} /></span>
                )}
              </button>
            );
          })}
        </div>

        {gameState === 'answered' && answerResult && (
          <div className={`${styles.feedback} ${answerResult.isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}`}>
            <div className={styles.feedbackContent}>
              <span className={styles.feedbackEmoji}>
                {answerResult.isCorrect ? <CircleCheckBig size={24} /> : <CircleX size={24} />}
              </span>
              <div>
                <strong>{answerResult.isCorrect ? 'Correto!' : 'Errado!'}</strong>
                <span className={styles.feedbackXp} style={{ color: answerResult.xpChange > 0 ? 'var(--green)' : 'var(--red)' }}>
                  {answerResult.xpChange > 0 ? '+' : ''}{answerResult.xpChange} XP
                </span>
              </div>
            </div>
            <button className={styles.nextBtn} onClick={nextQuestion}>
              {currentIndex < quiz.totalQuestions - 1 ? 'Próxima →' : 'Ver resultado →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
