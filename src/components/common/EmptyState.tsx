import { Package } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState = ({ 
  title, 
  description, 
  icon,
  action 
}: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        {icon || <Package className="w-16 h-16 text-gray-400" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action && action}
    </div>
  );
};