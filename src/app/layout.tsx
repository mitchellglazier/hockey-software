import Sidebar from './components/SIdebar';
import { TeamProvider } from './context/TeamContext'
import './globals.css'

import Navbar from '@/app/components/Navbar'

export const metadata = {
  title: 'Hockey Software',
  description: 'NHL Data and Analytics',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TeamProvider>
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </TeamProvider>
      </body>
    </html>
  );
}

