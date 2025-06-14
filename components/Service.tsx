import React from 'react';
import { Button } from './ui/button';

interface ServiceProps {
  imageUrl: string;
  title: string;
  description: string;
  buttonText?: string; // Optional prop with default value
}

const Service: React.FC<ServiceProps> = ({
  imageUrl,
  title,
  description,
  buttonText = 'Get Started', // Default value
}) => {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <a href="#">
        <img 
          className="rounded-t-lg w-full h-48 object-cover" 
          src={imageUrl} 
          alt={title} 
        />
      </a>
      <div className="p-5">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h5>
        </a>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {description}
        </p>
        <Button 
          className="w-full" 
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default Service;