
import React from 'react';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="text-center p-8 animate-fade-in">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-golden-orange mx-auto mb-4"></div>
      <p className="text-lg font-medium text-gray-300 transition-all duration-300">
        {message}
      </p>
    </div>
  );
};

export default Loader;
