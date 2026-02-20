import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Sparkles, Trophy, Zap } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import styles from './Header.module.css';

export function Header() {
  const { user, logout, isLoggedIn } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');
  const isQuizzesActive = isActive('/quizzes') || isActive('/quiz');

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoIcon}><Sparkles size={20} /></span>
        <span className={styles.logoText}>Quizz</span>
      </Link>

      <nav className={styles.nav}>
        <Link to="/" className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}>Início</Link>
        <Link to="/quizzes" className={`${styles.navLink} ${isQuizzesActive ? styles.active : ''}`}>Quizzes</Link>
        <Link to="/ranking" className={`${styles.navLink} ${isActive('/ranking') ? styles.active : ''}`}>
          <Trophy size={14} />
          <span>Ranking</span>
        </Link>
      </nav>

      <div className={styles.right}>
        {isLoggedIn && user ? (
          <>
            <div className={styles.xpBadge}>
              <Zap size={14} />
              <span style={{ color: user.xpPoints < 0 ? '#ef4444' : 'inherit' }}>
                {user.xpPoints >= 0 ? '+' : ''}{user.xpPoints} XP
              </span>
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>@{user.username}</span>
              <button className={styles.logoutBtn} onClick={handleLogout} title="Sair">
                <LogOut size={13} />
              </button>
            </div>
          </>
        ) : (
          <Link to="/login" className={styles.loginBtn}>Entrar</Link>
        )}
      </div>
    </header>
  );
}
