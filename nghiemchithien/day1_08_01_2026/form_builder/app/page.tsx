import { FormsList } from '@/components/FormsList';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Form Builder Dashboard</h1>
          <Link
            href="/editor/new"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <PlusCircle size={20} />
            Create New Form
          </Link>
        </div>

        <FormsList />
      </div>
    </div>
  );
}

