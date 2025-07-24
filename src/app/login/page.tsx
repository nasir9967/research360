"use client";
import React from "react";
// Import NextAuth functions and hooks for authentication
import { signIn, signOut, useSession, SessionProvider } from "next-auth/react";

const LoginPageContent = () => {
  // useSession gets the current user's session and authentication status
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Login with Google</h1>
      {status !== "authenticated" ? (
        <button
          onClick={() => signIn("google")}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
        >
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_17_40)">
              <path d="M47.5 24.5C47.5 22.8 47.3 21.2 47 19.7H24V28.3H37.2C36.6 31.2 34.7 33.6 32 35.1V40.1H39.6C44.1 36.1 47.5 30.8 47.5 24.5Z" fill="#4285F4"/>
              <path d="M24 48C30.5 48 35.9 45.9 39.6 40.1L32 35.1C30.1 36.3 27.7 37 24 37C18.7 37 14.1 33.4 12.5 28.9H4.7V34.1C8.4 41.1 15.6 48 24 48Z" fill="#34A853"/>
              <path d="M12.5 28.9C12.1 27.7 11.9 26.4 11.9 25C11.9 23.6 12.1 22.3 12.5 21.1V15.9H4.7C3.2 18.6 2.5 21.7 2.5 25C2.5 28.3 3.2 31.4 4.7 34.1L12.5 28.9Z" fill="#FBBC05"/>
              <path d="M24 13C27.1 13 29.6 14.1 31.4 15.8L38.1 9.1C35.8 6.9 30.5 3.9 24 3.9C15.6 3.9 8.4 10.8 4.7 17.9L12.5 23.1C14.1 18.6 18.7 15 24 15V13Z" fill="#EA4335"/>
            </g>
            <defs>
              <clipPath id="clip0_17_40">
                <rect width="48" height="48" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          Sign in with Google
        </button>
        
      ) : (
        <div>
        <button
          onClick={() => signOut()}
          className="px-6 py-3 bg-red-600 text-white rounded shadow hover:bg-red-700 transition mb-4"
        >
          Logout
        </button>

        <p className="mt-6 font-semibold">User Details</p>
        <pre className="bg-gray-100 p-4 rounded w-full max-w-lg text-xs mt-2">
            {JSON.stringify(session, null, 2)}
        </pre>
        {/* Shows current session status (loading, authenticated, unauthenticated) */}
        <p className="text-gray-500 text-xs mt-2">Session status: {status}</p>
        </div>
      )
      
      }
      
    </div>
  );
};

// Wraps the content in SessionProvider so useSession works.
const LoginPage = () => (
  <SessionProvider>
    <LoginPageContent />
  </SessionProvider>
);

export default LoginPage;