"use client";

import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="mb-4">
      <a className={`mr-4 ${pathname === "/" ? "text-black border-b" : ""}`} href="/">Riddle</a>
      {/* <a className={`mr-4 ${pathname === "/riddler" ? "text-black border-b" : ""}`} href="/riddler">Clean Interface</a> */}
    </nav>
  );
}