import React, { useEffect, useState, useMemo } from "react";
import useTaskStore from "../stores/useTaskStore";
import useAuthStore from "../stores/useAuthStore";
import useLanguageStore from "../stores/useLanguageStore";
import { 
  Plus, Pencil, Trash2, CheckCircle, Clock, Loader2, 
  Calendar, Search, Filter, LayoutGrid, List, PieChart,
  ChevronRight, AlertCircle, CheckCircle2, Type, AlignLeft, Flag, X
} from "lucide-react";
import { Link } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import { th } from "date-fns/locale/th";
registerLocale("th", th);

const DashboardPage = () => {
  const { 
    tasks, fetchTasks, createTask, updateTask, deleteTask,
    filterStatus, setFilterStatus 
  } = useTaskStore();
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: "", description: "", priority: "medium", startDate: null, endDate: null });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Derived data
  const stats = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === "pending").length,
      completed: tasks.filter(t => t.status === "completed").length
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             task.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === "all" || task.status === filterStatus;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [tasks, searchQuery, filterStatus]);

  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setTaskForm({ 
        title: task.title, 
        description: task.description || "", 
        priority: task.priority,
        startDate: task.startDate ? new Date(task.startDate) : null,
        endDate: task.endDate ? new Date(task.endDate) : null
      });
    } else {
      setEditingTask(null);
      setTaskForm({ title: "", description: "", priority: "medium", startDate: null, endDate: null });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setTaskForm({ title: "", description: "", priority: "medium", startDate: null, endDate: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingTask) {
      // Ensure dates are parsed correctly if they are strings
      const payload = {
        ...taskForm,
        startDate: taskForm.startDate instanceof Date ? taskForm.startDate : (taskForm.startDate ? new Date(taskForm.startDate) : null),
        endDate: taskForm.endDate instanceof Date ? taskForm.endDate : (taskForm.endDate ? new Date(taskForm.endDate) : null)
      };
      await updateTask(editingTask._id, payload);
    } else {
      const payload = {
        ...taskForm,
        startDate: taskForm.startDate instanceof Date ? taskForm.startDate : (taskForm.startDate ? new Date(taskForm.startDate) : null),
        endDate: taskForm.endDate instanceof Date ? taskForm.endDate : (taskForm.endDate ? new Date(taskForm.endDate) : null)
      };
      await createTask(payload);
    }
    handleCloseModal();
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    await updateTask(task._id, { status: newStatus });
  };

  const isOverdue = (task) => {
    if (task.status === "completed" || !task.endDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(task.endDate);
    end.setHours(0, 0, 0, 0);
    return end < today;
  };

  const tasksByCategory = useMemo(() => {
    return {
      inProgress: filteredTasks.filter(t => t.status === "pending" && !isOverdue(t)),
      completed: filteredTasks.filter(t => t.status === "completed"),
      overdue: filteredTasks.filter(t => t.status === "pending" && isOverdue(t))
    };
  }, [filteredTasks]);

  const priorityColors = {
    low: "badge-success",
    medium: "badge-warning",
    high: "badge-error",
  };

  const TaskCard = ({ task }) => {
    const isList = viewMode === "list";
    
    if (isList) {
      return (
        <div
          key={task._id}
          className={`card bg-base-100 shadow-md border border-base-200 group hover:shadow-xl transition-all duration-300 rounded-2xl ${
            task.status === "completed" ? "bg-base-200/30 opacity-70" : ""
          }`}
        >
          <div className="card-body p-4 flex-row items-center gap-4">
            <button
              onClick={() => toggleStatus(task)}
              title={task.status === "completed" ? t("pending") : t("mark_done")}
              className={`flex-shrink-0 cursor-pointer w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                task.status === "completed" 
                  ? "bg-success border-success text-white" 
                  : isOverdue(task) ? "border-error/50 bg-error/5" : "border-base-content/20 bg-base-100 hover:border-primary"
              }`}
            >
              {task.status === "completed" && <CheckCircle size={12} strokeWidth={3} />}
            </button>

            <div className="flex-1 min-w-0">
              <Link to={`/task/${task._id}`} className="hover:text-primary transition-colors">
                <h3 className={`font-bold text-lg truncate ${task.status === "completed" ? "line-through text-base-content/30" : "text-base-content"}`}>
                  {task.title}
                </h3>
              </Link>
              <p className="text-xs text-base-content/50 truncate max-w-md">
                {task.description || t("no_description")}
              </p>
            </div>

            <div className="hidden md:flex flex-col items-end gap-1 px-4 border-l border-base-200 ml-auto">
               <span className="text-[10px] font-black uppercase opacity-30 tracking-widest">{t("priority")}</span>
               <div className={`badge ${priorityColors[task.priority]} badge-outline text-[9px] font-black uppercase px-2 py-0 h-5 rounded-lg`}>
                 {t(task.priority)}
               </div>
            </div>

            <div className="hidden lg:flex flex-col items-end gap-1 px-4 border-l border-base-200">
               <span className="text-[10px] font-black uppercase opacity-30 tracking-widest">{t("duration")}</span>
               <div className={`text-[10px] font-bold ${isOverdue(task) ? "text-error" : "text-primary/60"}`}>
                 {task.startDate ? new Date(task.startDate).toLocaleDateString() : '...'} - {task.endDate ? new Date(task.endDate).toLocaleDateString() : '...'}
               </div>
            </div>

            <div className="flex gap-1 ml-4 border-l border-base-200 pl-4">
              <button
                onClick={() => handleOpenModal(task)}
                title={t("save_edit")}
                className="btn btn-ghost btn-xs btn-circle text-info/50 hover:text-info hover:bg-info/10"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => deleteTask(task._id)}
                title={t("delete_confirm")}
                className="btn btn-ghost btn-xs btn-circle text-error/50 hover:text-error hover:bg-error/10"
              >
                <Trash2 size={14} />
              </button>
              <Link to={`/task/${task._id}`} title={t("details")} className="btn btn-ghost btn-xs btn-circle text-primary/50 hover:text-primary hover:bg-primary/10">
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={task._id}
        className={`card bg-base-100 shadow-xl border border-base-200 overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-[2rem] ${
          task.status === "completed" ? "bg-base-200/30" : ""
        }`}
      >
        <div className="card-body p-7">
          <div className="flex justify-between items-start mb-6">
            <div className={`badge ${priorityColors[task.priority]} badge-outline py-3 px-4 rounded-xl font-black text-[10px] uppercase tracking-wider`}>
              {t(task.priority)}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleOpenModal(task)}
                title={t("save_edit")}
                className="btn btn-ghost btn-sm btn-circle text-info/50 hover:text-info hover:bg-info/10 transition-colors"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => deleteTask(task._id)}
                title={t("delete_confirm")}
                className="btn btn-ghost btn-sm btn-circle text-error/50 hover:text-error hover:bg-error/10 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className="flex gap-4 items-start mb-4">
            <button
              onClick={() => toggleStatus(task)}
              title={task.status === "completed" ? t("pending") : t("mark_done")}
              className={`mt-1 flex-shrink-0 cursor-pointer w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                task.status === "completed" 
                  ? "bg-success border-success text-white scale-110 shadow-lg shadow-success/20" 
                  : isOverdue(task) ? "border-error/50 bg-error/5" : "border-base-content/20 bg-base-100 hover:border-primary"
              }`}
            >
              {task.status === "completed" && <CheckCircle size={14} strokeWidth={3} />}
            </button>
            <div className="flex-1 min-w-0">
              <Link to={`/task/${task._id}`}>
                <h3
                  className={`font-black text-2xl truncate transition-all leading-tight ${
                    task.status === "completed" ? "line-through text-base-content/30 italic" : "text-base-content"
                  }`}
                >
                  {task.title}
                </h3>
              </Link>
              <p
                className={`mt-3 text-base leading-relaxed line-clamp-2 min-h-[3rem] ${
                  task.status === "completed" ? "text-base-content/20" : "text-base-content/60"
                }`}
              >
                {task.description || t("no_description")}
              </p>
            </div>
          </div>

          <div className="divider opacity-10 my-4"></div>

          <div className="flex items-center justify-between">
             <div className="flex flex-col gap-1">
                <div className="flex items-center text-xs font-bold text-base-content/30">
                  <Calendar size={14} className="mr-2 text-primary" />
                  <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
                {(task.startDate || task.endDate) && (
                  <div className={`flex items-center text-[10px] font-black uppercase tracking-tighter ${isOverdue(task) ? "text-error" : "text-primary/60"}`}>
                    {task.startDate ? new Date(task.startDate).toLocaleDateString() : '...'} - {task.endDate ? new Date(task.endDate).toLocaleDateString() : '...'}
                    {isOverdue(task) && <span className="ml-2">({t("overdue")})</span>}
                  </div>
                )}
             </div>
             <Link 
                to={`/task/${task._id}`}
                className="btn btn-ghost btn-xs rounded-lg gap-1 hover:gap-2 transition-all font-black text-primary uppercase tracking-widest"
              >
               {t("details")} <ChevronRight size={14} />
             </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header & Welcome */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
            {t("hi")}, <span className="text-primary">{user?.fullname?.split(" ")[0] || "User"}!</span>
          </h1>
          <p className="text-base-content/60 mt-2 text-lg font-medium">{t("dashboard_subtitle")}</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="btn btn-primary btn-lg gap-3 shadow-xl shadow-primary/20 rounded-2xl w-full lg:w-auto hover:scale-105 transition-transform"
        >
          <Plus size={24} strokeWidth={3} /> {t("create_task")}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
        <div className="stats shadow-xl border border-base-200 bg-base-100 rounded-3xl p-2 relative overflow-hidden group">
          <div className="stat px-4 py-3">
            <div className="stat-figure text-primary/10 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform">
              <PieChart size={48} />
            </div>
            <div className="stat-title font-bold opacity-60 uppercase text-[10px] truncate">{t("stats_total")}</div>
            <div className="stat-value text-primary text-2xl">{stats.total}</div>
            <div className="stat-desc font-medium text-[9px] opacity-40">{t("stats_total_desc")}</div>
          </div>
        </div>
        <div className="stats shadow-xl border border-base-200 bg-base-100 rounded-3xl p-2 relative overflow-hidden group">
          <div className="stat px-4 py-3">
            <div className="stat-figure text-warning/10 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform">
              <Clock size={48} />
            </div>
            <div className="stat-title font-bold opacity-60 uppercase text-[10px] truncate">{t("stats_pending")}</div>
            <div className="stat-value text-warning text-2xl">{tasksByCategory.inProgress.length}</div>
            <div className="stat-desc font-medium text-[9px] opacity-40">{t("stats_pending_desc")}</div>
          </div>
        </div>
        <div className="stats shadow-xl border border-base-200 bg-base-100 rounded-3xl p-2 relative overflow-hidden group">
          <div className="stat px-4 py-3">
            <div className="stat-figure text-error/10 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform">
              <AlertCircle size={48} />
            </div>
            <div className="stat-title font-bold opacity-60 uppercase text-[10px] truncate">{t("overdue")}</div>
            <div className="stat-value text-error text-2xl">{tasksByCategory.overdue.length}</div>
            <div className="stat-desc font-medium text-[9px] opacity-40">{t("stats_overdue_desc")}</div>
          </div>
        </div>
        <div className="stats shadow-xl border border-base-200 bg-base-100 rounded-3xl p-2 relative overflow-hidden group">
          <div className="stat px-4 py-3">
             <div className="stat-figure text-success/10 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform">
              <CheckCircle size={48} />
            </div>
            <div className="stat-title font-bold opacity-60 uppercase text-[10px] truncate">{t("stats_completed")}</div>
            <div className="stat-value text-success text-2xl">{stats.completed}</div>
            <div className="stat-desc font-medium text-[9px] opacity-40">{t("stats_completed_desc")}</div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-base-200/50 p-4 rounded-3xl border border-base-200">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/40">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder={t("search")}
            className="input input-bordered w-full pl-12 bg-base-100/50 focus:bg-base-100 border-none shadow-inner rounded-2xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="join bg-base-100 rounded-2xl shadow-sm p-1 border border-base-200 flex-1 md:flex-none">
            <button 
              onClick={() => setFilterStatus("all")}
              className={`join-item btn btn-sm border-none rounded-xl grow md:grow-0 ${filterStatus === "all" ? "btn-primary shadow-lg" : "btn-ghost"}`}
            >
              {t("filter_all")}
            </button>
            <button 
              onClick={() => setFilterStatus("pending")}
              className={`join-item btn btn-sm border-none rounded-xl grow md:grow-0 ${filterStatus === "pending" ? "btn-primary shadow-lg" : "btn-ghost"}`}
            >
              {t("filter_pending")}
            </button>
            <button 
              onClick={() => setFilterStatus("completed")}
              className={`join-item btn btn-sm border-none rounded-xl grow md:grow-0 ${filterStatus === "completed" ? "btn-primary shadow-lg" : "btn-ghost"}`}
            >
              {t("filter_completed")}
            </button>
          </div>

          <div className="join bg-base-100 rounded-2xl shadow-sm p-1 border border-base-200 hidden sm:flex">
             <button onClick={() => setViewMode("grid")} className={`join-item btn btn-sm border-none rounded-xl ${viewMode === "grid" ? "btn-primary shadow-lg" : "btn-ghost"}`}>
                <LayoutGrid size={16} />
             </button>
             <button onClick={() => setViewMode("list")} className={`join-item btn btn-sm border-none rounded-xl ${viewMode === "list" ? "btn-primary shadow-lg" : "btn-ghost"}`}>
                <List size={16} />
             </button>
          </div>
        </div>
      </div>

      {/* Tabs / Columns Context */}
      <div className="space-y-12">
        {/* Overdue Section */}
        {tasksByCategory.overdue.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-error rounded-full"></div>
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                {t("overdue")} 
                <span className="badge badge-error text-white font-bold">{tasksByCategory.overdue.length}</span>
              </h2>
            </div>
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {tasksByCategory.overdue.map(task => <TaskCard task={task} />)}
            </div>
          </div>
        )}

        {/* In Progress Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-warning rounded-full"></div>
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              {t("in_progress")} 
              <span className="badge badge-warning text-white font-bold">{tasksByCategory.inProgress.length}</span>
            </h2>
          </div>
          {tasksByCategory.inProgress.length === 0 ? (
             <p className="text-base-content/30 italic px-5">{t("no_tasks")}</p>
          ) : (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {tasksByCategory.inProgress.map(task => <TaskCard task={task} />)}
            </div>
          )}
        </div>

        {/* Completed Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-success rounded-full"></div>
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              {t("completed_status")} 
              <span className="badge badge-success text-white font-bold">{tasksByCategory.completed.length}</span>
            </h2>
          </div>
          {tasksByCategory.completed.length === 0 ? (
             <p className="text-base-content/30 italic px-5">{t("no_tasks")}</p>
          ) : (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {tasksByCategory.completed.map(task => <TaskCard task={task} />)}
            </div>
          )}
        </div>
      </div>

      {/* Improved ClickUp-style Modal */}
      {isModalOpen && (
        <div className="modal modal-open flex items-center justify-center p-4">
          <div className="modal-box max-w-2xl bg-base-100 p-0 rounded-[2rem] border border-base-300 shadow-2xl relative overflow-visible">
            {/* Header with Close Button */}
            <div className="flex items-center justify-between p-6 border-b border-base-200">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    {editingTask ? <Pencil size={20} /> : <Plus size={24} />}
                  </div>
                  <h3 className="font-black text-2xl tracking-tight">
                    {editingTask ? t("save") : t("create_task")}
                  </h3>
               </div>
               <button 
                  onClick={handleCloseModal}
                  title={t("close")}
                  className="btn btn-sm btn-circle btn-ghost opacity-40 hover:opacity-100 hover:bg-base-200 transition-all"
               >
                 <X size={20} />
               </button>
            </div>
            
            <div className="p-8 lg:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Title Section */}
                <div className="form-control">
                  <label className="label pt-0 pb-3">
                    <span className="label-text font-black text-[10px] uppercase tracking-[0.2em] opacity-40 flex items-center gap-2">
                       <Type size={12} className="text-primary" /> {t("title")}
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder={t("title_placeholder")}
                    className="input input-lg w-full bg-base-200/50 border-none focus:bg-base-200 focus:ring-2 focus:ring-primary/20 rounded-2xl px-6 py-8 h-auto shadow-inner text-xl font-bold transition-all"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    required
                  />
                </div>

                {/* Description Section */}
                <div className="form-control">
                  <label className="label pt-0 pb-3">
                    <span className="label-text font-black text-[10px] uppercase tracking-[0.2em] opacity-40 flex items-center gap-2">
                       <AlignLeft size={12} className="text-secondary" /> {t("description")}
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered min-h-[120px] w-full bg-base-200/30 border-base-200 focus:bg-base-100 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl px-6 py-5 text-base font-medium shadow-sm transition-all resize-none"
                    placeholder="Write a few details about this task..."
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  ></textarea>
                </div>

                {/* Meta Grid: Dates & Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-base-200/20 rounded-[1.5rem] border border-base-200/50">
                  <div className="space-y-4">
                    <label className="label p-0">
                      <span className="label-text font-black text-[10px] uppercase tracking-[0.2em] opacity-40 flex items-center gap-2">
                         <Calendar size={12} /> Timeline
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                       <div className="relative group">
                          <label className="absolute top-2 left-4 text-[8px] font-black uppercase tracking-widest opacity-30 z-10">{t("start_date")}</label>
                          <DatePicker
                            selected={taskForm.startDate}
                            onChange={(date) => setTaskForm({ ...taskForm, startDate: date })}
                            className="input w-full bg-base-100 border border-base-200 group-hover:border-primary/30 focus:border-primary rounded-xl px-4 pt-6 pb-2 h-auto text-xs font-bold transition-all shadow-sm"
                            placeholderText={t("set_start")}
                            dateFormat="dd/MM/yyyy"
                            locale="th"
                          />
                       </div>
                       <div className="relative group">
                          <label className="absolute top-2 left-4 text-[8px] font-black uppercase tracking-widest opacity-30 z-10">{t("end_date")}</label>
                          <DatePicker
                            selected={taskForm.endDate}
                            onChange={(date) => setTaskForm({ ...taskForm, endDate: date })}
                            className="input w-full bg-base-100 border border-base-200 group-hover:border-secondary/30 focus:border-secondary rounded-xl px-4 pt-6 pb-2 h-auto text-xs font-bold transition-all shadow-sm"
                            placeholderText={t("set_end")}
                            dateFormat="dd/MM/yyyy"
                            minDate={taskForm.startDate}
                            locale="th"
                          />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="label p-0">
                      <span className="label-text font-black text-[10px] uppercase tracking-[0.2em] opacity-40 flex items-center gap-2">
                         <Flag size={12} /> {t("priority")}
                      </span>
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {["low", "medium", "high"].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setTaskForm({ ...taskForm, priority: p })}
                          className={`btn btn-sm grow h-11 rounded-xl border font-black uppercase text-[9px] tracking-widest transition-all ${
                            taskForm.priority === p 
                              ? p === "low" ? "bg-success/10 text-success border-success/30 shadow-sm" : 
                                p === "medium" ? "bg-warning/10 text-warning border-warning/30 shadow-sm" : 
                                "bg-error/10 text-error border-error/30 shadow-sm"
                              : "bg-base-100 border-base-200 text-base-content/30 opacity-60 hover:opacity-100 hover:bg-base-200"
                          }`}
                        >
                           {t(p)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={handleCloseModal} 
                    className="btn btn-ghost px-8 rounded-xl font-black uppercase text-[10px] tracking-[0.1em] opacity-40 hover:opacity-100 transition-all"
                  >
                    {t("cancel")}
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-wide btn-primary rounded-xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {editingTask ? t("save_edit") : t("create_task")}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="modal-backdrop bg-base-content/40 backdrop-blur-md" onClick={handleCloseModal}></div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
