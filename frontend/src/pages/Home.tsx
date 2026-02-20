import { useNavigate } from 'react-router-dom';
import { CircleCheckBig, CircleX, HelpCircle, Sparkles, TrendingDown } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import styles from './Home.module.css';

export function HomePage() {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Sparkles size={16} />
            <span>Quizz</span>
          </div>
          <h1 className={styles.heading}>
            Desafie seu raciocínio<br />
            <span className={styles.accent}>uma pergunta por vez</span>
          </h1>
          <p className={styles.sub}>
            Entre em partidas rápidas, acumule XP e suba no ranking.
            O foco é jogar bem, manter consistência e aprender a cada rodada.
          </p>

          <div className={styles.actions}>
            <button className={styles.primaryBtn} onClick={() => navigate('/quizzes')}>
              Ver todos os quizzes
            </button>
          </div>

          {user && (
            <div className={styles.xpInfo}>
              <span>Seus pontos:</span>
              <span className={styles.xpNum} style={{ color: user.xpPoints < 0 ? 'var(--red)' : 'var(--green)' }}>
                {user.xpPoints >= 0 ? '+' : ''}{user.xpPoints} XP
              </span>
            </div>
          )}
        </div>

        <div className={styles.heroVisual}>
          <img
            className={styles.heroIllustration}
            src="/illustration.svg"
            alt="Ilustração da página inicial do Quizz"
          />
        </div>
      </section>

      <section className={styles.rules}>
        <div className={styles.rulesHeader}>
          <HelpCircle size={20} />
          <h2>Regras do jogo</h2>
        </div>
        <div className={styles.ruleCard}>
          <CircleCheckBig size={20} />
          <div>
            <strong>Como eu ganho pontos?</strong>
            <p>Cada resposta correta soma +50 XP ao seu perfil.</p>
          </div>
        </div>
        <div className={styles.ruleCard}>
          <CircleX size={20} />
          <div>
            <strong>O que acontece se eu errar?</strong>
            <p>Cada erro desconta -15 XP da sua pontuação.</p>
          </div>
        </div>
        <div className={styles.ruleCard}>
          <TrendingDown size={20} />
          <div>
            <strong>Meu XP pode ficar negativo?</strong>
            <p>Sim. O sistema permite pontuação negativa para manter o desafio real.</p>
          </div>
        </div>
        <div className={styles.ruleCard}>
          <Sparkles size={20} />
          <div>
            <strong>Como evoluir mais rápido?</strong>
            <p>Priorize consistência: acerte mais vezes seguidas e complete quizzes inteiros.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
