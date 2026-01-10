'use client';

import { IFormComponent } from '@/models/Form';
import { X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface FormPreviewProps {
    formData: {
        name: string;
        canvasConfig: {
            width: string;
            height?: string;
            backgroundColor: string;
        };
        components: IFormComponent[];
    };
    onClose: () => void;
}

export function FormPreview({ formData, onClose }: FormPreviewProps) {
    const [formValues, setFormValues] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (componentId: string, value: any) => {
        setFormValues(prev => ({ ...prev, [componentId]: value }));
        // Clear error when user starts typing
        if (errors[componentId]) {
            setErrors(prev => ({ ...prev, [componentId]: '' }));
        }
    };

    const validateComponent = (component: IFormComponent, value: any): string => {
        // Check required
        if (component.properties.isRequired && (!value || value.toString().trim() === '')) {
            return `${component.properties.label} là bắt buộc`;
        }

        // Check validation pattern
        if (component.properties.validationPattern && value && value.toString().trim() !== '') {
            try {
                const pattern = new RegExp(component.properties.validationPattern);
                if (!pattern.test(value.toString())) {
                    return component.properties.validationMessage || 'Định dạng không hợp lệ';
                }
            } catch (e) {
                console.error('Invalid regex pattern:', component.properties.validationPattern);
            }
        }

        return '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        // Validate all components
        formData.components.forEach(component => {
            if (component.type !== 'button') {
                const error = validateComponent(component, formValues[component.id]);
                if (error) {
                    newErrors[component.id] = error;
                }
            }
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            toast.success('Form hợp lệ! Tất cả validation đã pass.');
            console.log('Form values:', formValues);
        } else {
            toast.error(`Có ${Object.keys(newErrors).length} lỗi cần sửa`);
        }
    };

    const renderFormComponent = (component: IFormComponent) => {
        const value = formValues[component.id] || '';
        const error = errors[component.id];
        const commonProps = {
            id: component.id,
            value,
            onChange: (e: any) => handleInputChange(component.id, e.target.value),
            placeholder: component.properties.placeholder || '',
            className: `px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
            }`,
            style: {
                fontSize: component.styles.fontSize,
                color: component.styles.color,
                backgroundColor: component.styles.backgroundColor,
                borderRadius: component.styles.borderRadius,
                width: '100%',
                boxSizing: 'border-box' as const
            }
        };

        switch (component.type) {
            case 'name_field':
            case 'text':
                return (
                    <div className="h-full">
                        {component.properties.displayLabel !== false && (
                            <label htmlFor={component.id} className="block text-sm font-medium text-gray-700 mb-1">
                                {component.properties.label}
                                {component.properties.isRequired && <span className="text-red-500 ml-1">*</span>}
                            </label>
                        )}
                        <input type="text" {...commonProps} />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                );

            case 'email':
                return (
                    <div className="h-full">
                        <label htmlFor={component.id} className="block text-sm font-medium text-gray-700 mb-1">
                            {component.properties.label}
                            {component.properties.isRequired && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input type="email" {...commonProps} />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                );

            case 'password':
                return (
                    <div className="h-full">
                        <label htmlFor={component.id} className="block text-sm font-medium text-gray-700 mb-1">
                            {component.properties.label}
                            {component.properties.isRequired && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input type="password" {...commonProps} />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                );

            case 'phone':
                return (
                    <div className="h-full">
                        <label htmlFor={component.id} className="block text-sm font-medium text-gray-700 mb-1">
                            {component.properties.label}
                            {component.properties.isRequired && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input type="tel" {...commonProps} />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                );

            case 'address':
                return (
                    <div className="h-full">
                        <label htmlFor={component.id} className="block text-sm font-medium text-gray-700 mb-1">
                            {component.properties.label}
                            {component.properties.isRequired && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input type="text" {...commonProps} />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                );

            case 'postal':
                return (
                    <div className="h-full">
                        <label htmlFor={component.id} className="block text-sm font-medium text-gray-700 mb-1">
                            {component.properties.label}
                            {component.properties.isRequired && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input type="text" {...commonProps} />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                );

            case 'country':
                return (
                    <div className="h-full">
                        <label htmlFor={component.id} className="block text-sm font-medium text-gray-700 mb-1">
                            {component.properties.label}
                            {component.properties.isRequired && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <select
                            {...commonProps}
                            onChange={(e) => handleInputChange(component.id, e.target.value)}
                        >
                            <option value="">{component.properties.placeholder || 'Select country'}</option>
                            <option value="vn">Vietnam</option>
                            <option value="us">United States</option>
                            <option value="uk">United Kingdom</option>
                            <option value="fr">France</option>
                            <option value="de">Germany</option>
                            <option value="jp">Japan</option>
                            <option value="kr">South Korea</option>
                            <option value="cn">China</option>
                        </select>
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                );

            case 'language':
                return (
                    <div className="h-full">
                        <label htmlFor={component.id} className="block text-sm font-medium text-gray-700 mb-1">
                            {component.properties.label}
                            {component.properties.isRequired && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <select
                            {...commonProps}
                            onChange={(e) => handleInputChange(component.id, e.target.value)}
                        >
                            <option value="">{component.properties.placeholder || 'Select language'}</option>
                            <option value="vi">Tiếng Việt</option>
                            <option value="en">English</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                            <option value="es">Español</option>
                            <option value="ja">日本語</option>
                            <option value="ko">한국어</option>
                            <option value="zh">中文</option>
                        </select>
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                );

            case 'textarea':
                return (
                    <div className="h-full">
                        <label htmlFor={component.id} className="block text-sm font-medium text-gray-700 mb-1">
                            {component.properties.label}
                            {component.properties.isRequired && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <textarea
                            {...commonProps}
                            onChange={(e) => handleInputChange(component.id, e.target.value)}
                            rows={Math.max(3, Math.floor((component.layout.h - 60) / 25))}
                            style={{
                                ...commonProps.style,
                                resize: 'none',
                                minHeight: `${Math.max(60, component.layout.h - 60)}px`
                            }}
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                );

            case 'select':
                return (
                    <div className="h-full">
                        <label htmlFor={component.id} className="block text-sm font-medium text-gray-700 mb-1">
                            {component.properties.label}
                            {component.properties.isRequired && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <select
                            {...commonProps}
                            onChange={(e) => handleInputChange(component.id, e.target.value)}
                        >
                            <option value="">{component.properties.placeholder || 'Chọn một tùy chọn'}</option>
                            {component.properties.options?.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                );

            case 'checkbox':
                return (
                    <div className="h-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {component.properties.label}
                            {component.properties.isRequired && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <div className="space-y-2">
                            {component.properties.options?.map((option, index) => (
                                <label key={index} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        onChange={(e) => {
                                            const currentValues = formValues[component.id] || [];
                                            if (e.target.checked) {
                                                handleInputChange(component.id, [...currentValues, option.value]);
                                            } else {
                                                handleInputChange(component.id, currentValues.filter((v: any) => v !== option.value));
                                            }
                                        }}
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </div>
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                );

            case 'radio':
                return (
                    <div className="h-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {component.properties.label}
                            {component.properties.isRequired && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <div className="space-y-2">
                            {component.properties.options?.map((option, index) => (
                                <label key={index} className="flex items-center">
                                    <input
                                        type="radio"
                                        name={component.id}
                                        value={option.value}
                                        className="mr-2"
                                        onChange={(e) => handleInputChange(component.id, e.target.value)}
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </div>
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                );

            case 'button':
                return (
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full h-full"
                        style={{
                            fontSize: component.styles.fontSize,
                            backgroundColor: component.styles.color === '#000000' ? '#3b82f6' : component.styles.color,
                            borderRadius: component.styles.borderRadius,
                        }}
                    >
                        {component.properties.label}
                    </button>
                );

            default:
                return <div className="p-2 bg-gray-100 rounded text-sm">Unsupported: {component.type}</div>;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Preview: {formData.name}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="bg-gray-50 p-8 rounded-lg">
                        <div
                            className="mx-auto relative"
                            style={{
                                width: formData.canvasConfig.width,
                                minHeight: formData.canvasConfig.height || '600px',
                                backgroundColor: formData.canvasConfig.backgroundColor,
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px'
                            }}
                        >
                            <form onSubmit={handleSubmit} className="w-full h-full relative">
                                {formData.components.map(component => (
                                    <div
                                        key={component.id}
                                        className="absolute"
                                        style={{
                                            left: `${component.layout.x}px`,
                                            top: `${component.layout.y}px`,
                                            width: `${component.layout.w}px`,
                                            minHeight: `${component.layout.h}px`,
                                            padding: '8px',
                                            zIndex: component.type === 'button' ? 10 : 1
                                        }}
                                    >
                                        {renderFormComponent(component)}
                                    </div>
                                ))}
                            </form>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Hướng dẫn test validation:</h4>
                        <ul className="text-blue-700 space-y-1 text-sm">
                            <li>• Để trống các trường bắt buộc để test required validation</li>
                            <li>• Nhập sai format email, số điện thoại để test pattern validation</li>
                            <li>• Click Submit để xem kết quả validation</li>
                            <li>• Các lỗi sẽ hiển thị màu đỏ bên dưới field</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}