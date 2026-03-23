import React from "react";
import { CheckSquare } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded mt-auto">
      <nav className="grid grid-flow-col gap-4">
        <a className="link link-hover">About us</a>
        <a className="link link-hover">Contact</a>
        <a className="link link-hover">Jobs</a>
        <a className="link link-hover">Press kit</a>
      </nav>
      <aside>
        <div className="flex items-center gap-2 text-primary font-bold mb-4">
          <CheckSquare className="w-6 h-6" />
          <span>SE NPRU TaskFlow Mini</span>
        </div>
        <p>Copyright © {new Date().getFullYear()} - All right reserved by SE NPRU Team</p>
      </aside>
    </footer>
  );
};

export default Footer;