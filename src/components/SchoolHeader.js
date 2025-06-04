import Image from 'next/image';

export default function SchoolHeader({ user, children }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center overflow-hidden">
            <Image 
              src="/school-logo.jpeg" 
              alt="School Logo" 
              width={40} 
              height={40}
              className="object-cover"
            />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">
            {user.school_name || 'Delhi Public School'}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {children}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600 hidden sm:inline-block">
              Hello, <span className="font-medium text-gray-800">{user?.name || 'User'}</span>
            </span>
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium border-2 border-indigo-200">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}