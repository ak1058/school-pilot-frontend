"use client";
import Link from "next/link";
import { TypeAnimation } from "react-type-animation";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-indigo-50 to-white text-gray-900 px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl sm:text-6xl font-bold mb-4">
        Welcome to <span className="text-indigo-600">SchoolMate AI</span>
      </h1>

      <h2 className="text-xl sm:text-2xl max-w-xl mb-8">
        Your All-in-One <span className="text-indigo-600">AI-Powered</span>{" "}
        School Management Solution
      </h2>

      <TypeAnimation
        sequence={[
          "Manage attendance with ease.",
          1500,
          "AI-powered reports.",
          1500,
          "Smart scheduling.",
          1500,
          "Seamless parent-teacher communication.",
          1500,
        ]}
        wrapper="span"
        speed={50}
        repeat={Infinity}
        className="text-lg sm:text-xl text-gray-700 h-10 mb-10 block"
      />

      <Link
        href="/login"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full text-lg transition-all duration-200 shadow-md"
      >
        Get Started
      </Link>

      <div className="mt-16 text-sm text-gray-500 max-w-lg">
        SchoolMate AI helps schools manage everything — from attendance and schedules to performance analytics and parent communication — all enhanced by AI.
      </div>
    </main>
  );
}
