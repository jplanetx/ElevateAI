import express from 'express';
import cors from 'cors';
import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const app = express();
const port = 3000;

// Notion client setup
const notion = new Client({
  auth: process.env.NOTION_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/tasks', async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_TASKS_DATABASE_ID,
      sorts: [
        {
          property: 'Energy Required',
          direction: 'ascending'
        }
      ]
    });
    
    console.log(`Found ${response.results.length} tasks`);
    res.json(response.results);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks', details: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  const { title, energy } = req.body;
  
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_TASKS_DATABASE_ID,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        "Energy Required": {
          select: {
            name: energy,
          },
        },
        Status: {
          status: {
            name: 'Pending'
          },
        },
      },
    });
    
    res.json(response);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});