import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useTaskStore from "../stores/useTaskStore";
import useLanguageStore from "../stores/useLanguageStore";
import { 
  ArrowLeft, Clock, CheckCircle, Calendar, Trash2, 
  Loader2, Tag, Info, AlertTriangle, ChevronRight
} from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguageStore();
  const { updateTask, deleteTask } = useTaskStore();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await API.get(`/task/${id}`);
        if (response.data.success) {
          setTask(response.data.task);
        }
      } catch (_) {
        toast.error("Task not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm(t("delete_confirm"))) {
      await deleteTask(id);
      navigate("/");
    }
  };

  const toggleStatus = async () => {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    await updateTask(id, { status: newStatus });
    setTask({ ...task, status: newStatus });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 animate-pulse">
        <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
        <p className="text-sm font-black uppercase tracking-widest opacity-30">Loading Task Details</p>
      </div>
    );
  }

  if (!task) return null;

  const priorityColors = {
    low: "bg-success/10 text-success border-success/20",
    medium: "bg-warning/10 text-warning border-warning/20",
    high: "bg-error/10 text-error border-error/20",
  };

  const priorityIcons = {
    low: <CheckCircle size={14} />,
    medium: <Info size={14} />,
    high: <AlertTriangle size={14} />,
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Link to="/" className="btn btn-ghost btn-sm gap-2 mb-8 hover:bg-base-200 rounded-xl group px-4">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
        <span className="font-bold">{t("back")}</span>
      </Link>

      <div className="card bg-base-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-base-200 overflow-hidden rounded-[3rem]">
        {/* Progress header bar */}
        <div className={`h-3 w-full transition-all duration-1000 ${task.status === "completed" ? "bg-success" : "bg-primary"}`}></div>
        
        <div className="card-body p-8 md:p-16">
          {/* Top Actions & Priority */}
          <div className="flex flex-wrap justify-between items-center gap-6 mb-10">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-black uppercase text-[10px] tracking-widest ${priorityColors[task.priority]}`}>
              {priorityIcons[task.priority]}
              {t(task.priority)} {t("priority")}
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleStatus} 
                className={`btn btn-md rounded-2xl px-6 gap-2 border-none transition-all shadow-lg hover:scale-105 ${
                  task.status === "completed" ? "btn-success shadow-success/20" : "btn-primary shadow-primary/20"
                }`}
              >
                 {task.status === "completed" ? <CheckCircle size={20} strokeWidth={3} /> : <Clock size={20} strokeWidth={3} />}
                 <span className="font-black uppercase text-xs">{task.status === "completed" ? t("completed") : t("mark_done")}</span>
              </button>
              
              <button 
                onClick={handleDelete} 
                className="btn btn-md btn-circle btn-ghost text-error/30 hover:text-error hover:bg-error/10 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          {/* Title Area */}
          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-[0.2em] opacity-40">
              <Tag size={12} /> Task Subject
            </div>
            <h1 className={`text-4xl md:text-6xl font-black leading-tight transition-all ${
              task.status === "completed" ? "line-through text-base-content/20 italic" : "text-base-content"
            }`}>
              {task.title}
            </h1>
          </div>

          {/* Description Box */}
          <div className="relative group">
            <div className={`absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-5 transition duration-500`}></div>
            <div className="relative bg-base-200/50 backdrop-blur-sm rounded-[2.5rem] p-8 md:p-12 min-h-[200px] border border-base-200">
               <div className="flex items-center gap-2 mb-6 font-black uppercase text-[10px] tracking-widest opacity-30">
                  <Info size={14} /> {t("description")}
               </div>
               <p className={`text-xl md:text-2xl leading-relaxed font-medium ${
                 task.status === "completed" ? "text-base-content/20" : "text-base-content/70"
               }`}>
                 {task.description || "No specific details provided for this task."}
               </p>
            </div>
          </div>

          {/* Metadata Footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-10 border-t border-base-200">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Calendar size={22} />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] uppercase font-black tracking-widest opacity-30">{t("created")}</p>
                <p className="font-bold text-base-content/60">{new Date(task.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                task.status === "completed" ? "bg-success/5 text-success" : "bg-warning/5 text-warning"
              }`}>
                {task.status === "completed" ? <CheckCircle size={22} /> : <Clock size={22} />}
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] uppercase font-black tracking-widest opacity-30">{t("status")}</p>
                <p className={`font-black uppercase tracking-tight ${
                  task.status === "completed" ? "text-success" : "text-warning"
                }`}>
                  {t(task.status)}
                </p>
              </div>
            </div>
          </div>

          {/* Task Duration Section */}
          {(task.startDate || task.endDate) && (
            <div className="mt-8 p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
              <div className="flex flex-col md:flex-row justify-around gap-6 text-center">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-30">{t("start_date")}</p>
                  <div className="flex items-center justify-center gap-2 text-lg font-black text-primary">
                    <Calendar size={18} />
                    {task.startDate ? new Date(task.startDate).toLocaleDateString() : "---"}
                  </div>
                </div>
                <div className="hidden md:flex items-center opacity-20">
                  <ChevronRight size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-30">{t("end_date")}</p>
                  <div className="flex items-center justify-center gap-2 text-lg font-black text-secondary">
                    <Calendar size={18} />
                    {task.endDate ? new Date(task.endDate).toLocaleDateString() : "---"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
