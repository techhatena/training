'use client';

import { FORM_ELEMENTS } from '@/lib/formElements';
import * as LucideIcons from 'lucide-react';
import React from 'react';

interface LeftSidebarProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormData: (data: any) => void;
}

export function LeftSidebar({ formData, setFormData }: LeftSidebarProps) {
    const handleDragStart = (e: React.DragEvent, elementType: string) => {
        e.dataTransfer.setData('elementType', elementType);
    };

    const renderIcon = (iconName: string) => {
        const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[iconName];
        if (!Icon) return <span className="text-xl">●</span>;
        return <Icon size={20} className="text-gray-600" />;
    };

    return (
        <div className="w-72 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 overflow-y-auto shadow-sm">
            <div className="p-5">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    Phần tử Form
                </h2>

                {/* Information Section */}
                <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Thông tin</h3>
                    <div className="space-y-2">
                        {FORM_ELEMENTS.information.map((element) => (
                            <div
                                key={element.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, element.type)}
                                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:border-blue-400 hover:bg-blue-50 hover:shadow-md transition-all duration-200 active:scale-95"
                            >
                                {renderIcon(element.icon)}
                                <span className="text-sm font-medium text-gray-700">{element.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Text Boxes Section */}
                <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Văn bản</h3>
                    <div className="space-y-2">
                        {FORM_ELEMENTS.textBoxes.map((element) => (
                            <div
                                key={element.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, element.type)}
                                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:border-blue-400 hover:bg-blue-50 hover:shadow-md transition-all duration-200 active:scale-95"
                            >
                                {renderIcon(element.icon)}
                                <span className="text-sm font-medium text-gray-700">{element.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Choices Section */}
                <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Lựa chọn</h3>
                    <div className="space-y-2">
                        {FORM_ELEMENTS.choices.map((element) => (
                            <div
                                key={element.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, element.type)}
                                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:border-blue-400 hover:bg-blue-50 hover:shadow-md transition-all duration-200 active:scale-95"
                            >
                                {renderIcon(element.icon)}
                                <span className="text-sm font-medium text-gray-700">{element.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
