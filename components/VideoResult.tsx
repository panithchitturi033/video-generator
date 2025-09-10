
import React from 'react';
import { DownloadIcon, ResetIcon } from './icons';

interface VideoResultProps {
  videoUrl: string;
  onReset: () => void;
}

const VideoResult: React.FC<VideoResultProps> = ({ videoUrl, onReset }) => {
  return (
    <div className="w-full max-w-xl p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl animate-scale-in">
      <video
        src={videoUrl}
        controls
        autoPlay
        loop
        className="w-full rounded-lg aspect-video"
      />
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <a
          href={videoUrl}
          download="vidify-ai-video.mp4"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-golden-orange text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors"
        >
          <DownloadIcon />
          <span>Download Video</span>
        </a>
        <button
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-700/50 text-white font-bold rounded-lg hover:bg-gray-600/70 transition-colors"
        >
          <ResetIcon />
          <span>Create Another</span>
        </button>
      </div>
    </div>
  );
};

export default VideoResult;
