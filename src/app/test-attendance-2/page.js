"use client"
import { useState, useEffect } from 'react';
import { FiCheck, FiX, FiArrowLeft, FiArrowRight, FiUsers, FiCheckCircle, FiAlertCircle, FiSearch } from 'react-icons/fi';
import Head from 'next/head';

// Dummy student data
const students = [
  { id: 1, rollNo: 1, name: 'Aarav Sharma', avatar: 'AS' },
  { id: 2, rollNo: 2, name: 'Bhavya Patel', avatar: 'BP' },
  { id: 3, rollNo: 3, name: 'Chetan Singh', avatar: 'CS' },
  { id: 4, rollNo: 4, name: 'Divya Reddy', avatar: 'DR' },
  { id: 5, rollNo: 5, name: 'Esha Gupta', avatar: 'EG' },
  { id: 6, rollNo: 6, name: 'Farhan Khan', avatar: 'FK' },
  { id: 7, rollNo: 7, name: 'Gayatri Joshi', avatar: 'GJ' },
  { id: 8, rollNo: 8, name: 'Harsh Verma', avatar: 'HV' },
  { id: 9, rollNo: 9, name: 'Ishaan Nair', avatar: 'IN' },
  { id: 10, rollNo: 10, name: 'Jhanvi Kapoor', avatar: 'JK' },
];

export default function AttendancePageV2() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attendance, setAttendance] = useState(
    students.reduce((acc, student) => ({ ...acc, [student.id]: null }), {})
  );
  const [showReport, setShowReport] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState(students);

  const currentStudent = filteredStudents[currentIndex];
  const presentCount = Object.values(attendance).filter(status => status === true).length;
  const absentCount = Object.values(attendance).filter(status => status === false).length;
  const remainingCount = filteredStudents.length - presentCount - absentCount;

  useEffect(() => {
    const results = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toString().includes(searchTerm)
    );
    setFilteredStudents(results);
    setCurrentIndex(0); // Reset to first student when search changes
  }, [searchTerm]);

  const markAttendance = (isPresent) => {
    setAttendance(prev => ({
      ...prev,
      [currentStudent.id]: isPresent
    }));
    
    // Auto-advance to next student if not last
    if (currentIndex < filteredStudents.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < filteredStudents.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const jumpToStudent = (index) => {
    setCurrentIndex(index);
  };

  const handleSubmit = () => {
    console.log('Attendance submitted:', { date, attendance });
    setShowReport(true);
  };

  const closeReport = () => {
    setShowReport(false);
  };

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col items-center" style={{ fontFamily: "'Roboto', sans-serif" }}>
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-[#000080] mb-1">Attendance</h1>
            <p className="text-[#0000FF] font-medium">Class 10th A • {new Date(date).toLocaleDateString()}</p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#000080]/70" />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#000080]/20 rounded-lg focus:ring-2 focus:ring-[#000080] focus:border-[#000080] outline-none font-medium"
            />
          </div>

          {/* Instagram Stories-like Roll Number Tray */}
          <div className="mb-6">
            <div className="flex overflow-x-auto pb-2 scrollbar-hide space-x-2">
              {filteredStudents.map((student, index) => (
                <div 
                  key={student.id} 
                  onClick={() => jumpToStudent(index)}
                  className={`flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center relative cursor-pointer transition-all
                    ${currentIndex === index ? 
                      'border-2 border-[#000080] scale-105' : 
                      'border border-gray-300 hover:border-[#000080]/50'}`}
                >
                  <span className="font-medium text-[#000080]">{student.rollNo}</span>
                  
                  {/* Attendance status badge */}
                  {attendance[student.id] !== null && (
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white
                      ${attendance[student.id] ? 'bg-green-500' : 'bg-red-500'}`}>
                      {attendance[student.id] ? 'P' : 'A'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Student Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#000080]/20 mb-6">
            <div className="bg-[#000080]/10 p-6 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#000080] text-white flex items-center justify-center text-2xl font-bold mb-4">
                {currentStudent.avatar}
              </div>
              <h2 className="text-xl font-bold text-[#000080]">{currentStudent.name}</h2>
              <p className="text-gray-600">Roll No: {currentStudent.rollNo}</p>
            </div>

            <div className="p-6 flex justify-between gap-4">
              <button
                onClick={() => markAttendance(false)}
                className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition
                  ${attendance[currentStudent.id] === false ? 
                    'bg-red-600 text-white' : 
                    'bg-red-100 text-red-800 hover:bg-red-200'}`}
              >
                <FiX size={20} /> Absent
              </button>
              <button
                onClick={() => markAttendance(true)}
                className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition
                  ${attendance[currentStudent.id] === true ? 
                    'bg-green-600 text-white' : 
                    'bg-green-100 text-green-800 hover:bg-green-200'}`}
              >
                <FiCheck size={20} /> Present
              </button>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between gap-4 mb-8">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className={`py-2 px-4 rounded-lg flex items-center gap-2 transition
                ${currentIndex === 0 ? 
                  'bg-gray-200 text-gray-400 cursor-not-allowed' : 
                  'bg-[#000080]/10 text-[#000080] hover:bg-[#000080]/20'}`}
            >
              <FiArrowLeft /> Previous
            </button>
            
            {currentIndex === filteredStudents.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="flex-1 py-2 px-4 bg-[#000080] hover:bg-[#0000FF] text-white rounded-lg font-medium transition"
              >
                Submit Attendance
              </button>
            ) : (
              <button
                onClick={goToNext}
                disabled={currentIndex === filteredStudents.length - 1}
                className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition
                  ${currentIndex === filteredStudents.length - 1 ? 
                    'bg-gray-200 text-gray-400 cursor-not-allowed' : 
                    'bg-[#000080]/10 text-[#000080] hover:bg-[#000080]/20'}`}
              >
                Next <FiArrowRight />
              </button>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-[#000080]/10">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-green-600 font-medium">Present: {presentCount}</span>
              <span className="text-red-600 font-medium">Absent: {absentCount}</span>
              <span className="text-gray-600">Remaining: {remainingCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-[#000080] h-2.5 rounded-full" 
                style={{ width: `${((presentCount + absentCount) / filteredStudents.length) * 100}%` }}
              ></div>
            </div>
            <div className="mt-2 text-center text-sm text-gray-500">
              {currentIndex + 1} of {filteredStudents.length} students
            </div>
          </div>
        </div>

        {/* Submission Report Modal */}
        {showReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-pop-in">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheckCircle className="text-green-600 text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Attendance Submitted!</h3>
                <p className="text-gray-600">For Class 10th A on {new Date(date).toLocaleDateString()}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="text-green-800 font-medium">Total Present</span>
                  <span className="text-green-800 font-bold">{presentCount}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                  <span className="text-red-800 font-medium">Total Absent</span>
                  <span className="text-red-800 font-bold">{absentCount}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#000080]/10 rounded-lg">
                  <span className="text-[#000080] font-medium">Class Strength</span>
                  <span className="text-[#000080] font-bold">{filteredStudents.length}</span>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={closeReport}
                  className="px-6 py-2 bg-[#000080] hover:bg-[#0000FF] text-white font-medium rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}