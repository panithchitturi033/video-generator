
import React, { useState, useEffect, useCallback } from 'react';
import { AppState } from './types';
import { generateVideo } from './services/geminiService';
import Orb from './components/Orb';
import PromptForm from './components/PromptForm';
import VideoResult from './components/VideoResult';
import Loader from './components/Loader';
import { LogoIcon } from './components/icons';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [prompt, setPrompt] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleCreateVideo = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to create a video.');
      setAppState(AppState.ERROR);
      return;
    }
    setAppState(AppState.LOADING);
    setLoadingMessage('Warming up the creation engine...');
    setError(null);

    try {
      const url = await generateVideo(prompt, (message) => {
        setLoadingMessage(message);
      });
      setVideoUrl(url);
      setAppState(AppState.RESULT);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during video generation.');
      setAppState(AppState.ERROR);
    }
  }, [prompt]);

  const handleReset = useCallback(() => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setPrompt('');
    setVideoUrl(null);
    setError(null);
    setLoadingMessage('');
    setAppState(AppState.IDLE);
  }, [videoUrl]);
  
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);


  const renderContent = () => {
    switch (appState) {
      case AppState.IDLE:
        return <PromptForm prompt={prompt} setPrompt={setPrompt} onSubmit={handleCreateVideo} isLoading={false} />;
      case AppState.LOADING:
        return <Loader message={loadingMessage} />;
      case AppState.RESULT:
        return videoUrl ? <VideoResult videoUrl={videoUrl} onReset={handleReset} /> : null;
      case AppState.ERROR:
        return (
          <div className="text-center p-8 bg-red-500/20 backdrop-blur-lg rounded-xl border border-red-500/50 animate-fade-in">
            <h3 className="text-xl font-bold mb-2 text-red-400">Generation Failed</h3>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-golden-orange text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Try Again
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-gray-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-8 left-8 flex items-center gap-3">
        <LogoIcon />
        <h1 className="text-3xl font-bold tracking-tighter">Vidify AI</h1>
      </div>

      <div className="w-full h-96 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
         {(appState === AppState.IDLE || appState === AppState.LOADING) && <Orb isLoading={appState === AppState.LOADING} />}
      </div>
      
      <main className="z-10 w-full max-w-2xl flex flex-col items-center justify-center transition-all duration-500" style={{ minHeight: '400px' }}>
        {renderContent()}
      </main>

       <footer className="absolute bottom-4 text-gray-500 text-sm">
        Powered by Google Gemini.
      </footer>
    </div>
  );
};

export default App;
