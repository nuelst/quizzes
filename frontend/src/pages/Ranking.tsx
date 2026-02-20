import { Inbox, LoaderCircle, Medal, Trophy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api';
import { useUser } from '../hooks/useUser';
import styles from './Ranking.module.css';

export function RankingPage() {
  const { user } = useUser();
  const {
    data: ranking = [],
    isLoading,
  } = useQuery({
    queryKey: ['ranking', 20],
    queryFn: () => authApi.ranking(20),
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <Trophy size={26} />
          <span>Ranking</span>
        </h1>
        <p className={styles.sub}>Os melhores jogadores de geografia do mundo</p>
      </div>

      {isLoading ? (
        <div className={styles.loading}>
          <LoaderCircle className={styles.loadingIcon} size={40} />
          <p>Carregando ranking...</p>
        </div>
      ) : ranking.length === 0 ? (
        <div className={styles.empty}>
          <Inbox size={40} />
          <p>Nenhum jogador ainda. Seja o primeiro!</p>
        </div>
      ) : (
        <div className={styles.list}>
          {ranking.map((entry, i) => {
            const isMe = user?.id === entry.id;
            return (
              <div
                key={entry.id}
                className={`${styles.row} ${i < 3 ? styles.top3 : ''} ${isMe ? styles.isMe : ''}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className={styles.position}>
                  {i < 3 ? <Medal className={styles.medalIcon} size={22} /> : <span className={styles.posNum}>{entry.position}</span>}
                </div>

                <div className={styles.info}>
                  <div className={styles.name}>
                    {entry.name}
                    {isMe && <span className={styles.youBadge}>você</span>}
                  </div>
                  <div className={styles.username}>@{entry.username}</div>
                </div>

                <div
                  className={styles.xp}
                  style={{ color: entry.xpPoints < 0 ? 'var(--red)' : entry.xpPoints === 0 ? 'var(--muted)' : 'var(--green)' }}
                >
                  {entry.xpPoints >= 0 ? '+' : ''}{entry.xpPoints} XP
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
