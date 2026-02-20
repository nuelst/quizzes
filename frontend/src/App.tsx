import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { RequireAuth } from './components/RequireAuth';
import { HomePage } from './pages/Home';
import { QuizzesPage } from './pages/Quizzes';
import { QuizPlayPage } from './pages/QuizPlay';
import { LoginPage } from './pages/Login';
import { RankingPage } from './pages/Ranking';
import { UserProvider } from './hooks/useUser';

export function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/ranking" element={<RankingPage />} />

          <Route path="/quizzes" element={<RequireAuth><QuizzesPage /></RequireAuth>} />
          <Route path="/quiz/:id" element={<RequireAuth><QuizPlayPage /></RequireAuth>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
