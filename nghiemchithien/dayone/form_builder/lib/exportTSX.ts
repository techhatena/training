/* eslint-disable @typescript-eslint/no-explicit-any */
import { CraftState, SerializedNode } from '@/models/Form';

interface FormData {
  name: string;
  canvasConfig: {
    width: string;
    height?: string;
    backgroundColor: string;
  };
  craftState: CraftState;
}

// Map Craft.js component names to their types
const COMPONENT_TYPE_MAP: Record<string, string> = {
  'NameField': 'name_field',
  'EmailField': 'email',
  'PasswordField': 'password',
  'PhoneField': 'phone',
  'CountrySelect': 'country',
  'LanguageSelect': 'language',
  'AddressField': 'address',
  'PostalField': 'postal',
  'TextInput': 'text',
  'TextareaField': 'textarea',
  'CheckboxField': 'checkbox',
  'RadioField': 'radio',
  'SelectField': 'select',
  'ButtonField': 'button',
  'SwitchField': 'switch',
};

export function generateTSX(formData: FormData): string {
  const componentName = formData.name.replace(/\s+/g, '').replace(/^./, (str) => str.toUpperCase());

  const renderComponent = (nodeId: string, node: SerializedNode): string => {
    const resolvedName = node.type.resolvedName;
    const type = COMPONENT_TYPE_MAP[resolvedName] || 'text';
    const props = node.props as any;

    const wrapperStyle = `{{ position: 'absolute', left: '${props.x || 0}px', top: '${props.y || 0}px', width: '${props.width || 400}px', minHeight: '${props.height || 80}px', fontSize: '${props.fontSize || '14px'}', color: '${props.color || '#000000'}', backgroundColor: '${props.backgroundColor || '#ffffff'}', borderRadius: '${props.borderRadius || '4px'}', padding: '${props.padding || '8px'}', margin: '${props.margin || '0px'}' }}`;

    let innerContent = '';

    switch (type) {
      case 'name_field':
        if (props.fullName) {
          innerContent = `${props.displayLabel !== false ? `<label className="block text-sm font-medium mb-1">
              ${props.label || 'Name'}${props.isRequired ? '<span className="text-red-500">*</span>' : ''}
            </label>` : ''}
            <input
              type="text"
              placeholder="${props.placeholder || 'Full name'}"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              ${props.isRequired ? 'required' : ''}
            />`;
        } else {
          innerContent = `${props.displayLabel !== false ? `<label className="block text-sm font-medium mb-1">
              ${props.label || 'Name'}${props.isRequired ? '<span className="text-red-500">*</span>' : ''}
            </label>` : ''}
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="First name"
                className="px-3 py-2 border border-gray-300 rounded"
                ${props.isRequired ? 'required' : ''}
              />
              <input
                type="text"
                placeholder="Last name"
                className="px-3 py-2 border border-gray-300 rounded"
                ${props.isRequired ? 'required' : ''}
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
              ${props.label || 'Input'}${props.isRequired ? '<span className="text-red-500">*</span>' : ''}
            </label>
            <input
              type="${type === 'email' ? 'email' : type === 'password' ? 'password' : type === 'phone' ? 'tel' : 'text'}"
              placeholder="${props.placeholder || ''}"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              ${props.isRequired ? 'required' : ''}
            />`;
        break;

      case 'country':
      case 'language':
        innerContent = `<label className="block text-sm font-medium mb-1">
              ${props.label || 'Select'}${props.isRequired ? '<span className="text-red-500">*</span>' : ''}
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded" ${props.isRequired ? 'required' : ''}>
              <option value="">${props.placeholder || 'Select...'}</option>
            </select>`;
        break;

      case 'textarea':
        innerContent = `<label className="block text-sm font-medium mb-1">
              ${props.label || 'Text Area'}${props.isRequired ? '<span className="text-red-500">*</span>' : ''}
            </label>
            <textarea
              placeholder="${props.placeholder || ''}"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              rows={4}
              ${props.isRequired ? 'required' : ''}
            />`;
        break;

      case 'checkbox':
        innerContent = `<label className="block text-sm font-medium mb-2">
              ${props.label || 'Checkbox'}${props.isRequired ? '<span className="text-red-500">*</span>' : ''}
            </label>
            <div className="space-y-2">
              ${props.options?.map((opt: any) => `
              <label className="flex items-center gap-2">
                <input type="checkbox" value="${opt.value}" className="rounded" />
                <span className="text-sm">${opt.label}</span>
              </label>`).join('') || ''}
            </div>`;
        break;

      case 'radio':
        innerContent = `<label className="block text-sm font-medium mb-2">
              ${props.label || 'Radio'}${props.isRequired ? '<span className="text-red-500">*</span>' : ''}
            </label>
            <div className="space-y-2">
              ${props.options?.map((opt: any) => `
              <label className="flex items-center gap-2">
                <input type="radio" name="${nodeId}" value="${opt.value}" ${props.isRequired ? 'required' : ''} />
                <span className="text-sm">${opt.label}</span>
              </label>`).join('') || ''}
            </div>`;
        break;

      case 'select':
        innerContent = `<label className="block text-sm font-medium mb-1">
              ${props.label || 'Select'}${props.isRequired ? '<span className="text-red-500">*</span>' : ''}
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded" ${props.isRequired ? 'required' : ''}>
              <option value="">${props.placeholder || 'Select...'}</option>
              ${props.options?.map((opt: any) => `
              <option value="${opt.value}">${opt.label}</option>`).join('') || ''}
            </select>`;
        break;

      case 'button':
        innerContent = `<button type="submit" className="px-6 py-2 font-medium rounded hover:opacity-90 flex items-center justify-center" style={{ backgroundColor: '${props.backgroundColor || '#3b82f6'}', color: '${props.color || '#ffffff'}' }}>
            ${props.label || 'Submit'}
          </button>`;
        break;

      case 'switch':
        innerContent = `<label className="flex items-center gap-2">
              <input type="checkbox" className="toggle" />
              <span className="text-sm font-medium">${props.label || 'Toggle'}${props.isRequired ? '<span className="text-red-500">*</span>' : ''}</span>
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

  // Extract components from Craft.js state (excluding Container and ROOT)
  const componentsCode = Object.entries(formData.craftState || {})
    .filter(([nodeId, node]) => {
      const resolvedName = node.type?.resolvedName;
      return resolvedName && resolvedName !== 'Container' && nodeId !== 'ROOT';
    })
    .map(([nodeId, node]) => renderComponent(nodeId, node))
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

// Export JSON in Craft.js format
export function generateJSON(formData: FormData): string {
  return JSON.stringify({
    name: formData.name,
    canvasConfig: formData.canvasConfig,
    craftState: formData.craftState,
  }, null, 2);
}

// Parse imported JSON and convert to form data
export function parseImportedJSON(jsonString: string): FormData | null {
  try {
    const data = JSON.parse(jsonString);

    // Validate structure
    if (!data.name || !data.canvasConfig) {
      return null;
    }

    // If it's the new Craft.js format
    if (data.craftState) {
      return {
        name: data.name,
        canvasConfig: data.canvasConfig,
        craftState: data.craftState,
      };
    }

    // If it's the old format with components array, convert to Craft.js format
    if (Array.isArray(data.components)) {
      const craftState: CraftState = {
        ROOT: {
          type: { resolvedName: 'Container' },
          isCanvas: true,
          props: {
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            padding: '0',
          },
          displayName: 'Container',
          custom: {},
          parent: null,
          nodes: [],
          linkedNodes: {},
        },
      };

      // Convert old components to new format
      data.components.forEach((comp: any, index: number) => {
        const nodeId = `node_${comp.id || index}`;
        const resolvedName = getResolvedName(comp.type);

        craftState[nodeId] = {
          type: { resolvedName },
          props: {
            label: comp.properties?.label,
            placeholder: comp.properties?.placeholder,
            isRequired: comp.properties?.isRequired,
            options: comp.properties?.options,
            validationPattern: comp.properties?.validationPattern,
            validationMessage: comp.properties?.validationMessage,
            displayLabel: comp.properties?.displayLabel,
            fullName: comp.properties?.fullName,
            prefix: comp.properties?.prefix,
            fontSize: comp.styles?.fontSize || '14px',
            color: comp.styles?.color || '#000000',
            backgroundColor: comp.styles?.backgroundColor || '#ffffff',
            borderRadius: comp.styles?.borderRadius || '4px',
            padding: comp.styles?.padding || '8px',
            x: comp.layout?.x || 0,
            y: comp.layout?.y || 0,
            width: comp.layout?.w || 400,
            height: comp.layout?.h || 80,
          },
          displayName: resolvedName,
          parent: 'ROOT',
          nodes: [],
        };

        craftState.ROOT.nodes.push(nodeId);
      });

      return {
        name: data.name,
        canvasConfig: data.canvasConfig,
        craftState,
      };
    }

    return null;
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return null;
  }
}

function getResolvedName(type: string): string {
  const typeMap: Record<string, string> = {
    'name_field': 'NameField',
    'email': 'EmailField',
    'password': 'PasswordField',
    'phone': 'PhoneField',
    'country': 'CountrySelect',
    'language': 'LanguageSelect',
    'address': 'AddressField',
    'postal': 'PostalField',
    'text': 'TextInput',
    'textarea': 'TextareaField',
    'checkbox': 'CheckboxField',
    'radio': 'RadioField',
    'select': 'SelectField',
    'button': 'ButtonField',
    'switch': 'SwitchField',
  };
  return typeMap[type] || 'TextInput';
}
