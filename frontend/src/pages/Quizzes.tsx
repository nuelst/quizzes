import { useState, useEffect } from 'react';
import { AlertTriangle, LoaderCircle } from 'lucide-react';
import { quizApi } from '../api';
import { Quiz } from '../types';
import { QuizCard } from '../components/QuizCard';
import styles from './Quizzes.module.css';

export function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    quizApi.getAll()
      .then(setQuizzes)
      .catch(() => setError('Não foi possível carregar os quizzes. Verifique se o servidor está rodando.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Quizzes</h1>
        <p className={styles.sub}>Escolha um quiz e teste seus conhecimentos de geografia</p>
      </div>

      {loading && (
        <div className={styles.loading}>
          <LoaderCircle className={styles.spinner} size={44} />
          <p>Carregando quizzes...</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className={styles.grid}>
          {quizzes.map((quiz, i) => (
            <QuizCard key={quiz.id} quiz={quiz} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
