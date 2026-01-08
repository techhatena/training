/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { DEFAULT_COMPONENT_PROPS, DEFAULT_STYLES } from '@/lib/formElements';
import { IFormComponent } from '@/models/Form';
import { Trash2 } from 'lucide-react';
import { useRef } from 'react';
import { ComponentRenderer } from './ComponentRenderer';

interface CanvasProps {
    formData: any;
    setFormData: (data: any) => void;
    activeComponent: string | null;
    setActiveComponent: (id: string | null) => void;
    deleteComponent: (id: string) => void;
}

export function Canvas({
    formData,
    setFormData,
    activeComponent,
    setActiveComponent,
    deleteComponent,
}: CanvasProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const dragOffsetRef = useRef({ x: 0, y: 0 });

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();

        // Check if it's an existing component being moved
        const componentId = e.dataTransfer.getData('componentId');
        if (componentId) {
            const comp = formData.components.find((c: IFormComponent) => c.id === componentId);
            if (comp) {
                // Calculate position with drag offset
                let x = e.clientX - rect.left - dragOffsetRef.current.x;
                let y = e.clientY - rect.top - dragOffsetRef.current.y;

                // Bounds checking - prevent component from going outside canvas
                const maxX = rect.width - comp.layout.w - 20;
                const maxY = rect.height - comp.layout.h - 20;
                x = Math.max(0, Math.min(x, maxX));
                y = Math.max(0, Math.min(y, maxY));

                // Moving existing component
                setFormData({
                    ...formData,
                    components: formData.components.map((c: IFormComponent) =>
                        c.id === componentId
                            ? { ...c, layout: { ...c.layout, x, y } }
                            : c
                    ),
                });
            }
            return;
        }

        // Otherwise, it's a new element from sidebar
        const elementType = e.dataTransfer.getData('elementType');
        if (!elementType) return;

        const defaultWidth = 400;
        const defaultHeight = 80;

        // For new elements, place at cursor position
        let x = e.clientX - rect.left - defaultWidth / 2;
        let y = e.clientY - rect.top - 20;

        // Bounds checking for new component
        const maxX = rect.width - defaultWidth - 20;
        const maxY = rect.height - defaultHeight - 20;
        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));

        const newComponent: IFormComponent = {
            id: `${elementType}-${Date.now()}`,
            type: elementType,
            properties: { ...DEFAULT_COMPONENT_PROPS[elementType] },
            layout: { x, y, w: defaultWidth, h: defaultHeight },
            styles: { ...DEFAULT_STYLES },
        };

        setFormData({
            ...formData,
            components: [...formData.components, newComponent],
        });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleComponentClick = (componentId: string) => {
        setActiveComponent(componentId);
    };

    const handleComponentDragStart = (e: React.DragEvent, component: IFormComponent) => {
        e.dataTransfer.setData('componentId', component.id);
        e.dataTransfer.effectAllowed = 'move';
        e.stopPropagation();

        // Calculate offset from mouse position to component's top-left corner
        const target = e.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        dragOffsetRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handleComponentDrag = (e: React.DragEvent) => {
        e.stopPropagation();
    };

    const handleComponentDragEnd = (e: React.DragEvent) => {
        e.stopPropagation();
    };

    const handleCanvasClick = (e: React.MouseEvent) => {
        // Only deselect if clicking directly on canvas, not on a component
        if (e.target === e.currentTarget || (e.target as HTMLElement).closest('[data-canvas-bg]')) {
            setActiveComponent(null);
        }
    };

    const handleResizeMouseDown = (e: React.MouseEvent, component: IFormComponent, direction: string) => {
        e.preventDefault();
        e.stopPropagation();

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = component.layout.w;
        const startHeight = component.layout.h;
        const startLeft = component.layout.x;
        const startTop = component.layout.y;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!canvasRef.current) return;

            const rect = canvasRef.current.getBoundingClientRect();
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;

            let newWidth = startWidth;
            let newHeight = startHeight;
            let newX = startLeft;
            let newY = startTop;

            // Calculate new dimensions based on resize direction
            if (direction.includes('e')) {
                newWidth = Math.max(100, startWidth + deltaX);
            }
            if (direction.includes('w')) {
                newWidth = Math.max(100, startWidth - deltaX);
                newX = startLeft + deltaX;
            }
            if (direction.includes('s')) {
                newHeight = Math.max(60, startHeight + deltaY);
            }
            if (direction.includes('n')) {
                newHeight = Math.max(60, startHeight - deltaY);
                newY = startTop + deltaY;
            }

            // Bounds checking - prevent resize beyond canvas boundaries
            const maxWidth = rect.width - newX - 20;
            const maxHeight = rect.height - newY - 20;
            newWidth = Math.min(newWidth, maxWidth);
            newHeight = Math.min(newHeight, maxHeight);

            // Update component
            setFormData({
                ...formData,
                components: formData.components.map((c: IFormComponent) =>
                    c.id === component.id
                        ? { ...c, layout: { ...c.layout, x: newX, y: newY, w: newWidth, h: newHeight } }
                        : c
                ),
            });
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleCanvasResizeMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = parseInt(formData.canvasConfig.width);
        const startHeight = parseInt(formData.canvasConfig.height || '600');

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;

            const newWidth = Math.max(400, startWidth + deltaX);
            const newHeight = Math.max(400, startHeight + deltaY);

            setFormData({
                ...formData,
                canvasConfig: {
                    ...formData.canvasConfig,
                    width: `${newWidth}px`,
                    height: `${newHeight}px`,
                },
            });
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div className="flex-1 bg-gray-50 overflow-auto p-8">
            <div
                ref={canvasRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={handleCanvasClick}
                className="mx-auto bg-white shadow-xl relative rounded-lg border-2 border-dashed border-gray-300 p-4 group/canvas"
                style={{
                    width: formData.canvasConfig.width,
                    height: formData.canvasConfig.height || '600px',
                    backgroundColor: formData.canvasConfig.backgroundColor,
                }}
                data-canvas-bg="true"
            >
                {formData.components.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none">
                        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-lg font-medium">Kéo thả các phần tử vào đây</p>
                        <p className="text-sm">Chọn phần tử từ thanh bên trái</p>
                    </div>
                )}

                {formData.components.map((component: IFormComponent) => (
                    <div
                        key={component.id}
                        draggable={true}
                        onDragStart={(e) => handleComponentDragStart(e, component)}
                        onDrag={(e) => handleComponentDrag(e)}
                        onDragEnd={(e) => handleComponentDragEnd(e)}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleComponentClick(component.id);
                        }}
                        className={`absolute cursor-move group hover:shadow-lg transition-shadow rounded-lg select-none ${activeComponent === component.id ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:ring-1 hover:ring-gray-300'
                            }`}
                        style={{
                            left: `${component.layout.x}px`,
                            top: `${component.layout.y}px`,
                            width: `${component.layout.w}px`,
                            minHeight: `${component.layout.h}px`,
                            padding: '12px',
                            userSelect: 'none',
                        }}
                    >
                        <div style={{ pointerEvents: 'none' }}>
                            <ComponentRenderer component={component} />
                        </div>

                        {activeComponent === component.id && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteComponent(component.id);
                                    }}
                                    className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full opacity-100 transition shadow-lg hover:bg-red-600 z-50"
                                >
                                    <Trash2 size={18} />
                                </button>

                                {/* Resize Handles */}
                                {/* Top-left */}
                                <div
                                    onMouseDown={(e) => handleResizeMouseDown(e, component, 'nw')}
                                    className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize z-10"
                                    style={{ pointerEvents: 'auto' }}
                                />
                                {/* Top-right */}
                                <div
                                    onMouseDown={(e) => handleResizeMouseDown(e, component, 'ne')}
                                    className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-ne-resize z-10"
                                    style={{ pointerEvents: 'auto' }}
                                />
                                {/* Bottom-left */}
                                <div
                                    onMouseDown={(e) => handleResizeMouseDown(e, component, 'sw')}
                                    className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-sw-resize z-10"
                                    style={{ pointerEvents: 'auto' }}
                                />
                                {/* Bottom-right */}
                                <div
                                    onMouseDown={(e) => handleResizeMouseDown(e, component, 'se')}
                                    className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize z-10"
                                    style={{ pointerEvents: 'auto' }}
                                />
                                {/* Top */}
                                <div
                                    onMouseDown={(e) => handleResizeMouseDown(e, component, 'n')}
                                    className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-n-resize z-10"
                                    style={{ pointerEvents: 'auto' }}
                                />
                                {/* Bottom */}
                                <div
                                    onMouseDown={(e) => handleResizeMouseDown(e, component, 's')}
                                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-s-resize z-10"
                                    style={{ pointerEvents: 'auto' }}
                                />
                                {/* Left */}
                                <div
                                    onMouseDown={(e) => handleResizeMouseDown(e, component, 'w')}
                                    className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-w-resize z-10"
                                    style={{ pointerEvents: 'auto' }}
                                />
                                {/* Right */}
                                <div
                                    onMouseDown={(e) => handleResizeMouseDown(e, component, 'e')}
                                    className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-e-resize z-10"
                                    style={{ pointerEvents: 'auto' }}
                                />
                            </>
                        )}
                    </div>
                ))}

                {/* Canvas Resize Handle - Bottom-right corner */}
                <div
                    onMouseDown={handleCanvasResizeMouseDown}
                    className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full cursor-se-resize z-50 opacity-70 hover:opacity-100 transition-opacity shadow-lg group-hover/canvas:opacity-100"
                    style={{ pointerEvents: 'auto' }}
                    title="Kéo để thay đổi kích thước canvas"
                >
                    <svg className="w-full h-full text-white p-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                </div>

                {/* Canvas Dimensions Display */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-lg opacity-0 group-hover/canvas:opacity-100 transition-opacity pointer-events-none">
                    {formData.canvasConfig.width} × {formData.canvasConfig.height || '600px'}
                </div>
            </div>
        </div>
    );
}
