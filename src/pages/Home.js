import { useState } from "react";
import { FaBars, FaHome, FaCog, FaUser } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import TaskList from "../components/task/TaskList";
import Header from "../components/task/Header";
import TaskFilter from "../components/task/TaskFilter";
import axios from "axios";
import CreateCategoryModal from "../components/task/CreateCategoryModal";
import CreateTaskModal from "../components/task/CreateTaskModal";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TaskCalenderModal from "../components/task/TaskCalenderModal";

const navigation = [
  { name: "Dashboard", href: "#", icon: FaHome, current: true },
  { name: "Profile", href: "#", icon: FaUser, current: false },
  { name: "Settings", href: "#", icon: FaCog, current: false },
];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profilePopoverOpen, setProfilePopoverOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [catLoading, setCatLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const limit = 3;

  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openCalender, setOpenCalender] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: "", category: null });

  const navigate = useNavigate();

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setOpen(true);
  };

  const handleCategoryEdit = (cat) => {
    setSelectedCategory(cat);
    setOpenModal(true);
  };

  const togglePopover = () => {
    setProfilePopoverOpen((prev) => !prev);
  };

  const fetchTasks = async (page, filters = {}) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = new URL(
        `https://task-manager-nodejs-nyyo.onrender.com/tasks/tasks`
      );

      url.searchParams.append("page", page);
      url.searchParams.append("limit", limit);

      if (filters.status) {
        url.searchParams.append("status", filters.status);
      }

      if (filters.category) {
        url.searchParams.append("category", filters.category);
      }

      const response = await axios.get(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(response.data.tasks);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    fetchTasks(value, filters);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchTasks(1, newFilters);
    setPage(1);
  };
  const fetchCategories = async () => {
    setCatLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://task-manager-nodejs-nyyo.onrender.com/categories/categories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories.");
    } finally {
      setCatLoading(false);
    }
  };

  const token = localStorage.getItem("token");

  const handleLog = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        {sidebarOpen && (
          <div className="fixed inset-0 flex z-40 md:hidden">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none"
                  onClick={() => setSidebarOpen(false)}
                >
                  <FiX className="h-6 w-6 text-black" />
                </button>
              </div>
              <div className="flex-shrink-0 flex items-center px-4 mt-5">
              <img
                src="https://i0.wp.com/9to5google.com/wp-content/uploads/sites/4/2018/03/google_tasks_leaked_icon.jpg?resize=1200%2C628&quality=82&strip=all&ssl=1"
                className="w-20"
              />
              <h1 className="text-xl font-bold font-mono">Task Manager</h1>
              </div>
              <nav className="mt-5 px-2 space-y-1">
              <TaskFilter
                catLoading={catLoading}
                error={error}
                categories={categories}
                fetchCategories={fetchCategories}
                handleCategoryEdit={handleCategoryEdit}
                onFilterChange={handleFilterChange}
              />
              </nav>
            </div>
          </div>
        )}

        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white shadow">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center h-16 flex-shrink-0 px-4">
              <img
                src="https://i0.wp.com/9to5google.com/wp-content/uploads/sites/4/2018/03/google_tasks_leaked_icon.jpg?resize=1200%2C628&quality=82&strip=all&ssl=1"
                className="w-20"
              />
              <h1 className="text-xl font-bold font-mono">Task Manager</h1>
            </div>
            <div className="flex-1 flex flex-col">
              <TaskFilter
                catLoading={catLoading}
                error={error}
                categories={categories}
                fetchCategories={fetchCategories}
                handleCategoryEdit={handleCategoryEdit}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 md:pl-64">
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
            <button
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-1 px-4 flex items-center justify-between">
              <div className="flex-1 flex">
                {token && (
                  <div
                    className="bg-gray-100 p-2 font-bold text-md cursor-pointer"
                    onClick={() => setOpenCalender(true)}
                  >
                    <h1 className="flex items-center gap-2">
                      <CalendarMonthIcon /> Task Calendar
                    </h1>
                  </div>
                )}
              </div>
              <div className="ml-4 flex items-center">
                <div className="ml-3 relative">
                  <div className="flex items-center space-x-3">
                    {token ? (
                      <p
                        className="text-sm font-medium text-rose-900 flex items-center gap-2 cursor-pointer"
                        onClick={handleLog}
                      >
                        <ExitToAppIcon /> Sign Out
                      </p>
                    ) : (
                      <p
                        className="text-sm font-medium text-gray-900 cursor-pointer"
                        onClick={() => navigate("/login")}
                      >
                        Sign In / Sign Up
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Header setOpen={setOpen} setOpenModal={setOpenModal} />
                <TaskList
                  tasks={tasks}
                  loading={loading}
                  totalPages={totalPages}
                  fetchTasks={fetchTasks}
                  page={page}
                  handlePageChange={handlePageChange}
                  handleEditClick={handleEditClick}
                  filters={filters}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
      <CreateTaskModal
        open={open}
        setOpen={setOpen}
        existingTask={selectedTask}
        isEditing={!!selectedTask}
        fetchCategories={fetchCategories}
        categories={categories}
        fetchTasks={fetchTasks}
      />
      <CreateCategoryModal
        open={openModal}
        setOpen={setOpenModal}
        existingCategory={selectedCategory}
        isEditing={!!selectedCategory}
        onRefresh={fetchCategories}
      />
      <TaskCalenderModal
        open={openCalender}
        setOpen={setOpenCalender}
        tasks={tasks}
      />
    </>
  );
}
