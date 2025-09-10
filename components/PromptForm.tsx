
import React from 'react';
import { CreateIcon } from './icons';

interface PromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const PromptForm: React.FC<PromptFormProps> = ({ prompt, setPrompt, onSubmit, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="w-full max-w-xl p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl animate-fade-in">
      <form onSubmit={handleSubmit}>
        <label htmlFor="prompt-input" className="block mb-3 text-lg font-medium text-gray-300">
          Describe the video you want to create
        </label>
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A majestic golden dragon soaring through a nebula"
          className="w-full h-28 p-4 bg-gray-900/50 border border-white/20 rounded-lg resize-none focus:ring-2 focus:ring-golden-orange focus:outline-none transition-all duration-300"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-golden-orange text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          <CreateIcon />
          <span>Create Video</span>
        </button>
      </form>
    </div>
  );
};

export default PromptForm;
