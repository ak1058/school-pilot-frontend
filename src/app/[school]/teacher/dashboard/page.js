'use client';
import { FiBook, FiCalendar, FiUsers, FiAward, FiBarChart2 } from 'react-icons/fi';

export default function TeacherDashboardPage({ params }) {
  // Mock data
  const classes = [
    { id: 1, name: 'Mathematics', class: '10A', students: 32, schedule: 'Mon/Wed/Fri 9:00-10:00' },
    { id: 2, name: 'Physics', class: '11B', students: 28, schedule: 'Tue/Thu 11:00-12:30' },
    { id: 3, name: 'Computer Science', class: '12C', students: 24, schedule: 'Mon/Fri 2:00-3:30' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Parent-Teacher Meeting', date: '2023-06-15', time: '2:00 PM' },
    { id: 2, title: 'Science Fair', date: '2023-06-20', time: '9:00 AM' },
  ];

  const performanceStats = [
    { id: 1, class: '10A Mathematics', average: 85, topStudent: 'Rahul Sharma (98%)' },
    { id: 2, class: '11B Physics', average: 78, topStudent: 'Priya Patel (95%)' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">Welcome back, Mr. Sharma!</h1>
        <p className="mt-2">You have 3 classes today with 84 students in total</p>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Classes Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FiBook className="mr-2" />
              Your Classes
            </h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-800">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {classes.map(cls => (
              <div key={cls.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{cls.name}</h3>
                    <p className="text-sm text-gray-500">{cls.class} • {cls.students} students</p>
                  </div>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                    {cls.schedule}
                  </span>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button className="text-xs px-3 py-1 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition duration-200">
                    View Students
                  </button>
                  <button className="text-xs px-3 py-1 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition duration-200">
                    Upload Materials
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
              <FiCalendar className="mr-2" />
              Upcoming Events
            </h2>
            <div className="space-y-4">
              {upcomingEvents.map(event => (
                <div key={event.id} className="border-l-4 border-indigo-500 pl-4 py-2">
                  <h3 className="font-medium text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-500">{event.date} at {event.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
              <FiBarChart2 className="mr-2" />
              Class Performance
            </h2>
            <div className="space-y-4">
              {performanceStats.map(stat => (
                <div key={stat.id} className="space-y-2">
                  <h3 className="font-medium text-gray-900">{stat.class}</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Average: <span className="font-medium">{stat.average}%</span></span>
                    <span className="text-gray-500">Top: <span className="font-medium">{stat.topStudent}</span></span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full" 
                      style={{ width: `${stat.average}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition duration-200 cursor-pointer">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-lg mr-4">
              <FiUsers className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Student Attendance</h3>
              <p className="text-sm text-gray-500">Mark today&apos;s attendance</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition duration-200 cursor-pointer">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <FiAward className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Submit Grades</h3>
              <p className="text-sm text-gray-500">Update student grades</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition duration-200 cursor-pointer">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <FiBook className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Lesson Plans</h3>
              <p className="text-sm text-gray-500">Create new lesson plan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}