import { useState, useEffect } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import TaskDetail from "../components/TaskDetail";
import { getTasks } from "../api/api";
import { Search, LayoutList, CircleCheck } from "lucide-react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [detailTaskId, setDetailTaskId] = useState(null);
  const [detailTask, setDetailTask] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetail = (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    if (task) {
      setDetailTask(task);
      setDetailTaskId(taskId);
      setOpenMenuId(null); // Đóng menu khi mở detail
    }
  };

  const handleMenuToggle = (taskId) => {
    setOpenMenuId(openMenuId === taskId ? null : taskId);
  };

  // Smart search function - tìm kiếm cả cụm và từng ký tự/từ
  const smartSearch = (text, query) => {
    const normalizedText = text.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    // 1. Exact substring match (tìm cụm liên tục) - VD: "2345" contains "34"
    if (normalizedText.includes(normalizedQuery)) {
      return true;
    }

    // 2. Fuzzy match - tất cả ký tự của query có trong text theo thứ tự
    // VD: "2345" matches "25" vì có '2' rồi '5' theo thứ tự
    let queryIndex = 0;
    for (
      let i = 0;
      i < normalizedText.length && queryIndex < normalizedQuery.length;
      i++
    ) {
      if (normalizedText[i] === normalizedQuery[queryIndex]) {
        queryIndex++;
      }
    }
    if (queryIndex === normalizedQuery.length) {
      return true;
    }

    // 3. Word match - tìm kiếm từng từ riêng biệt
    // VD: "Làm báo cáo" matches "báo cáo" hoặc "báo"
    const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length > 0);
    const textWords = normalizedText.split(/\s+/);
    const matchedWords = queryWords.filter((queryWord) =>
      textWords.some((textWord) => textWord.includes(queryWord))
    );
    if (matchedWords.length === queryWords.length && queryWords.length > 0) {
      return true;
    }

    return false;
  };

  const filteredTasks = tasks.filter((task) =>
    smartSearch(task.title, searchTerm)
  );

  const todoTasks = filteredTasks.filter((task) => !task.trangThai);
  const completedTasks = filteredTasks.filter((task) => task.trangThai);

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background:
          "linear-gradient(135deg, #1F4B2C 20%, #4D7111 40%, #6B8F22 60%, #88AD34 80%, #91B820 100%)",
      }}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Task Management
        </h1>

        {/* Search Bar & Add Task */}
        <div className="flex gap-0 mb-8 rounded-lg overflow-hidden">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm task"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white pl-12 pr-6 py-3 rounded-l-lg border-none focus:outline-none"
            />
          </div>
          <TaskForm
            onTaskAdded={fetchTasks}
            editingTaskId={editingTaskId}
            onCloseEdit={() => setEditingTaskId(null)}
            onCloseDetail={() => {
              setDetailTaskId(null);
              setDetailTask(null);
              setOpenMenuId(null); // Đóng menu khi mở Add Task
            }}
          />
        </div>

        {/* Task Boxes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Todo Box */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="relative flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500">
                <LayoutList className="text-white justify-center text-center" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-gray-800">To Do</h2>
                <span className=" text-sm text-gray-500">
                  {todoTasks.length} {todoTasks.length === 1 ? "task" : "tasks"}
                </span>
              </div>
            </div>
            <TaskList
              tasks={todoTasks}
              onTaskUpdated={fetchTasks}
              onEdit={setEditingTaskId}
              onShowDetail={handleShowDetail}
              openMenuId={openMenuId}
              onMenuToggle={handleMenuToggle}
              loading={loading}
            />
          </div>

          {/* Completed Box */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500">
                <CircleCheck size={24} className="text-white" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-gray-800">Completed</h2>
                <span className=" text-sm text-gray-500">
                  {completedTasks.length}{" "}
                  {completedTasks.length === 1 ? "task" : "tasks"}
                </span>
              </div>
            </div>
            <TaskList
              tasks={completedTasks}
              onTaskUpdated={fetchTasks}
              onEdit={setEditingTaskId}
              onShowDetail={handleShowDetail}
              openMenuId={openMenuId}
              onMenuToggle={handleMenuToggle}
              loading={loading}
            />
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      {detailTask && (
        <TaskDetail
          task={detailTask}
          isOpen={detailTaskId !== null}
          onClose={() => {
            setDetailTaskId(null);
            setDetailTask(null);
          }}
          onEdit={(taskId) => {
            setEditingTaskId(taskId);
            setDetailTaskId(null);
            setDetailTask(null);
          }}
        />
      )}
    </div>
  );
}
