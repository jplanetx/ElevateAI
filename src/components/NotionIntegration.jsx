import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { LoaderCircle } from 'lucide-react';

const NotionIntegration = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/notion/tasks');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const validatedTasks = data.map(task => ({
          id: task.id,
          name: task.properties?.Name?.title?.[0]?.plain_text || 'Untitled',
          energy: task.properties?.['Energy Required']?.number || 0,
          impact: task.properties?.Impact?.number || 0,
          status: task.properties?.Status?.status?.name || 'Pending'
        }));
        setTasks(validatedTasks);
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return <LoaderCircle className="animate-spin h-8 w-8 m-4" />;
  if (error) return <Alert variant="destructive"><AlertTitle>{error}</AlertTitle></Alert>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Tasks</h2>
      <div className="grid gap-4">
        {tasks.map(task => (
          <div key={task.id} className="p-4 border rounded-lg">
            <h3>{task.name}</h3>
            <p>Energy: {task.energy} | Impact: {task.impact}</p>
            <span className="text-sm">{task.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotionIntegration;