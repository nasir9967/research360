import React from "react";

const Header = () => (
  <header className="w-full py-4 px-8 bg-blue-50 shadow flex items-center justify-between">
    <div className="text-xl font-bold text-blue-900">MOSL</div>
    <nav className="flex gap-6">
      <a href="/" className="text-blue-700 hover:underline">Home</a>
      <a href="/chart" className="text-blue-700 hover:underline">Chart</a>
      <a href="/login" className="text-blue-700 hover:underline">Login</a>
    </nav>
  </header>
);

export default Header;
