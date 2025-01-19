import NotionIntegration from '../components/NotionIntegration';

export default function TasksPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      <NotionIntegration />
    </div>
  );
}