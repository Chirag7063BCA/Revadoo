import TasksBoardptc from "./TasksBoardptc";
import { ALL_TASK_FILTER } from "../taskSections";

const PtcTasksSection = ({ activeFilter = "ptc" }) => {
  const filter = activeFilter || "ptc";
  return <TasksBoardptc activeFilter={filter === "ptc" ? "ptc" : ALL_TASK_FILTER} />;
};

export default PtcTasksSection;
