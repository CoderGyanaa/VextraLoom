
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { HuntBuddyWidget } from '../HuntBuddyWidget';
import { CommandPalette } from '../CommandPalette';

export const AppShell = () => {
  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>
      <HuntBuddyWidget />
      <CommandPalette />
    </div>
  );
};
