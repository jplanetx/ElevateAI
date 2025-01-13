import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notionService } from '@/services/notion';

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">Something went wrong rendering this component.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Task Component with null checks
const Task: React.FC<{ task: any }> = ({ task }) => {
  const title = task?.properties?.Name?.title?.[0]?.plain_text ?? 'Untitled Task';
  const energy = task?.properties?.['Energy Required']?.select?.name ?? 'Not Set';
  const status = task?.properties?.Status?.status?.name ?? 'Unknown';

  return (
    <div className="bg-white p-4 rounded-md shadow flex justify-between items-center">
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">Energy: {energy}</p>
      </div>
      <span className="px-2 py-1 text-sm rounded bg-blue-100 text-blue-800">
        {status}
      </span>
    </div>
  );
};

export const TaskList: React.FC = () => {
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [selectedEnergy, setSelectedEnergy] = useState('Low');
    const queryClient = useQueryClient();

    // Fetch tasks
    const { data: tasks, isLoading, error } = useQuery({
        queryKey: ['tasks'],
        queryFn: () => notionService.getTasks(),
        retry: 2
    });

    // Add task mutation
    const addTaskMutation = useMutation({
        mutationFn: ({title, energy}: {title: string, energy: string}) => 
            notionService.addTask(title, energy),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setNewTaskTitle('');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskTitle.trim()) {
            addTaskMutation.mutate({
                title: newTaskTitle,
                energy: selectedEnergy
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-gray-500">Loading tasks...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-600">
                    Error loading tasks: {error instanceof Error ? error.message : 'Unknown error'}
                </p>
                <button 
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['tasks'] })}
                    className="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="space-y-6">
                {/* Add Task Form */}
                <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-md shadow">
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Enter new task..."
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <select
                        value={selectedEnergy}
                        onChange={(e) => setSelectedEnergy(e.target.value)}
                        className="block w-full p-2 border border-gray-300 rounded mt-2"
                    >
                        <option value="Very Low">Very Low Energy</option>
                        <option value="Low">Low Energy</option>
                        <option value="Medium">Medium Energy</option>
                        <option value="High">High Energy</option>
                        <option value="Very High">Very High Energy</option>
                    </select>
                    <button
                        type="submit"
                        disabled={addTaskMutation.isPending}
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {addTaskMutation.isPending ? 'Adding...' : 'Add Task'}
                    </button>
                </form>

                {/* Task List */}
                <div className="space-y-2">
                    {Array.isArray(tasks) ? (
                        tasks.map((task) => (
                            <ErrorBoundary key={task?.id ?? 'unknown'}>
                                <Task task={task} />
                            </ErrorBoundary>
                        ))
                    ) : (
                        <p className="text-gray-500">No tasks found</p>
                    )}
                </div>
            </div>
        </ErrorBoundary>
    );
};