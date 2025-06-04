'use client';
import { Inter } from 'next/font/google';
import TeacherSidebar from '@/components/TeacherSidebar';
import SchoolHeader from '@/components/SchoolHeader';

const inter = Inter({ subsets: ['latin'] });

export default function TeacherLayout({ children, params }) {
  return (
    <div className={`flex h-screen bg-gray-50 ${inter.className}`}>
      <TeacherSidebar schoolName={params.schoolName} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SchoolHeader schoolName={params.schoolName} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}