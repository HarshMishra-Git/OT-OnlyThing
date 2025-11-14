import { useEffect, useState } from 'react';
import Router from './Router';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set max loading time to 1 second
    const timer = setTimeout(() => {
      console.log('✅ App initialized');
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  );
}

export default App;