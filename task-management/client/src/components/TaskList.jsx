import TaskCard from "./TaskCard";

export default function TaskList({
  tasks,
  onTaskUpdated,
  onEdit,
  onShowDetail,
  openMenuId,
  onMenuToggle,
  loading,
}) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-gray-400 text-center">Không có task</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onTaskUpdated={onTaskUpdated}
          onEdit={onEdit}
          onShowDetail={onShowDetail}
          openMenuId={openMenuId}
          onMenuToggle={onMenuToggle}
        />
      ))}
    </div>
  );
}
