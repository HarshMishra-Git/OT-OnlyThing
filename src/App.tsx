import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Router } from './Router';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <Router />
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
