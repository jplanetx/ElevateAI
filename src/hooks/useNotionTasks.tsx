
import { useEffect, useState } from 'react';

const useNotionTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_TASKS_DATABASE}/query`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json' 
          }
        });
        const data = await res.json();
        setTasks(data.results);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  return { tasks };
};

export default useNotionTasks;
