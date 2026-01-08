/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { IFormComponent } from '@/models/Form';

interface ComponentRendererProps {
    component: IFormComponent;
}

export function ComponentRenderer({ component }: ComponentRendererProps) {
    const { type, properties, styles } = component;

    const baseStyle: React.CSSProperties = {
        fontSize: styles.fontSize,
        color: styles.color,
        backgroundColor: styles.backgroundColor,
        borderRadius: styles.borderRadius,
        padding: styles.padding,
        margin: styles.margin,
        width: '100%',
    };

    const renderNameField = () => {
        if (properties.fullName) {
            return (
                <div style={baseStyle}>
                    {properties.displayLabel && (
                        <label className="block text-sm font-medium mb-1">
                            {properties.label}
                            {properties.isRequired && <span className="text-red-500">*</span>}
                        </label>
                    )}
                    <input
                        type="text"
                        placeholder={properties.placeholder || 'Full name'}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        readOnly
                    />
                </div>
            );
        }

        return (
            <div style={baseStyle}>
                {properties.displayLabel && (
                    <label className="block text-sm font-medium mb-1">
                        {properties.label}
                        {properties.isRequired && <span className="text-red-500">*</span>}
                    </label>
                )}
                <div className="grid grid-cols-2 gap-2">
                    {properties.prefix && (
                        <select className="px-3 py-2 border border-gray-300 rounded">
                            <option>{properties.prefix || 'Prefix'}</option>
                        </select>
                    )}
                    <input
                        type="text"
                        placeholder="First name"
                        className="px-3 py-2 border border-gray-300 rounded"
                        readOnly
                    />
                    <input
                        type="text"
                        placeholder="Last name"
                        className="px-3 py-2 border border-gray-300 rounded"
                        readOnly
                    />
                </div>
            </div>
        );
    };

    switch (type) {
        case 'name_field':
            return renderNameField();

        case 'email':
        case 'password':
        case 'phone':
        case 'address':
        case 'postal':
            return (
                <div style={baseStyle}>
                    <label className="block text-sm font-medium mb-1">
                        {properties.label}
                        {properties.isRequired && <span className="text-red-500">*</span>}
                    </label>
                    <input
                        type={type === 'email' ? 'email' : type === 'password' ? 'password' : 'text'}
                        placeholder={properties.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        readOnly
                    />
                </div>
            );

        case 'country':
        case 'language':
            return (
                <div style={baseStyle}>
                    <label className="block text-sm font-medium mb-1">
                        {properties.label}
                        {properties.isRequired && <span className="text-red-500">*</span>}
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded">
                        <option>{properties.placeholder}</option>
                    </select>
                </div>
            );

        case 'text':
            return (
                <div style={baseStyle}>
                    <label className="block text-sm font-medium mb-1">
                        {properties.label}
                        {properties.isRequired && <span className="text-red-500">*</span>}
                    </label>
                    <input
                        type="text"
                        placeholder={properties.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        readOnly
                    />
                </div>
            );

        case 'textarea':
            return (
                <div style={baseStyle}>
                    <label className="block text-sm font-medium mb-1">
                        {properties.label}
                        {properties.isRequired && <span className="text-red-500">*</span>}
                    </label>
                    <textarea
                        placeholder={properties.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        rows={4}
                        readOnly
                    />
                </div>
            );

        case 'checkbox':
            return (
                <div style={baseStyle}>
                    <label className="block text-sm font-medium mb-2">
                        {properties.label}
                        {properties.isRequired && <span className="text-red-500">*</span>}
                    </label>
                    <div className="space-y-2">
                        {properties.options?.map((option: any, index: number) => (
                            <label key={index} className="flex items-center gap-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            );

        case 'radio':
            return (
                <div style={baseStyle}>
                    <label className="block text-sm font-medium mb-2">
                        {properties.label}
                        {properties.isRequired && <span className="text-red-500">*</span>}
                    </label>
                    <div className="space-y-2">
                        {properties.options?.map((option: any, index: number) => (
                            <label key={index} className="flex items-center gap-2">
                                <input type="radio" name={component.id} />
                                <span className="text-sm">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            );

        case 'select':
            return (
                <div style={baseStyle}>
                    <label className="block text-sm font-medium mb-1">
                        {properties.label}
                        {properties.isRequired && <span className="text-red-500">*</span>}
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded">
                        <option>{properties.placeholder}</option>
                        {properties.options?.map((option: any, index: number) => (
                            <option key={index} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            );

        case 'button':
            return (
                <button
                    style={baseStyle}
                    className="px-6 py-2 font-medium rounded cursor-pointer hover:opacity-90"
                >
                    {properties.label}
                </button>
            );

        case 'switch':
            return (
                <div style={baseStyle}>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" className="toggle" />
                        <span className="text-sm font-medium">{properties.label}</span>
                    </label>
                </div>
            );

        default:
            return (
                <div style={baseStyle} className="p-4 border border-dashed border-gray-300">
                    Unknown component type: {type}
                </div>
            );
    }
}
