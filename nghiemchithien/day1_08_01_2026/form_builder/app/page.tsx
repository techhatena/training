/* eslint-disable @typescript-eslint/no-explicit-any */
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

      // Check for component collisions
      const components = jsonData.components;
      const collisions: string[] = [];

      for (let i = 0; i < components.length; i++) {
        for (let j = i + 1; j < components.length; j++) {
          const comp1 = components[i];
          const comp2 = components[j];

          const comp1Right = comp1.layout.x + comp1.layout.w;
          const comp1Bottom = comp1.layout.y + comp1.layout.h;
          const comp2Right = comp2.layout.x + comp2.layout.w;
          const comp2Bottom = comp2.layout.y + comp2.layout.h;

          // Check collision
          if (!(comp1Right <= comp2.layout.x || comp1.layout.x >= comp2Right ||
            comp1Bottom <= comp2.layout.y || comp1.layout.y >= comp2Bottom)) {
            collisions.push(`${comp1.type} và ${comp2.type}`);
          }
        }
      }

      // Check if components exceed canvas boundaries
      const canvasWidth = parseInt(jsonData.canvasConfig.width) || 800;
      const canvasHeight = parseInt(jsonData.canvasConfig.height) || 600;
      const outOfBounds: string[] = [];

      components.forEach((comp: any) => {
        const compRight = comp.layout.x + comp.layout.w;
        const compBottom = comp.layout.y + comp.layout.h;
        if (compRight > canvasWidth || compBottom > canvasHeight) {
          outOfBounds.push(comp.type);
        }
      });

      // Show warnings if issues found
      if (collisions.length > 0) {
        toast.error(`Phát hiện ${collisions.length} collision: ${collisions.slice(0, 3).join(', ')}${collisions.length > 3 ? '...' : ''}`);
      }

      if (outOfBounds.length > 0) {
        toast.error(`Phát hiện ${outOfBounds.length} component vượt khỏi canvas: ${outOfBounds.slice(0, 3).join(', ')}${outOfBounds.length > 3 ? '...' : ''}`);
      }

      // Still proceed with import but show warnings
      if (collisions.length > 0 || outOfBounds.length > 0) {
        toast.error('Form có vấn đề nhưng vẫn được import. Vui lòng kiểm tra và điều chỉnh!');
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

