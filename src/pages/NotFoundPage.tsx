import { useNavigate } from 'react-router-dom';
import { Sprout, Home } from 'lucide-react';
import { Button } from '@/components/common';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-harvest-pale flex items-center justify-center text-harvest-primary shadow-soft">
        <Sprout className="w-8 h-8" />
      </div>
      <div>
        <h1 className="text-xl font-extrabold text-harvest-deep">Field Path Not Found</h1>
        <p className="text-xs text-harvest-muted mt-1 max-w-xs mx-auto">
          The requested screen or feature is not available. Let's head back to your farm dashboard.
        </p>
      </div>
      <Button
        variant="primary"
        iconLeft={<Home className="w-4 h-4" />}
        onClick={() => navigate('/')}
      >
        Return to Dashboard
      </Button>
    </div>
  );
};
