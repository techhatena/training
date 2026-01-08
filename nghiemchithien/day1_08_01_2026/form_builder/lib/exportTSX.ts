/* eslint-disable @typescript-eslint/no-explicit-any */
import { IFormComponent } from '@/models/Form';

interface FormData {
  name: string;
  canvasConfig: {
    width: string;
    height?: string;
    backgroundColor: string;
  };
  components: IFormComponent[];
}

export function generateTSX(formData: FormData): string {
  // Capitalize first letter and remove spaces
  const componentName = formData.name.replace(/\s+/g, '').replace(/^./, (str) => str.toUpperCase());

  const renderComponent = (component: IFormComponent): string => {
    const { type, properties, styles, layout } = component;

    const wrapperStyle = `{{ position: 'absolute', left: '${layout.x}px', top: '${layout.y}px', width: '${layout.w}px', minHeight: '${layout.h}px', fontSize: '${styles.fontSize}', color: '${styles.color}', backgroundColor: '${styles.backgroundColor}', borderRadius: '${styles.borderRadius}', padding: '${styles.padding}', margin: '${styles.margin}' }}`;

    let innerContent = '';

    switch (type) {
      case 'name_field':
        if (properties.fullName) {
          innerContent = `${properties.displayLabel ? `<label className="block text-sm font-medium mb-1">
              ${properties.label}${properties.isRequired ? '<span className="text-red-500">*</span>' : ''}
            </label>` : ''}
            <input
              type="text"
              placeholder="${properties.placeholder || 'Full name'}"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              ${properties.isRequired ? 'required' : ''}
            />`;
        } else {
          innerContent = `${properties.displayLabel ? `<label className="block text-sm font-medium mb-1">
              ${properties.label}${properties.isRequired ? '<span className="text-red-500">*</span>' : ''}
            </label>` : ''}
            <div className="grid grid-cols-2 gap-2">
              ${properties.prefix ? `<select className="px-3 py-2 border border-gray-300 rounded">
                <option>${properties.prefix}</option>
              </select>` : ''}
              <input
                type="text"
                placeholder="First name"
                className="px-3 py-2 border border-gray-300 rounded"
                ${properties.isRequired ? 'required' : ''}
              />
              <input
                type="text"
                placeholder="Last name"
                className="px-3 py-2 border border-gray-300 rounded"
                ${properties.isRequired ? 'required' : ''}
              />
            </div>`;
        }
        break;

      case 'email':
      case 'password':
      case 'phone':
      case 'address':
      case 'postal':
      case 'text':
        innerContent = `<label className="block text-sm font-medium mb-1">
              ${properties.label}${properties.isRequired ? '<span className="text-red-500">*</span>' : ''}
            </label>
            <input
              type="${type === 'email' ? 'email' : type === 'password' ? 'password' : type === 'phone' ? 'tel' : 'text'}"
              placeholder="${properties.placeholder || ''}"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              ${properties.isRequired ? 'required' : ''}
            />`;
        break;

      case 'country':
      case 'language':
        innerContent = `<label className="block text-sm font-medium mb-1">
              ${properties.label}${properties.isRequired ? '<span className="text-red-500">*</span>' : ''}
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded" ${properties.isRequired ? 'required' : ''}>
              <option value="">${properties.placeholder || 'Select...'}</option>
            </select>`;
        break;

      case 'textarea':
        innerContent = `<label className="block text-sm font-medium mb-1">
              ${properties.label}${properties.isRequired ? '<span className="text-red-500">*</span>' : ''}
            </label>
            <textarea
              placeholder="${properties.placeholder || ''}"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              rows={4}
              ${properties.isRequired ? 'required' : ''}
            />`;
        break;

      case 'checkbox':
        innerContent = `<label className="block text-sm font-medium mb-2">
              ${properties.label}${properties.isRequired ? '<span className="text-red-500">*</span>' : ''}
            </label>
            <div className="space-y-2">
              ${properties.options?.map((opt: any) => `
              <label className="flex items-center gap-2">
                <input type="checkbox" value="${opt.value}" className="rounded" />
                <span className="text-sm">${opt.label}</span>
              </label>`).join('') || ''}
            </div>`;
        break;

      case 'radio':
        innerContent = `<label className="block text-sm font-medium mb-2">
              ${properties.label}${properties.isRequired ? '<span className="text-red-500">*</span>' : ''}
            </label>
            <div className="space-y-2">
              ${properties.options?.map((opt: any) => `
              <label className="flex items-center gap-2">
                <input type="radio" name="${component.id}" value="${opt.value}" ${properties.isRequired ? 'required' : ''} />
                <span className="text-sm">${opt.label}</span>
              </label>`).join('') || ''}
            </div>`;
        break;

      case 'select':
        innerContent = `<label className="block text-sm font-medium mb-1">
              ${properties.label}${properties.isRequired ? '<span className="text-red-500">*</span>' : ''}
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded" ${properties.isRequired ? 'required' : ''}>
              <option value="">${properties.placeholder || 'Select...'}</option>
              ${properties.options?.map((opt: any) => `
              <option value="${opt.value}">${opt.label}</option>`).join('') || ''}
            </select>`;
        break;

      case 'button':
        innerContent = `<button type="submit" className="px-6 py-2 font-medium rounded hover:opacity-90 flex items-center justify-center">
            ${properties.label}
          </button>`;
        break;

      case 'switch':
        innerContent = `<label className="flex items-center gap-2">
              <input type="checkbox" className="toggle" />
              <span className="text-sm font-medium">${properties.label}</span>
            </label>`;
        break;

      default:
        innerContent = `<div>Unknown component type: ${type}</div>`;
    }

    return `
          <div style=${wrapperStyle}>
            ${innerContent}
          </div>`;
  };

  const componentsCode = formData.components
    .map(component => renderComponent(component))
    .join('\n');

  return `'use client';

import React, { useState } from 'react';

export default function ${componentName}() {
  const [formData, setFormData] = useState({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div 
        className="mx-auto bg-white shadow-lg p-8"
        style={{ 
          width: '${formData.canvasConfig.width}',
          height: '${formData.canvasConfig.height || '600px'}',
          backgroundColor: '${formData.canvasConfig.backgroundColor}',
          position: 'relative'
        }}
      >
        <form onSubmit={handleSubmit}>
          ${componentsCode}
        </form>
      </div>
    </div>
  );
}
`;
}
