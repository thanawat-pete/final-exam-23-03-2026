import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Sidebar from "../components/sidebar";
import useAuthStore from "../stores/useAuthStore";
import { Toaster } from "react-hot-toast";

const MainLayout = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-base-100 font-sans transition-colors duration-300">
      <Navbar />
      <div className="flex flex-1">
        {isAuthenticated && <Sidebar />}
        <main className={`flex-grow p-4 md:p-8 max-w-[1600px] ${isAuthenticated ? "mx-0" : "mx-auto w-full"}`}>
          <Outlet />
        </main>
      </div>
      {!isAuthenticated && <Footer />}
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            borderRadius: '20px',
            background: '#333',
            color: '#fff',
            fontWeight: 'bold'
          }
        }}
      />
    </div>
  );
};

export default MainLayout;
