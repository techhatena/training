/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { IFormComponent } from '@/models/Form';
import { Settings } from "lucide-react";
interface RightSidebarProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData: any;
    activeComponent: string | null;
    updateComponent: (componentId: string, updates: Partial<IFormComponent>) => void;
}

export function RightSidebar({ formData, activeComponent, updateComponent }: RightSidebarProps) {
    const component = formData.components.find((c: IFormComponent) => c.id === activeComponent);

    if (!component) {
        return (
            <div className="w-80 bg-gradient-to-b from-gray-50 to-white border-l border-gray-200 p-6 shadow-sm">
                <div className="flex flex-col items-center justify-center text-center h-full">
                    <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    <p className="text-gray-500 font-medium mb-2">Chưa chọn phần tử</p>
                    <p className="text-sm text-gray-400">Click vào một phần tử trên canvas để chỉnh sửa thuộc tính</p>
                </div>
            </div>
        );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePropertyChange = (path: string, value: any) => {
        if (path.startsWith('properties.')) {
            const propKey = path.replace('properties.', '');
            updateComponent(component.id, {
                properties: { ...component.properties, [propKey]: value },
            });
        } else if (path.startsWith('styles.')) {
            const styleKey = path.replace('styles.', '');
            updateComponent(component.id, {
                styles: { ...component.styles, [styleKey]: value },
            });
        } else if (path.startsWith('layout.')) {
            const layoutKey = path.replace('layout.', '');
            updateComponent(component.id, {
                layout: { ...component.layout, [layoutKey]: Number(value) },
            });
        }
    };

    const handleOptionsChange = (index: number, field: 'label' | 'value', value: string) => {
        const newOptions = [...(component.properties.options || [])];
        newOptions[index] = { ...newOptions[index], [field]: value };
        updateComponent(component.id, {
            properties: { ...component.properties, options: newOptions },
        });
    };

    const addOption = () => {
        const newOptions = [
            ...(component.properties.options || []),
            { label: `Option ${(component.properties.options?.length || 0) + 1}`, value: `option${(component.properties.options?.length || 0) + 1}` },
        ];
        updateComponent(component.id, {
            properties: { ...component.properties, options: newOptions },
        });
    };

    const removeOption = (index: number) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newOptions = component.properties.options?.filter((_: any, i: number) => i !== index);
        updateComponent(component.id, {
            properties: { ...component.properties, options: newOptions },
        });
    };

    return (
        <div className="w-80 bg-gradient-to-b from-gray-50 to-white border-l border-gray-200 overflow-y-auto shadow-sm">
            <div className="p-5">
                <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                    <Settings />
                    Cài đặt
                </h2>

                <div className="mb-5 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">Loại phần tử</p>
                    <p className="text-sm font-bold text-blue-900">{component.type}</p>
                </div>

                {/* Properties Section */}
                <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Thuộc tính</h3>
                    {component.properties.label !== undefined && (
                        <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Label</label>
                            <input
                                type="text"
                                value={component.properties.label || ''}
                                onChange={(e) => handlePropertyChange('properties.label', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    )}

                    {component.properties.placeholder !== undefined && (
                        <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Placeholder</label>
                            <input
                                type="text"
                                value={component.properties.placeholder || ''}
                                onChange={(e) => handlePropertyChange('properties.placeholder', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    )}

                    {component.properties.isRequired !== undefined && (
                        <div className="mb-3">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={component.properties.isRequired || false}
                                    onChange={(e) => handlePropertyChange('properties.isRequired', e.target.checked)}
                                    className="rounded"
                                />
                                <span className="text-sm font-medium text-gray-800">Required</span>
                            </label>
                        </div>
                    )}

                    {/* Validation Pattern */}
                    {(component.type === 'email' || component.type === 'password' || component.type === 'phone' ||
                        component.type === 'text' || component.type === 'textarea' || component.type === 'postal') && (
                            <>
                                <div className="mb-3">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Validation Pattern (RegEx)</label>
                                    <input
                                        type="text"
                                        value={component.properties.validationPattern || ''}
                                        onChange={(e) => handlePropertyChange('properties.validationPattern', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="^\\d*(?:\\.\\d{0,2})?$"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Validation Error Message</label>
                                    <textarea
                                        value={component.properties.validationMessage || ''}
                                        onChange={(e) => handlePropertyChange('properties.validationMessage', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Please enter a valid value"
                                        rows={2}
                                    />
                                </div>
                            </>
                        )}

                    {/* Name field specific properties */}
                    {component.type === 'name_field' && (
                        <>
                            <div className="mb-3">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Prefix</label>
                                <input
                                    type="text"
                                    value={component.properties.prefix || ''}
                                    onChange={(e) => handlePropertyChange('properties.prefix', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Mr, Mrs, Ms"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={component.properties.displayLabel || false}
                                        onChange={(e) => handlePropertyChange('properties.displayLabel', e.target.checked)}
                                        className="rounded"
                                    />
                                    <span className="text-sm font-medium text-gray-800">Display label</span>
                                </label>
                            </div>

                            <div className="mb-3">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={component.properties.fullName || false}
                                        onChange={(e) => handlePropertyChange('properties.fullName', e.target.checked)}
                                        className="rounded"
                                    />
                                    <span className="text-sm font-medium text-gray-800">Full name (single field)</span>
                                </label>
                            </div>

                            <div className="mb-3">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={component.properties.keepSpace || false}
                                        onChange={(e) => handlePropertyChange('properties.keepSpace', e.target.checked)}
                                        className="rounded"
                                    />
                                    <span className="text-sm font-medium text-gray-800">Keep space for hidden label</span>
                                </label>
                            </div>

                            <div className="mb-3">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={component.properties.useCustomerName || false}
                                        onChange={(e) => handlePropertyChange('properties.useCustomerName', e.target.checked)}
                                        className="rounded"
                                    />
                                    <span className="text-sm font-medium text-gray-800">Use customer name as default</span>
                                </label>
                            </div>
                        </>
                    )}

                    {/* Options for select/radio/checkbox */}
                    {(component.type === 'select' || component.type === 'radio' || component.type === 'checkbox') && (
                        <div className="mb-3">
                            <label className="block text-xs text-gray-600 mb-2">Options</label>
                            {component.properties.options?.map((option: any, index: number) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={option.label}
                                        onChange={(e) => handleOptionsChange(index, 'label', e.target.value)}
                                        placeholder="Label"
                                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                                    />
                                    <input
                                        type="text"
                                        value={option.value}
                                        onChange={(e) => handleOptionsChange(index, 'value', e.target.value)}
                                        placeholder="Value"
                                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                                    />
                                    <button
                                        onClick={() => removeOption(index)}
                                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addOption}
                                className="w-full px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                            >
                                + Add Option
                            </button>
                        </div>
                    )}
                </div>

                {/* Styles Section */}
                <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Kiểu dáng</h3>

                    <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Font Size</label>
                        <input
                            type="text"
                            value={component.styles.fontSize || '14px'}
                            onChange={(e) => handlePropertyChange('styles.fontSize', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Text Color</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={component.styles.color || '#000000'}
                                onChange={(e) => handlePropertyChange('styles.color', e.target.value)}
                                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <input
                                type="text"
                                value={component.styles.color || '#000000'}
                                onChange={(e) => handlePropertyChange('styles.color', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900 font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Background Color</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={component.styles.backgroundColor || '#ffffff'}
                                onChange={(e) => handlePropertyChange('styles.backgroundColor', e.target.value)}
                                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <input
                                type="text"
                                value={component.styles.backgroundColor || '#ffffff'}
                                onChange={(e) => handlePropertyChange('styles.backgroundColor', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900 font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Border Radius</label>
                        <input
                            type="text"
                            value={component.styles.borderRadius || '4px'}
                            onChange={(e) => handlePropertyChange('styles.borderRadius', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Padding</label>
                        <input
                            type="text"
                            value={component.styles.padding || '8px'}
                            onChange={(e) => handlePropertyChange('styles.padding', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Layout Section */}
                <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Bố cục</h3>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Width (px)</label>
                            <input
                                type="number"
                                value={component.layout.w}
                                onChange={(e) => handlePropertyChange('layout.w', e.target.value)}
                                min="50"
                                step="10"
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Height (px)</label>
                            <input
                                type="number"
                                value={component.layout.h}
                                onChange={(e) => handlePropertyChange('layout.h', e.target.value)}
                                min="30"
                                step="10"
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
