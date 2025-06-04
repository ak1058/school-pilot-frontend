'use client';
import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiMoreVertical, FiUser, FiMail, FiKey, FiSearch, FiFilter } from 'react-icons/fi';
import { BsArrowClockwise } from "react-icons/bs";
import { ImSpinner8 } from 'react-icons/im';
import Swal from 'sweetalert2';

export default function AdminDashboardPage({ }) {
  const [activeTab, setActiveTab] = useState('students');
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [schoolId, setSchoolId] = useState(null);

  // Form states
  const [studentFormData, setStudentFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    school_id: ''
  });

  const [teacherFormData, setTeacherFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'teacher',
    school_id: ''
  });

  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // Fetch students with localStorage caching
  const fetchStudents = async (schoolId, forceRefresh = false) => {
    const loadingState = forceRefresh ? setIsRefreshing : setIsLoading;
    
    try {
      loadingState(true);
      const cacheKey = `students_${schoolId}`;
      
      // Check cache unless forcing refresh
      if (!forceRefresh && localStorage.getItem(cacheKey)) {
        const cachedStudents = JSON.parse(localStorage.getItem(cacheKey));
        setStudents(cachedStudents);
        return;
      }

      // Fetch fresh data
      const response = await fetch(`/api/users?role=student&schoolId=${schoolId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch students');
      }

      const data = await response.json();
      const formattedStudents = data.map(student => ({
        ...student,
        class: student.class || '-',
        rollNo: student.rollNo || '-'
      }));

      setStudents(formattedStudents);
      localStorage.setItem(cacheKey, JSON.stringify(formattedStudents));
    } catch (error) {
      console.error('Error fetching students:', error);
      await Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to fetch students',
        icon: 'error',
        confirmButtonColor: '#6366f1',
      });
      
      // Clear cache if error occurs
      localStorage.removeItem(`students_${schoolId}`);
    } finally {
      loadingState(false);
    }
  };

  // Fetch teachers with localStorage caching
  const fetchTeachers = async (schoolId, forceRefresh = false) => {
    const loadingState = forceRefresh ? setIsRefreshing : setIsLoading;
    
    try {
      loadingState(true);
      const cacheKey = `teachers_${schoolId}`;
      
      // Check cache unless forcing refresh
      if (!forceRefresh && localStorage.getItem(cacheKey)) {
        const cachedTeachers = JSON.parse(localStorage.getItem(cacheKey));
        setTeachers(cachedTeachers);
        return;
      }

      // Fetch fresh data
      const response = await fetch(`/api/users?role=teacher&schoolId=${schoolId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch teachers');
      }

      const data = await response.json();
      const formattedTeachers = data.map(teacher => ({
        ...teacher,
        teacherId: teacher.id
      }));

      setTeachers(formattedTeachers);
      localStorage.setItem(cacheKey, JSON.stringify(formattedTeachers));
    } catch (error) {
      console.error('Error fetching teachers:', error);
      await Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to fetch teachers',
        icon: 'error',
        confirmButtonColor: '#6366f1',
      });
      
      // Clear cache if error occurs
      localStorage.removeItem(`teachers_${schoolId}`);
    } finally {
      loadingState(false);
    }
  };

  // Refresh both students and teachers
  const handleRefreshAll = async () => {
    try {
      setIsRefreshing(true);
      await Promise.all([
        fetchStudents(schoolId, true),
        fetchTeachers(schoolId, true)
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Get school_id from localStorage when component mounts
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.school_id) {
      setSchoolId(userData.school_id);
      setStudentFormData(prev => ({
        ...prev,
        school_id: userData.school_id
      }));
      setTeacherFormData(prev => ({
        ...prev,
        school_id: userData.school_id
      }));
      
      // Fetch data based on active tab
      if (activeTab === 'students') {
        fetchStudents(userData.school_id);
      } else {
        fetchTeachers(userData.school_id);
      }
    } else {
      setIsLoading(false);
      Swal.fire({
        title: 'Error',
        text: 'School information not found',
        icon: 'error',
        confirmButtonColor: '#6366f1',
      });
    }
  }, [activeTab]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleStudentInputChange = (e) => {
    const { name, value } = e.target;
    setStudentFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTeacherInputChange = (e) => {
    const { name, value } = e.target;
    setTeacherFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    
    try {
      // Validate form data
      if (!validateEmail(studentFormData.email)) {
        throw new Error('Please enter a valid email address');
      }
      
      if (studentFormData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      setIsCreating(true);
      
      const response = await fetch('/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create student');
      }

      // Show success message
      await Swal.fire({
        title: 'Success!',
        text: 'Student created successfully',
        icon: 'success',
        confirmButtonColor: '#6366f1',
        timer: 2000
      });

      // Refresh the student list
      await fetchStudents(schoolId, true);

      // Close modal and reset form
      setIsStudentModalOpen(false);
      setStudentFormData({
        name: '',
        email: '',
        password: '',
        role: 'student',
        school_id: schoolId 
      });

    } catch (error) {
      console.error('Error creating student:', error);
      await Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to create student',
        icon: 'error',
        confirmButtonColor: '#6366f1'
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    
    try {
      // Validate form data
      if (!validateEmail(teacherFormData.email)) {
        throw new Error('Please enter a valid email address');
      }
      
      if (teacherFormData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      setIsCreating(true);
      
      const response = await fetch('/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teacherFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create teacher');
      }

      // Show success message
      await Swal.fire({
        title: 'Success!',
        text: 'Teacher created successfully',
        icon: 'success',
        confirmButtonColor: '#6366f1',
        timer: 2000
      });

      // Refresh the teacher list
      await fetchTeachers(schoolId, true);

      // Close modal and reset form
      setIsTeacherModalOpen(false);
      setTeacherFormData({
        name: '',
        email: '',
        password: '',
        role: 'teacher',
        school_id: schoolId 
      });

    } catch (error) {
      console.error('Error creating teacher:', error);
      await Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to create teacher',
        icon: 'error',
        confirmButtonColor: '#6366f1'
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Filter students based on search and class filter
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter ? student.class === classFilter : true;
    return matchesSearch && matchesClass;
  });

  // Filter teachers based on search
  const filteredTeachers = teachers.filter(teacher => {
    return teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Get unique classes for filter dropdown
  const uniqueClasses = [...new Set(students.map(student => student.class))];


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="flex items-center gap-1 p-1 text-gray-500 hover:text-indigo-600 transition-colors disabled:opacity-50"
          >
            {isRefreshing ? (
              <>
                <ImSpinner8 className="animate-spin h-5 w-5" />
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <BsArrowClockwise className="h-5 w-5" />
                {/* <span>Refresh</span> */}
              </>
            )}
          </button>

        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsStudentModalOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 shadow-md hover:shadow-lg cursor-pointer"
          >
            <FiPlus className="mr-2" />
            Create Student
          </button>
          <button
            onClick={() => setIsTeacherModalOpen(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 shadow-md hover:shadow-lg cursor-pointer"
          >
            <FiPlus className="mr-2" />
            Create Teacher
          </button>
        </div>
      </div>
  
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'students' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 cursor-pointer'}`}
          onClick={() => setActiveTab('students')}
        >
          Students
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'teachers' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700 cursor-pointer'}`}
          onClick={() => setActiveTab('teachers')}
        >
          Teachers
        </button>
      </div>
  
      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {activeTab === 'students' && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="ml-4 flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <FiFilter className="mr-2" />
              Filters
            </button>
          )}
        </div>
  
        {/* Filters Dropdown - Only for Students */}
        {showFilters && activeTab === 'students' && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                >
                  <option value="">All Classes</option>
                  {uniqueClasses.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
  
      {/* Students Table */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <ImSpinner8 className="animate-spin h-8 w-8 text-indigo-600" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">No students found</p>
              <button
                onClick={() => setIsStudentModalOpen(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 shadow-md hover:shadow-lg cursor-pointer mx-auto"
              >
                <FiPlus className="mr-2" />
                Create Student
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student, index) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.rollNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.class}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center space-x-2">
                        <button className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50">
                          <FiTrash2 />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
                          <FiMoreVertical />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
  
      {/* Teachers Table */}
      {activeTab === 'teachers' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <ImSpinner8 className="animate-spin h-8 w-8 text-green-600" />
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">No teachers found</p>
              <button
                onClick={() => setIsTeacherModalOpen(true)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 shadow-md hover:shadow-lg cursor-pointer mx-auto"
              >
                <FiPlus className="mr-2" />
                Create Teacher
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTeachers.map((teacher, index) => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.teacherId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center space-x-2">
                        <button className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50">
                          <FiTrash2 />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
                          <FiMoreVertical />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
  
      {/* Create Student Modal */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Student</h2>
              
              <form onSubmit={handleCreateStudent}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="student-name" className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="student-name"
                        name="name"
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter student name"
                        value={studentFormData.name}
                        onChange={handleStudentInputChange}
                        required
                      />
                    </div>
                  </div>
  
                  <div>
                    <label htmlFor="student-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="student-email"
                        name="email"
                        type="email"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter email"
                        value={studentFormData.email}
                        onChange={handleStudentInputChange}
                        required
                      />
                    </div>
                  </div>
  
                  <div>
                    <label htmlFor="student-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiKey className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="student-password"
                        name="password"
                        type="password"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter password"
                        value={studentFormData.password}
                        onChange={handleStudentInputChange}
                        required
                      />
                    </div>
                  </div>
  
                  <div className="pt-2 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsStudentModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200 cursor-pointer"
                      disabled={isCreating}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 rounded-lg text-white flex items-center ${
                        isCreating ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                      } transition duration-200`}
                      disabled={isCreating}
                    >
                      {isCreating ? (
                        <>
                          <ImSpinner8 className="animate-spin mr-2" />
                          Creating...
                        </>
                      ) : (
                        'Create Student'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
  
      {/* Create Teacher Modal */}
      {isTeacherModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Teacher</h2>
              
              <form onSubmit={handleCreateTeacher}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="teacher-name" className="block text-sm font-medium text-gray-700 mb-1">Teacher Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="teacher-name"
                        name="name"
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter teacher name"
                        value={teacherFormData.name}
                        onChange={handleTeacherInputChange}
                        required
                      />
                    </div>
                  </div>
  
                  <div>
                    <label htmlFor="teacher-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="teacher-email"
                        name="email"
                        type="email"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter email"
                        value={teacherFormData.email}
                        onChange={handleTeacherInputChange}
                        required
                      />
                    </div>
                  </div>
  
                  <div>
                    <label htmlFor="teacher-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiKey className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="teacher-password"
                        name="password"
                        type="password"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter password"
                        value={teacherFormData.password}
                        onChange={handleTeacherInputChange}
                        required
                      />
                    </div>
                  </div>
  
                  <div className="pt-2 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsTeacherModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200 cursor-pointer"
                      disabled={isCreating}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 rounded-lg text-white flex items-center ${
                        isCreating ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 cursor-pointer'
                      } transition duration-200`}
                      disabled={isCreating}
                    >
                      {isCreating ? (
                        <>
                          <ImSpinner8 className="animate-spin mr-2" />
                          Creating...
                        </>
                      ) : (
                        'Create Teacher'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}