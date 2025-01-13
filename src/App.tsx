import { FilteredTaskList } from './components/FilteredTaskList';
import useNotionTasks from './hooks/useNotionTasks';

export default function App() {
  const { tasks } = useNotionTasks();

  return (
    <div>
      {/* Other app content */}
      <FilteredTaskList tasks={tasks} />
    </div>
  );
}
