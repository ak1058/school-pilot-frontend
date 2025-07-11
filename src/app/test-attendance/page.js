"use client"
import { useState } from 'react';
import { FiCheck, FiX, FiCalendar, FiFilter, FiSearch, FiUsers, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Head from 'next/head';

// Dummy student data
const students = [
  { id: 1, rollNo: 1, name: 'Aarav Sharma' },
  { id: 2, rollNo: 2, name: 'Bhavya Patel' },
  { id: 3, rollNo: 3, name: 'Chetan Singh' },
  { id: 4, rollNo: 4, name: 'Divya Reddy' },
  { id: 5, rollNo: 5, name: 'Esha Gupta' },
  { id: 6, rollNo: 6, name: 'Farhan Khan' },
  { id: 7, rollNo: 7, name: 'Gayatri Joshi' },
  { id: 8, rollNo: 8, name: 'Harsh Verma' },
  { id: 9, rollNo: 9, name: 'Ishaan Nair' },
  { id: 10, rollNo: 10, name: 'Jhanvi Kapoor' },
];

export default function AttendancePage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [attendance, setAttendance] = useState(
    students.reduce((acc, student) => ({ ...acc, [student.id]: false }), {})
  );
  const [showReport, setShowReport] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const markAllPresent = () => {
    const allPresent = {};
    students.forEach(student => {
      allPresent[student.id] = true;
    });
    setAttendance(allPresent);
  };

  const markAllAbsent = () => {
    const allAbsent = {};
    students.forEach(student => {
      allAbsent[student.id] = false;
    });
    setAttendance(allAbsent);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toString().includes(searchTerm)
  );

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const absentCount = students.length - presentCount;

  const handleSubmit = () => {
    // Here you would typically send the attendance data to your backend
    console.log('Attendance submitted:', { date, attendance });
    setIsSubmitted(true);
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
      
      <div className="min-h-screen bg-gray-50 p-4 md:p-8" style={{ fontFamily: "'Roboto', sans-serif" }}>
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#000080]">Attendance Management</h1>
              <p className="text-[#0000FF] font-medium">Class 10th A - {new Date(date).toLocaleDateString()}</p>
            </div>
            
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-[#000080]/20">
              <FiCalendar className="text-[#000080]" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-[#000080] font-medium"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button 
              onClick={markAllPresent}
              className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg flex items-center gap-2 transition font-medium"
            >
              <FiCheckCircle /> Mark All Present
            </button>
            <button 
              onClick={markAllAbsent}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg flex items-center gap-2 transition font-medium"
            >
              <FiAlertCircle /> Mark All Absent
            </button>
            <div className="px-4 py-2 bg-[#000080]/10 text-[#000080] rounded-lg flex items-center gap-2 font-medium">
              <FiUsers /> Total: {students.length} students
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-[#000080]/20">
            <div className="p-4 border-b border-[#000080]/10 flex flex-col md:flex-row gap-3 items-start md:items-center">
              <div className="relative flex-grow">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#000080]/70" />
                <input
                  type="text"
                  placeholder="Search by name or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#000080]/20 rounded-lg focus:ring-2 focus:ring-[#000080] focus:border-[#000080] outline-none font-medium"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#000080]/10 hover:bg-[#000080]/20 text-[#000080] rounded-lg transition font-medium">
                <FiFilter />
                <span>Filter</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#000080]/10 text-[#000080] text-left">
                  <tr>
                    <th className="p-4 font-medium">Roll No</th>
                    <th className="p-4 font-medium">Student Name</th>
                    <th className="p-4 font-medium text-center">Status</th>
                    <th className="p-4 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#000080]/10">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-[#000080]/5 transition">
                      <td className="p-4 font-medium text-[#000080]">{student.rollNo}</td>
                      <td className="p-4 font-medium text-gray-800">{student.name}</td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${attendance[student.id] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {attendance[student.id] ? 'Present' : 'Absent'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => toggleAttendance(student.id)}
                          className={`p-2 rounded-full ${attendance[student.id] ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'} transition`}
                        >
                          {attendance[student.id] ? <FiX size={18} /> : <FiCheck size={18} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary and Submit */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 bg-green-50 text-green-800 rounded-lg flex items-center gap-2 font-medium">
                <FiCheckCircle /> Present: {presentCount}
              </div>
              <div className="px-4 py-2 bg-red-50 text-red-800 rounded-lg flex items-center gap-2 font-medium">
                <FiAlertCircle /> Absent: {absentCount}
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-[#000080] hover:bg-[#0000FF] text-white font-medium rounded-lg shadow-md transition flex items-center gap-2"
            >
              <FiCheckCircle size={18} /> Submit Attendance
            </button>
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
                    <span className="text-[#000080] font-bold">{students.length}</span>
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
      </div>
    </>
  );
}