import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  CheckCircle2,
  Clock,
  PieChart
} from "lucide-react";
import useLanguageStore from "../stores/useLanguageStore";
import useTaskStore from "../stores/useTaskStore";

const Sidebar = () => {
  const { t } = useLanguageStore();
  const { filterStatus, setFilterStatus } = useTaskStore();
  const location = useLocation();

  const menuItems = [
    { name: t("dashboard"), path: "/", icon: <LayoutDashboard size={20} /> },
  ];

  return (
    <div className="w-64 bg-base-100 border-r border-base-200 flex flex-col h-[calc(100vh-64px)] overflow-y-auto hidden lg:flex sticky top-16">
      <div className="p-6 space-y-8">
        {/* Navigation */}
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-4">{t("search")}</p>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
                location.pathname === item.path 
                  ? "bg-primary text-primary-content shadow-lg shadow-primary/20 scale-105" 
                  : "hover:bg-base-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`${location.pathname === item.path ? "text-primary-content" : "text-primary"}`}>{item.icon}</span>
                <span className="font-bold text-sm">{item.name}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="divider opacity-10"></div>

        {/* Categories / Filters */}
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-4">Quick Filters</p>
          <div className="space-y-2">
             <button 
                onClick={() => setFilterStatus("all")}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-left transition-all ${
                  filterStatus === "all" ? "bg-primary/20 text-primary" : "bg-base-200/50 hover:bg-base-200"
                }`}
             >
                <div className={`p-1 rounded-lg ${filterStatus === "all" ? "bg-primary text-primary-content" : "bg-primary/10 text-primary"}`}>
                  <PieChart size={16}/>
                </div>
                <span className="font-bold text-sm tracking-tight">{t("stats_total")}</span>
                {filterStatus === "all" && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
             </button>

             <button 
                onClick={() => setFilterStatus("pending")}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-left transition-all ${
                  filterStatus === "pending" ? "bg-warning/20 text-warning-content" : "bg-base-200/50 hover:bg-base-200"
                }`}
             >
                <div className={`p-1 rounded-lg ${filterStatus === "pending" ? "bg-warning text-white" : "bg-warning/10 text-warning"}`}>
                  <Clock size={16}/>
                </div>
                <span className="font-bold text-sm tracking-tight">{t("stats_pending")}</span>
                {filterStatus === "pending" && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-warning" />}
             </button>

             <button 
                onClick={() => setFilterStatus("completed")}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-left transition-all ${
                  filterStatus === "completed" ? "bg-success/20 text-success-content" : "bg-base-200/50 hover:bg-base-200"
                }`}
             >
                <div className={`p-1 rounded-lg ${filterStatus === "completed" ? "bg-success text-white" : "bg-success/10 text-success"}`}>
                  <CheckCircle2 size={16}/>
                </div>
                <span className="font-bold text-sm tracking-tight">{t("stats_completed")}</span>
                {filterStatus === "completed" && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-success" />}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
