'use client';

import { FormsList } from '@/components/FormsList';
import { PlusCircle, Upload } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import toast from 'react-hot-toast';

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImportJson = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const jsonData = JSON.parse(content);

      // Validate structure
      if (!jsonData.name || !jsonData.canvasConfig || !Array.isArray(jsonData.components)) {
        toast.error('Cấu trúc file JSON không hợp lệ!');
        return;
      }

      // Save to database
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData),
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Nhập form thành công!');
        router.push(`/editor/${result.data._id}`);
      } else {
        toast.error('Lỗi khi nhập form!');
      }
    } catch (error) {
      console.error('Error importing JSON:', error);
      toast.error('Lỗi khi đọc file JSON!');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Form Builder Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <Upload size={20} />
              Nhập JSON
            </button>
            <Link
              href="/editor/new"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <PlusCircle size={20} />
              Create New Form
            </Link>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImportJson}
          className="hidden"
        />

        <FormsList />
      </div>
    </div>
  );
}

