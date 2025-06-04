'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FiHome, FiBook, FiCalendar, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';

export default function TeacherSidebar({ user }) {
  const schoolName = user?.school_name || 'Delhi Public School';
  const pathname = usePathname();
  
  const isActive = (href) => pathname === href;

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center overflow-hidden">
          <Image 
            src="/school-logo.png"
            alt="School Logo"
            width={40}
            height={40}
            className="object-contain p-1"
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Schoolmate-AI</h2>
          <p className="text-xs text-gray-500">{schoolName || 'Delhi Public School'}</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link 
          href={`/${schoolName}/teacher/dashboard`}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
            isActive(`/${schoolName}/teacher/dashboard`) 
              ? 'bg-indigo-50 text-indigo-700' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <FiHome className="mr-3" />
          Dashboard
        </Link>
        
        <Link 
          href={`/${schoolName}/teacher/classes`}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
            isActive(`/${schoolName}/teacher/classes`) 
              ? 'bg-indigo-50 text-indigo-700' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <FiBook className="mr-3" />
          My Classes
        </Link>
        
        <Link 
          href={`/${schoolName}/teacher/schedule`}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
            isActive(`/${schoolName}/teacher/schedule`) 
              ? 'bg-indigo-50 text-indigo-700' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <FiCalendar className="mr-3" />
          Schedule
        </Link>
        
        <Link 
          href={`/${schoolName}/teacher/profile`}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
            isActive(`/${schoolName}/teacher/profile`) 
              ? 'bg-indigo-50 text-indigo-700' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <FiUser className="mr-3" />
          Update Profile
        </Link>
        
        <Link 
          href={`/${schoolName}/teacher/settings`}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
            isActive(`/${schoolName}/teacher/settings`) 
              ? 'bg-indigo-50 text-indigo-700' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <FiSettings className="mr-3" />
          Settings
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900">
          <FiLogOut className="mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
}