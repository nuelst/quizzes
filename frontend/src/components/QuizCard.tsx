import { useNavigate } from 'react-router-dom';
import { FileText, GamepadDirectional, Globe, Landmark, Layers3, type LucideIcon, Zap } from 'lucide-react';
import { Quiz } from '../types';
import styles from './QuizCard.module.css';

const categoryIcon: Record<string, LucideIcon> = {
  continents: Globe,
  countries: Landmark,
  mixed: Layers3,
};

const categoryLabel: Record<string, string> = {
  continents: 'Continentes',
  countries: 'Países',
  mixed: 'Misto',
};

interface Props {
  quiz: Quiz;
  index: number;
}

export function QuizCard({ quiz, index }: Props) {
  const navigate = useNavigate();
  const CategoryIcon = categoryIcon[quiz.category] || Globe;

  return (
    <div
      className={styles.card}
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => navigate(`/quiz/${quiz.id}`)}
    >
      <div className={styles.categoryBadge}>
        <CategoryIcon size={14} />
        <span>{categoryLabel[quiz.category] || quiz.category}</span>
      </div>

      <h3 className={styles.title}>{quiz.title}</h3>
      <p className={styles.description}>{quiz.description}</p>

      <div className={styles.footer}>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <FileText size={14} /> {quiz.totalQuestions} questões
          </span>
          <span className={styles.metaItem}>
            <Zap size={14} /> até +{quiz.totalQuestions * 50} XP
          </span>
        </div>
        <button className={styles.playBtn}>
          <GamepadDirectional size={16} />
          <span>Jogar</span>
        </button>
      </div>
    </div>
  );
}
