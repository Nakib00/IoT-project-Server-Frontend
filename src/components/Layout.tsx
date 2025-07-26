import { ReactNode } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} IoT Dashboard. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};