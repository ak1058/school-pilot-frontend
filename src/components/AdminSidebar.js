'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { 
  FiHome, 
  FiUsers, 
  FiBook, 
  FiUserPlus, 
  FiSettings, 
  FiLogOut, 
  FiUser,
  FiX
} from 'react-icons/fi';

export default function AdminSidebar({ user, isOpen, onClose }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const schoolName = user?.school_name || 'Delhi Public School';
  const router = useRouter();
  const pathname = usePathname();
  
  const isActive = (href) => {
    return pathname === href;
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of the system',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      backdrop: 'rgba(79, 70, 229, 0.4)'
    });

    if (result.isConfirmed) {
      setIsLoggingOut(true);
      try {
        const response = await fetch('/api/logout', {
          method: 'POST',
          credentials: 'include'
        });

        if (response.ok) {
          localStorage.removeItem('user');
          localStorage.removeItem(`admins_${user.school_id}`);
          
          await Swal.fire({
            title: 'Logged out!',
            text: 'You have been successfully logged out',
            icon: 'success',
            confirmButtonColor: '#6366f1',
            timer: 2000,
            timerProgressBar: true
          });
          
          router.push('/login');
        } else {
          throw new Error('Logout failed');
        }
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: error.message || 'Logout failed',
          icon: 'error',
          confirmButtonColor: '#6366f1'
        });
      } finally {
        setIsLoggingOut(false);
      }
    }
  };

  return (
    <aside className={`
      fixed lg:relative z-30 w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      h-full
    `}>
      {/* Close button for mobile */}
      <button
        onClick={onClose}
        className="lg:hidden absolute right-4 top-4 p-1 text-gray-500 hover:text-gray-700"
      >
        <FiX className="h-5 w-5" />
      </button>
      
      <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-white-600 flex items-center justify-center overflow-hidden">
          <Image 
            src="/school-logo.jpeg"
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
          href={`/${schoolName}/admin/dashboard`}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
            isActive(`/${schoolName}/admin/dashboard`) 
              ? 'bg-indigo-50 text-indigo-700' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
          onClick={onClose}
        >
          <FiHome className="mr-3" />
          Dashboard
        </Link>
        
        <Link 
          href={`/${schoolName}/admin/students`}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
            isActive(`/${schoolName}/admin/students`) 
              ? 'bg-indigo-50 text-indigo-700' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
          onClick={onClose}
        >
          <FiUsers className="mr-3" />
          Students
        </Link>
        
        <Link 
          href={`/${schoolName}/admin/teachers`}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
            isActive(`/${schoolName}/admin/teachers`) 
              ? 'bg-indigo-50 text-indigo-700' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
          onClick={onClose}
        >
          <FiBook className="mr-3" />
          Teachers
        </Link>
        
        <Link 
          href={`/${schoolName}/admin/#`}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
            isActive(`/${schoolName}/admin/add-new`) 
              ? 'bg-indigo-50 text-indigo-700' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
          onClick={onClose}
        >
          <FiUserPlus className="mr-3" />
          Add New
        </Link>
        
        <Link 
          href={`/${schoolName}/admin/profile`}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
            isActive(`/${schoolName}/admin/profile`) 
              ? 'bg-indigo-50 text-indigo-700' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
          onClick={onClose}
        >
          <FiUser className="mr-3" />
          Update Profile
        </Link>
        
        <Link 
          href={`#`}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
            isActive(`#`) 
              ? 'bg-indigo-50 text-indigo-700' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
          onClick={onClose}
        >
          <FiSettings className="mr-3" />
          Settings
        </Link>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg cursor-pointer ${
            isLoggingOut ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <FiLogOut className="mr-3" />
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </aside>
  );
}