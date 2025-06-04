'use client';
import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiMoreVertical, FiUser, FiMail, FiKey  } from 'react-icons/fi';
import { BsArrowClockwise } from "react-icons/bs";
import { ImSpinner8 } from 'react-icons/im';
import Swal from 'sweetalert2';

export default function DashboardPage({ params }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [schoolId, setSchoolId] = useState(null); 
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin', // Default role for this dashboard
    school_id: '' 
  });

  const [admins, setAdmins] = useState([]);

  // Fetch admins with localStorage caching
  const fetchAdmins = async (forceRefresh = false) => {
    const loadingState = forceRefresh ? setIsRefreshing : setIsLoading;
    
    try {
      loadingState(true);
      
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData?.school_id) {
        throw new Error('School information not found in user data');
      }

      // Check cache unless forcing refresh
      const cacheKey = `admins_${userData.school_id}`;
      if (!forceRefresh && localStorage.getItem(cacheKey)) {
        const cachedAdmins = JSON.parse(localStorage.getItem(cacheKey));
        setAdmins(cachedAdmins);
        return;
      }

      // Fetch fresh data from API
      const response = await fetch(`/api/users?role=admin&schoolId=${userData.school_id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch admins');
      }
      
      const data = await response.json();
      
      // Update state and cache
      setAdmins(data);
      localStorage.setItem(cacheKey, JSON.stringify(data));
      setSchoolId(userData.school_id);
      setFormData(prev => ({ ...prev, school_id: userData.school_id }));
    } catch (error) {
      console.error('Fetch admins error:', error);
      
      // Show error to user
      await Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to fetch admins',
        icon: 'error',
        confirmButtonColor: '#6366f1',
      });
      
      // Clear cache if there's an error
      if (userData?.school_id) {
        localStorage.removeItem(`admins_${userData.school_id}`);
      }
    } finally {
      loadingState(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAdmins();
  }, []);

  // Manual refresh
  const handleRefresh = () => {
    fetchAdmins(true); // Force API call
  };

  // Set school_id from localStorage when component mounts
  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData && userData.school_id) {
        setSchoolId(userData.school_id);
        setFormData(prev => ({
          ...prev,
          school_id: userData.school_id
        }));
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate form data
      if (!formData.school_id) {
        throw new Error('School information not found. Please login again.');
      }

      if (!validateEmail(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      setIsCreating(true);
      
      // Create admin API call
      const response = await fetch('/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create admin');
      }

      // Show success message
      await Swal.fire({
        title: 'Success!',
        text: 'Admin created successfully',
        icon: 'success',
        confirmButtonColor: '#6366f1',
        timer: 2000
      });

      // Close modal and reset form
      setIsModalOpen(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'admin',
        school_id: schoolId
      });

      // Refresh the admin list
      await fetchAdmins(true);

    } catch (error) {
      console.error('Error creating admin:', error);
      await Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to create admin',
        icon: 'error',
        confirmButtonColor: '#6366f1'
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-gray-800">Superuser Dashboard</h1>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1 p-1 text-gray-500 hover:text-indigo-600 transition-colors disabled:opacity-50">
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
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
        >
          <FiPlus className="mr-2" />
          Create Admin
        </button>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <ImSpinner8 className="animate-spin text-indigo-600 text-2xl" />
          </div>
        ) : admins.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No admins available, Add New by Creating them....</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              Create New Admin
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admins.map((admin, index) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ADM-{admin.id.split('-')[0]}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.email}</td>
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

      {/* Create Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Admin</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Admin Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter admin name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiKey className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
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
                        'Create Admin'
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