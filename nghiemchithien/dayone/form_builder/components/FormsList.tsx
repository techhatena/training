'use client';

import { CraftState } from '@/models/Form';
import { Calendar, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Form {
    _id: string;
    name: string;
    craftState?: CraftState;
    updatedAt: string;
    createdAt: string;
}

// Helper function to count components in Craft.js state
function getComponentCount(craftState?: CraftState): number {
    if (!craftState) return 0;
    // Count nodes excluding ROOT and Container
    return Object.entries(craftState).filter(([nodeId, node]) => {
        const resolvedName = node.type?.resolvedName;
        return resolvedName && resolvedName !== 'Container' && nodeId !== 'ROOT';
    }).length;
}

export function FormsList() {
    const [forms, setForms] = useState<Form[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        try {
            const response = await fetch('/api/forms');
            const result = await response.json();
            if (result.success) {
                setForms(result.data);
            }
        } catch (error) {
            console.error('Error fetching forms:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteForm = async (id: string) => {
        const confirmed = await new Promise((resolve) => {
            toast((t) => (
                <div className="flex flex-col gap-3">
                    <p className="font-medium">Bạn có chắc chắn muốn xóa form này?</p>
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                resolve(false);
                            }}
                            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                resolve(true);
                            }}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            ), {
                duration: Infinity,
                style: {
                    background: '#fff',
                    color: '#000',
                },
            });
        });

        if (!confirmed) return;

        try {
            const response = await fetch(`/api/forms/${id}`, { method: 'DELETE' });
            const result = await response.json();
            if (result.success) {
                setForms(forms.filter(form => form._id !== id));
                toast.success('Xóa form thành công!');
            } else {
                toast.error('Xóa form thất bại!');
            }
        } catch (error) {
            console.error('Error deleting form:', error);
            toast.error('Có lỗi xảy ra khi xóa form!');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (forms.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No forms yet. Create your first form to get started!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
                <div
                    key={form._id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                >
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">{form.name}</h2>
                        <div className="flex gap-2">
                            <Link
                                href={`/editor/${form._id}`}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            >
                                <Edit size={18} />
                            </Link>
                            <button
                                onClick={() => deleteForm(form._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar size={16} className="mr-2" />
                        Updated: {new Date(form.updatedAt).toLocaleDateString()}
                    </div>

                    <div className="text-sm text-gray-600">
                        {getComponentCount(form.craftState)} component{getComponentCount(form.craftState) !== 1 ? 's' : ''}
                    </div>
                </div>
            ))}
        </div>
    );
}
