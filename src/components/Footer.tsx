import React from 'react';
import { PenSquare, Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center justify-center md:justify-start">
              <PenSquare className="h-6 w-6 text-blue-400" />
              <span className="ml-2 text-xl font-bold">BlogSpace</span>
            </div>
            <p className="mt-2 text-gray-400 text-sm text-center md:text-left">
              Share your thoughts with the world
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} BlogSpace. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;