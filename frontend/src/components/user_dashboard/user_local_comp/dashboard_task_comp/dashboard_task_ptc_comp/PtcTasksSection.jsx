import TasksBoardptc from "./TasksBoardptc";

const PtcTasksSection = ({ activeFilter = "ptc" }) => {
  const filter = activeFilter || "ptc";
  return <TasksBoardptc activeFilter={filter} />;
};

export default PtcTasksSection;
