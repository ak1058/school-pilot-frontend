'use client';
import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import SchoolHeader from '@/components/SchoolHeader';
import { ImSpinner8 } from 'react-icons/im';
import { FiMenu } from 'react-icons/fi';

const inter = Inter({ subsets: ['latin'] });

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 2. Verify token with backend
        const response = await fetch('/api/verify-token', {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Invalid token');
        }

        // 1. Check if we have user data in localStorage
        const userData = localStorage.getItem('user');
        if (JSON.parse(userData).role !== 'superuser-school') {
          throw new Error('Unauthorized access');
        }
        if (!userData) {
          throw new Error('No user data');
        }

        // 3. If valid, set user and continue
        setUser(JSON.parse(userData));
      } catch (error) {
        // 4. If any check fails, clear data and redirect
        localStorage.removeItem('user');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <ImSpinner8 className="animate-spin h-12 w-12 text-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return null; // Redirect will happen from useEffect
  }

  return (
    <div className={`flex h-screen bg-gray-50 ${inter.className}`}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <Sidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <SchoolHeader user={user}>
          <button
            className="lg:hidden p-2 text-gray-500 hover:text-gray-600"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu className="h-6 w-6" />
          </button>
        </SchoolHeader>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}