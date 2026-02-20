import { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { authApi } from '../api';
import { useUser } from '../hooks/useUser';
import styles from './Login.module.css';

type Step = 'username' | 'register';

export function LoginPage() {
  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || '/quizzes';

  const [step, setStep] = useState<Step>('username');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUsernameSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setError('');

    try {
      const result = await authApi.session(username.toLowerCase().trim());
      login(result.user);
      navigate(from, { replace: true });
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.requiresName || err?.response?.status === 409) {
        setStep('register');
      } else {
        setError('Erro ao conectar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');

    try {
      const result = await authApi.session(username.toLowerCase().trim(), name.trim());
      login(result.user);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao criar perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}><Sparkles size={44} /></div>

        {step === 'username' ? (
          <>
            <h1 className={styles.title}>Bem-vindo ao Quizz</h1>
            <p className={styles.sub}>Digite seu username para entrar ou criar um perfil</p>

            <form className={styles.form} onSubmit={handleUsernameSubmit}>
              <div className={styles.field}>
                <label className={styles.label}>Username</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="ex: geo_master"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  pattern="[a-z0-9_]+"
                  minLength={3}
                  maxLength={20}
                  required
                  autoFocus
                />
                <span className={styles.hint}>Apenas letras minúsculas, números e _</span>
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button className={styles.btn} type="submit" disabled={loading}>
                {loading ? 'Verificando...' : 'Continuar →'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Criar perfil</h1>
            <p className={styles.sub}>
              O username <strong>@{username}</strong> está disponível!<br />
              Informe seu nome para criar o perfil.
            </p>

            <form className={styles.form} onSubmit={handleRegister}>
              <div className={styles.field}>
                <label className={styles.label}>Seu nome</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="ex: João Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  minLength={2}
                  maxLength={50}
                  required
                  autoFocus
                />
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button className={styles.btn} type="submit" disabled={loading}>
                {loading ? 'Criando perfil...' : 'Criar perfil e entrar →'}
              </button>

              <button
                type="button"
                className={styles.backBtn}
                onClick={() => { setStep('username'); setError(''); }}
              >
                ← Usar outro username
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
