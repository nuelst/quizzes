import { AlertTriangle, LoaderCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { quizApi } from '../api';
import { QuizCard } from '../components/QuizCard';
import styles from './Quizzes.module.css';

export function QuizzesPage() {
  const {
    data: quizzes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['quizzes'],
    queryFn: quizApi.getAll,
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Quizzes</h1>
        <p className={styles.sub}>Escolha um quiz e teste seus conhecimentos de geografia</p>
      </div>

      {isLoading && (
        <div className={styles.loading}>
          <LoaderCircle className={styles.spinner} size={44} />
          <p>Carregando quizzes...</p>
        </div>
      )}

      {isError && (
        <div className={styles.error}>
          <AlertTriangle size={18} />
          <span>Não foi possível carregar os quizzes. Verifique se o servidor está rodando.</span>
        </div>
      )}

      {!isLoading && !isError && (
        <div className={styles.grid}>
          {quizzes.map((quiz, i) => (
            <QuizCard key={quiz.id} quiz={quiz} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
