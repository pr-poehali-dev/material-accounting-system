import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { path: '/materials', label: 'Материалы', icon: 'Package' },
    { path: '/orders', label: 'Заказы', icon: 'ShoppingCart' },
    { path: '/transactions', label: 'Операции', icon: 'Activity' },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <aside
        className={cn(
          'fixed top-0 left-0 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 z-50',
          isSidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
          {isSidebarOpen && (
            <div>
              <h2 className="text-xl font-bold">Учет материалов</h2>
              <p className="text-xs text-sidebar-foreground/70 mt-1">Система управления</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Icon name={isSidebarOpen ? 'ChevronLeft' : 'ChevronRight'} size={20} />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <div
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'hover:bg-sidebar-accent text-sidebar-foreground/90 hover:text-sidebar-foreground'
                  )}
                >
                  <Icon name={item.icon as any} size={20} />
                  {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center">
              <Icon name="User" size={20} className="text-sidebar-primary-foreground" />
            </div>
            {isSidebarOpen && (
              <div>
                <p className="font-medium text-sm">Администратор</p>
                <p className="text-xs text-sidebar-foreground/70">admin@system.ru</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className={cn('transition-all duration-300', isSidebarOpen ? 'ml-64' : 'ml-20')}>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
