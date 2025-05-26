import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {  ArrowUpRight } from 'lucide-react';

import error404Image from '../assets/error-404-illustration.png';

interface Error404FrameProps {
  onReturn?: () => void;
}

export const Error404Frame: React.FC<Error404FrameProps> = ({ onReturn }) => {
  const navigate = useNavigate();

  const handleReturn = () => {
    if (onReturn) {
      onReturn();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4">
      <div className="w-full max-w-xs text-center">
        {/* Ilustración - Reducido el height y eliminado el margin-top */}
        <div className="mx-auto w-64 h-48 relative">
          <div className="flex justify-center">
            <img 
              src={error404Image}
              alt="Error 404"
              className="h-48 object-contain"
            />
          </div>
        </div>
        
        {/* Texto */}
        <div className="mt-5">
          <h1 className="text-lg font-medium text-gray-900 mb-2">Error 404: Página no encontrada</h1>
          <p className="text-sm text-gray-600 mb-6">
            La página solicitada no se encuentra en nuestra base de datos.<br />
            Puedes probar el siguiente enlace:
          </p>
          <div className="flex justify-center">
            <Button 
              onClick={handleReturn}
              variant="outline" 
              size="sm"
              className="text-[#1E40AF] hover:text-[#1E40AF] border-[#1E40AF] hover:bg-blue-50 font-medium inline-flex items-center"
            >
              Ir al tablero
              <ArrowUpRight className="ml-2 h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404Frame;
