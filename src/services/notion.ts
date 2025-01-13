interface NotionTask {
    id: string;
    properties: {
        Name: {
            title: Array<{ plain_text: string }>;
        };
        Status: {
            status: {
                name: string;
            };
        };
        "Energy Required": {
            select: {
                name: string;
            };
        };
    };
}

class NotionService {
    private apiUrl = 'http://localhost:3000/api';
    
    async getTasks() {
        try {
            console.log('Fetching tasks...');
            const response = await fetch(`${this.apiUrl}/tasks`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Failed to fetch tasks');
            }
            const tasks = await response.json();
            console.log(`Found ${tasks.length} tasks`);
            return tasks as NotionTask[];
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    }
    
    async addTask(title: string, energy: string) {
        try {
            const response = await fetch(`${this.apiUrl}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, energy }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Failed to create task');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error adding task:', error);
            throw error;
        }
    }
}

export const notionService = new NotionService();