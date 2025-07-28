import React from "react";
import Link from "next/link";

const Header = () => (
  <header className="w-full py-4 px-8 bg-blue-50 shadow flex items-center justify-between">
    <div className="text-xl font-bold text-blue-900">MOSL</div>
    <nav className="flex gap-6">
      <Link href="/" className="text-blue-700 hover:underline">Home</Link>
      <Link href="/chart" className="text-blue-700 hover:underline">Chart</Link>
      <Link href="/login" className="text-blue-700 hover:underline">Login</Link>
    </nav>
  </header>
);

export default Header;
