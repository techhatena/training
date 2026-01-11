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

  // Get the Container node to find its children
  const containerNode = Object.entries(formData.craftState || {}).find(
    ([, node]) => node.type?.resolvedName === 'Container'
  );

  const containerChildren = containerNode ? containerNode[1].nodes || [] : [];

  // Collect all fields with validation for generating validation rules
  interface ValidationRule {
    fieldName: string;
    label: string;
    pattern: string;
    message: string;
    isRequired: boolean;
  }
  const validationRules: ValidationRule[] = [];

  const renderComponent = (nodeId: string, node: SerializedNode): string => {
    const resolvedName = node.type.resolvedName;
    const type = COMPONENT_TYPE_MAP[resolvedName] || 'text';
    const props = node.props as any;

    // Generate a safe field name from nodeId
    const fieldName = nodeId.replace(/[^a-zA-Z0-9]/g, '_');

    // Collect validation rules
    if (props.validationPattern || props.isRequired) {
      validationRules.push({
        fieldName,
        label: props.label || fieldName,
        pattern: props.validationPattern || '',
        message: props.validationMessage || `${props.label || fieldName} không hợp lệ`,
        isRequired: props.isRequired || false,
      });
    }

    // Use columnWidth for flex layout instead of absolute positioning
    const columnWidth = props.columnWidth || '100%';
    let widthCalc = columnWidth;

    // Calculate width with gap adjustment for flex layout
    if (columnWidth === '50%') {
      widthCalc = 'calc(50% - 6px)';
    } else if (columnWidth === '33.33%') {
      widthCalc = 'calc(33.33% - 8px)';
    } else if (columnWidth === '25%') {
      widthCalc = 'calc(25% - 9px)';
    }

    const wrapperStyle = `{{ width: '${widthCalc}', fontSize: '${props.fontSize || '14px'}', color: '${props.color || '#000000'}', backgroundColor: '${props.backgroundColor || 'transparent'}', borderRadius: '${props.borderRadius || '4px'}', padding: '${props.padding || '8px'}' }}`;

    let innerContent = '';

    switch (type) {
      case 'name_field':
        const nameInputMode = props.nameInputMode || '1';
        if (nameInputMode === '1') {
          innerContent = `${props.displayLabel !== false ? `<label className="block text-sm font-medium mb-1">
              ${props.label || 'Họ và tên'}${props.isRequired ? '<span className="text-red-500">*</span>' : ''}
            </label>` : ''}
            <input
              type="text"
              name="${fieldName}"
              value={formData.${fieldName} || ''}
              onChange={handleChange}
              placeholder="${props.placeholder || 'Họ và tên'}"
              className={\`w-full px-3 py-2 border rounded \${errors.${fieldName} ? 'border-red-500' : 'border-gray-300'}\`}
              ${props.isRequired ? 'required' : ''}
            />
            {errors.${fieldName} && <p className="text-red-500 text-xs mt-1">{errors.${fieldName}}</p>}`;
        } else if (nameInputMode === '2') {
          innerContent = `${props.displayLabel !== false ? `<label className="block text-sm font-medium mb-1">
              ${props.label || 'Họ và tên'}${props.isRequired ? '<span className="text-red-500">*</span>' : ''}
            </label>` : ''}
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                name="${fieldName}_first"
                value={formData.${fieldName}_first || ''}
                onChange={handleChange}
                placeholder="Họ"
                className="px-3 py-2 border border-gray-300 rounded"
                ${props.isRequired ? 'required' : ''}
              />
              <input
                type="text"
                name="${fieldName}_last"
                value={formData.${fieldName}_last || ''}
                onChange={handleChange}
                placeholder="Tên"
                className="px-3 py-2 border border-gray-300 rounded"
                ${props.isRequired ? 'required' : ''}
              />
            </div>`;
        } else {
          innerContent = `${props.displayLabel !== false ? `<label className="block text-sm font-medium mb-1">
              ${props.label || 'Họ và tên'}${props.isRequired ? '<span className="text-red-500">*</span>' : ''}
            </label>` : ''}
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                name="${fieldName}_first"
                value={formData.${fieldName}_first || ''}
                onChange={handleChange}
                placeholder="Họ"
                className="px-3 py-2 border border-gray-300 rounded"
                ${props.isRequired ? 'required' : ''}
              />
              <input
                type="text"
                name="${fieldName}_middle"
                value={formData.${fieldName}_middle || ''}
                onChange={handleChange}
                placeholder="Tên đệm"
                className="px-3 py-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="${fieldName}_last"
                value={formData.${fieldName}_last || ''}
                onChange={handleChange}
                placeholder="Tên"
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
              name="${fieldName}"
              value={formData.${fieldName} || ''}
              onChange={handleChange}
              placeholder="${props.placeholder || ''}"
              className={\`w-full px-3 py-2 border rounded \${errors.${fieldName} ? 'border-red-500' : 'border-gray-300'}\`}
              ${props.isRequired ? 'required' : ''}
            />
            {errors.${fieldName} && <p className="text-red-500 text-xs mt-1">{errors.${fieldName}}</p>}`;
        break;

      case 'country':
      case 'language':
        innerContent = `<label className="block text-sm font-medium mb-1">
              ${props.label || 'Select'}${props.isRequired ? '<span className="text-red-500">*</span>' : ''}
            </label>
            <select
              name="${fieldName}"
              value={formData.${fieldName} || ''}
              onChange={handleChange}
              className={\`w-full px-3 py-2 border rounded \${errors.${fieldName} ? 'border-red-500' : 'border-gray-300'}\`}
              ${props.isRequired ? 'required' : ''}
            >
              <option value="">${props.placeholder || 'Select...'}</option>
            </select>
            {errors.${fieldName} && <p className="text-red-500 text-xs mt-1">{errors.${fieldName}}</p>}`;
        break;

      case 'textarea':
        innerContent = `<label className="block text-sm font-medium mb-1">
              ${props.label || 'Text Area'}${props.isRequired ? '<span className="text-red-500">*</span>' : ''}
            </label>
            <textarea
              name="${fieldName}"
              value={formData.${fieldName} || ''}
              onChange={handleChange}
              placeholder="${props.placeholder || ''}"
              className={\`w-full px-3 py-2 border rounded \${errors.${fieldName} ? 'border-red-500' : 'border-gray-300'}\`}
              rows={${props.rows || 4}}
              ${props.isRequired ? 'required' : ''}
            />
            {errors.${fieldName} && <p className="text-red-500 text-xs mt-1">{errors.${fieldName}}</p>}`;
        break;

      case 'checkbox':
        const checkboxOptions = Array.isArray(props.options) ? props.options : [];
        innerContent = `<label className="block text-sm font-medium mb-2">
              ${props.label || 'Checkbox'}${props.isRequired ? '<span className="text-red-500">*</span>' : ''}
            </label>
            <div className="space-y-2">
              ${checkboxOptions.map((opt: string) => `
              <label className="flex items-center gap-2">
                <input type="checkbox" name="${fieldName}" value="${opt}" onChange={handleCheckboxChange} className="rounded" />
                <span className="text-sm">${opt}</span>
              </label>`).join('')}
            </div>`;
        break;

      case 'radio':
        const radioOptions = Array.isArray(props.options) ? props.options : [];
        innerContent = `<label className="block text-sm font-medium mb-2">
              ${props.label || 'Radio'}${props.isRequired ? '<span className="text-red-500">*</span>' : ''}
            </label>
            <div className="space-y-2">
              ${radioOptions.map((opt: string) => `
              <label className="flex items-center gap-2">
                <input type="radio" name="${fieldName}" value="${opt}" onChange={handleChange} ${props.isRequired ? 'required' : ''} />
                <span className="text-sm">${opt}</span>
              </label>`).join('')}
            </div>`;
        break;

      case 'select':
        const selectOptions = Array.isArray(props.options) ? props.options : [];
        innerContent = `<label className="block text-sm font-medium mb-1">
              ${props.label || 'Select'}${props.isRequired ? '<span className="text-red-500">*</span>' : ''}
            </label>
            <select
              name="${fieldName}"
              value={formData.${fieldName} || ''}
              onChange={handleChange}
              className={\`w-full px-3 py-2 border rounded \${errors.${fieldName} ? 'border-red-500' : 'border-gray-300'}\`}
              ${props.isRequired ? 'required' : ''}
            >
              <option value="">${props.placeholder || 'Chọn...'}</option>
              ${selectOptions.map((opt: string) => `
              <option value="${opt}">${opt}</option>`).join('')}
            </select>
            {errors.${fieldName} && <p className="text-red-500 text-xs mt-1">{errors.${fieldName}}</p>}`;
        break;

      case 'button':
        innerContent = `<button type="submit" className="w-full px-6 py-2 font-medium rounded hover:opacity-90" style={{ backgroundColor: '${props.buttonColor || '#3b82f6'}', color: '${props.textColor || '#ffffff'}' }}>
            ${props.buttonText || 'Submit'}
          </button>`;
        break;

      case 'switch':
        innerContent = `<label className="flex items-center gap-2">
              <input type="checkbox" name="${fieldName}" onChange={handleChange} className="toggle" />
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

  // Extract components from Container's children in order
  let componentsCode = '';

  if (containerChildren.length > 0) {
    // Use Container's nodes array to maintain order
    componentsCode = containerChildren
      .filter((nodeId: string) => {
        const node = formData.craftState[nodeId];
        return node && node.type?.resolvedName !== 'Container';
      })
      .map((nodeId: string) => renderComponent(nodeId, formData.craftState[nodeId]))
      .join('\n');
  } else {
    // Fallback: extract all non-Container nodes
    componentsCode = Object.entries(formData.craftState || {})
      .filter(([nodeId, node]) => {
        const resolvedName = node.type?.resolvedName;
        return resolvedName && resolvedName !== 'Container' && nodeId !== 'ROOT';
      })
      .map(([nodeId, node]) => renderComponent(nodeId, node))
      .join('\n');
  }

  // Generate validation rules code
  const validationRulesCode = validationRules.map(rule => {
    const checks: string[] = [];

    if (rule.isRequired) {
      checks.push(`    if (!formData.${rule.fieldName}) {
      newErrors.${rule.fieldName} = '${rule.label} là bắt buộc';
      isValid = false;
    }`);
    }

    if (rule.pattern) {
      checks.push(`    if (formData.${rule.fieldName} && !/${rule.pattern.replace(/\\/g, '\\\\')}/g.test(formData.${rule.fieldName})) {
      newErrors.${rule.fieldName} = '${rule.message}';
      isValid = false;
    }`);
    }

    return checks.join(' else ');
  }).join('\n');

  return `'use client';

import React, { useState } from 'react';

interface FormDataType {
  [key: string]: string | string[];
}

interface ErrorsType {
  [key: string]: string;
}

export default function ${componentName}() {
  const [formData, setFormData] = useState<FormDataType>({});
  const [errors, setErrors] = useState<ErrorsType>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => {
      const current = (prev[name] as string[]) || [];
      if (checked) {
        return { ...prev, [name]: [...current, value] };
      } else {
        return { ...prev, [name]: current.filter(v => v !== value) };
      }
    });
  };

  const validateForm = (): boolean => {
    const newErrors: ErrorsType = {};
    let isValid = true;

${validationRulesCode}

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Add your form submission logic here
      alert('Form submitted successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div 
        className="mx-auto bg-white shadow-lg rounded-lg p-8"
        style={{ 
          width: '${formData.canvasConfig.width}',
          minHeight: '${formData.canvasConfig.height || '600px'}',
          backgroundColor: '${formData.canvasConfig.backgroundColor}'
        }}
      >
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-start' }}>
            ${componentsCode}
          </div>
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
