import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import useThemeStore from "../stores/useThemeStore";
import useLanguageStore from "../stores/useLanguageStore";
import { LogOut, User, CheckSquare, Sun, Moon, Languages, Settings } from "lucide-react";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { lang, setLang, t } = useLanguageStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  return (
    <div className="navbar bg-base-100/70 backdrop-blur-xl sticky top-0 z-50 border-b border-base-200 px-4 md:px-10 h-16 min-h-[4rem]">
      {/* Brand Logo */}
      <div className="flex-1">
        <Link to="/" className="flex items-center gap-3 group transition-all">
          <div className="bg-primary text-primary-content p-2 rounded-xl shadow-lg shadow-primary/20 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
            <CheckSquare size={22} strokeWidth={3} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black tracking-tighter uppercase italic">
              SE NPRU <span className="text-primary not-italic">TaskFlow</span>
            </span>
            <span className="text-[10px] font-black tracking-widest opacity-30 group-hover:opacity-60 transition-opacity">UNIVERSITY LAB</span>
          </div>
        </Link>
      </div>

      {/* Right Side Actions */}
      <div className="flex-none flex items-center gap-1 md:gap-3">
        
        {/* Utilities Group */}
        <div className="flex items-center bg-base-200/50 rounded-2xl p-1 gap-1 border border-base-200/50">
          {/* Language Selector */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle hover:bg-base-100 rounded-xl transition-all">
              <Languages size={18} />
            </label>
            <ul tabIndex={0} className="mt-4 z-[100] p-2 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-[1.5rem] w-36 border border-base-200 animate-in fade-in zoom-in-95 duration-200">
              <li className="menu-title opacity-40 uppercase text-[10px] font-black tracking-widest pb-1">{t("search")}</li>
              <li>
                <button onClick={() => setLang("en")} className={`rounded-xl py-2 ${lang === "en" ? "bg-primary/10 text-primary font-black" : "font-bold"}`}>
                   🇺🇸 English
                </button>
              </li>
              <li>
                <button onClick={() => setLang("th")} className={`rounded-xl py-2 ${lang === "th" ? "bg-primary/10 text-primary font-black" : "font-bold"}`}>
                   🇹🇭 ภาษาไทย
                </button>
              </li>
            </ul>
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="btn btn-ghost btn-sm btn-circle hover:bg-base-100 rounded-xl transition-all"
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
          </button>
        </div>

        <div className="w-[1px] h-8 bg-base-200 mx-1 hidden md:block"></div>

        {/* Authentication / Profile Area */}
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar online p-0.5 hover:bg-transparent rounded-full active:scale-95 transition-transform">
                <div className="w-10 rounded-full border-2 border-primary/20 ring-2 ring-primary/5 ring-offset-2 ring-offset-base-100 shadow-lg">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullname)}&background=random&color=fff&bold=true`} 
                    alt="avatar" 
                  />
                </div>
              </label>
              <ul tabIndex={0} className="mt-4 z-[100] p-3 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-[2rem] w-64 border border-base-200 animate-in fade-in slide-in-from-top-2 duration-200">
                <li className="px-4 py-4 mb-2 bg-base-200/50 rounded-2xl border border-base-200/50">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-10 rounded-xl">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullname)}&background=random&color=fff&bold=true`} alt="avatar" />
                      </div>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-black truncate">{user?.fullname}</span>
                      <span className="text-[10px] opacity-40 truncate font-bold uppercase tracking-tighter">{user?.email}</span>
                    </div>
                  </div>
                </li>
                
                <li>
                  <Link to="/" className="flex items-center gap-3 py-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors">
                    <User size={18} /> <span className="font-bold">My Profile</span>
                  </Link>
                </li>
                <li>
                  <Link to="/" className="flex items-center gap-3 py-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors">
                    <Settings size={18} /> <span className="font-bold">Settings</span>
                  </Link>
                </li>
                
                <div className="divider opacity-10 my-1 px-2"></div>
                
                <li>
                  <button onClick={handleLogout} className="flex items-center gap-3 py-3 rounded-xl text-error hover:bg-error/5 transition-colors group">
                    <LogOut size={18} className="group-hover:translate-x-1 transition-transform" /> 
                    <span className="font-black uppercase text-xs tracking-widest">{t("logout")}</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/signin" className="btn btn-ghost btn-sm rounded-xl font-bold px-4">
              {t("signin")}
            </Link>
            <Link to="/signup" className="btn btn-primary btn-sm rounded-xl font-black px-6 shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              {t("signup")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;