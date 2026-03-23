import { create } from "zustand";
import API from "../services/api";
import toast from "react-hot-toast";

const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  filterStatus: "all",

  setFilterStatus: (status) => set({ filterStatus: status }),

  fetchTasks: async () => {
    set({ loading: true });
    try {
      const response = await API.get("/task");
      if (response.data.success) {
        set({ tasks: response.data.tasks, error: null });
      }
    } catch (_) {
      set({ error: "Failed to fetch tasks" });
    } finally {
      set({ loading: false });
    }
  },

  createTask: async (taskData) => {
    try {
      const response = await API.post("/task", taskData);
      if (response.data.success) {
        set({ tasks: [response.data.task, ...get().tasks] });
        toast.success("Task created!");
      }
    } catch (_) {
      toast.error("Failed to create task");
    }
  },

  updateTask: async (id, taskData) => {
    try {
      const response = await API.put(`/task/${id}`, taskData);
      if (response.data.success) {
        const updatedTasks = get().tasks.map((t) => (t._id === id ? response.data.task : t));
        set({ tasks: updatedTasks });
        toast.success("Task updated!");
      }
    } catch (_) {
      toast.error("Failed to update task");
    }
  },

  deleteTask: async (id) => {
    try {
      const response = await API.delete(`/task/${id}`);
      if (response.data.success) {
        set({ tasks: get().tasks.filter((t) => t._id !== id) });
        toast.success("Task deleted!");
      }
    } catch (_) {
      toast.error("Failed to delete task");
    }
  },
}));

export default useTaskStore;
