'use client';
import { useState, useEffect  } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { FaBook, FaEnvelope, FaLock, FaUnlock, FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have user data and token exists
        const userData = localStorage.getItem('user');
        const response = await fetch('/api/verify-token', {
          method: 'GET',
          credentials: 'include' // Important for httpOnly cookies
        });

        if (response.ok && userData) {
          const user = JSON.parse(userData);
          const schoolPath = user.school_name.toLowerCase().replace(/\s+/g, '-');
          
          // Redirect based on role
          let redirectPath = '/';
          switch(user.role) {
            case 'superuser-school': redirectPath = `/${schoolPath}/superuser/dashboard`; break;
            case 'admin': redirectPath = `/${schoolPath}/admin/dashboard`; break;
            case 'teacher': redirectPath = `/${schoolPath}/teacher/dashboard`; break;
            case 'student': redirectPath = `/${schoolPath}/student/dashboard`; break;
            case 'parent': redirectPath = `/${schoolPath}/parent/dashboard`; break;
          }
          
          setIsRedirecting(true);
          await router.prefetch(redirectPath);
          router.push(redirectPath);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  const showErrorAlert = (message) => {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'Try Again',
      confirmButtonColor: '#6366f1',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showErrorAlert('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setIsRedirecting(false);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Save user data to localStorage (excluding the token)
      localStorage.setItem('user', JSON.stringify({
        name: data.user.name,
        role: data.user.role,
        school_name: data.user.school_name,
        school_id: data.user.school_id,
        user_id: data.user.user_id,
      }));

      // Format school name for URL (lowercase, replace spaces with hyphens)
      const schoolPath = data.user.school_name.toLowerCase().replace(/\s+/g, '-');
      console.log('School Path:', schoolPath);
      // Role-based redirection
      // Determine redirect path
      let redirectPath = '/';
      switch(data.user.role) {
        case 'superuser-school':
          redirectPath = `/${schoolPath}/superuser/dashboard`;
          break;
        case 'admin':
          redirectPath = `/${schoolPath}/admin/dashboard`;
          break;
        case 'teacher':
          redirectPath = `/${schoolPath}/teacher/dashboard`;
          break;
        case 'student':
          redirectPath = `/${schoolPath}/student/dashboard`;
          break;
        case 'parent':
          redirectPath = `/${schoolPath}/parent/dashboard`;
          break;
      }

      // Show we're starting the redirect
      setIsRedirecting(true);
      
      // Prefetch the dashboard page for smoother transition
      await router.prefetch(redirectPath);
      
      // Then perform the actual redirect
      router.push(redirectPath);
      
    } catch (err) {
      showErrorAlert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Reusable styles
  const cardStyles = 'bg-white rounded-xl shadow-2xl p-8 transition-all duration-300 hover:shadow-2xl';
  const inputStyles = 'block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 transition duration-200 text-gray-800';
  const buttonStyles = `w-full py-3 px-4 rounded-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ${
    isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
  }`;

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <ImSpinner8 className="animate-spin h-12 w-12 text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-700">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <ImSpinner8 className="animate-spin h-12 w-12 text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-700">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Schoolmate-AI | Login</title>
      </Head>
      
      {/* Background Container */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          
          {/* Logo Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaBook className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mt-4">Schoolmate-AI</h1>
            <p className="text-indigo-600 mt-1">AI-Powered School Management</p>
          </div>

          {/* Login Form Card */}
          <div className={cardStyles}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Welcome Back</h2>
            
            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="mb-5">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    className={inputStyles}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {showPassword ? (
                      <FaUnlock className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FaLock className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className={inputStyles}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                  type="submit" 
                  disabled={isLoading || isRedirecting} 
                  className={buttonStyles}
                >
                  {isLoading || isRedirecting ? (
                    <span className="flex items-center justify-center">
                      <ImSpinner8 className="animate-spin h-5 w-5 mr-3" />
                      {isRedirecting ? 'Loading Dashboard...' : 'Signing in...'}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center cursor-pointer">
                      <FaSignInAlt className="h-5 w-5 mr-2" />
                      Sign In
                    </span>
                  )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                Forgot password?
              </a>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>Don&apos;t have an account? <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">Contact admin</a></p>
          </div>
        </div>
      </div>
    </>
  );
}