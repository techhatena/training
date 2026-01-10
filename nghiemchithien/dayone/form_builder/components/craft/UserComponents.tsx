/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useNode, UserComponent } from '@craftjs/core';
import React from 'react';

// ========================
// Container Component (Canvas Root)
// ========================
interface ContainerProps {
    width?: string;
    height?: string;
    backgroundColor?: string;
    padding?: string;
    children?: React.ReactNode;
}

export const Container: UserComponent<ContainerProps> = ({
    width = '100%',
    height = '100%',
    backgroundColor = '#ffffff',
    padding = '20px',
    children,
}) => {
    const { connectors: { connect } } = useNode();
    const hasChildren = React.Children.count(children) > 0;

    return (
        <div
            ref={(ref) => { if (ref) connect(ref); }}
            style={{
                width,
                minHeight: height === '100%' ? '500px' : height,
                height: '100%',
                backgroundColor,
                padding,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                alignContent: 'flex-start',
                gap: '12px',
            }}
        >
            {children}
            {!hasChildren && (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        minHeight: '400px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px dashed #e0e0e0',
                        borderRadius: '8px',
                        color: '#9ca3af',
                        fontSize: '14px',
                    }}
                >
                    Kéo thả các thành phần form vào đây
                </div>
            )}
        </div>
    );
};

Container.craft = {
    displayName: 'Container',
    props: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        padding: '20px',
    },
    isCanvas: true,
    rules: {
        canDrag: () => false,
        canMoveIn: () => true,
    },
};

// ========================
// Column Width Options
// ========================
export type ColumnWidthType = '100%' | '50%' | '33.33%' | '25%';

export const COLUMN_WIDTH_OPTIONS: { value: ColumnWidthType; label: string }[] = [
    { value: '100%', label: 'Toàn bộ (100%)' },
    { value: '50%', label: 'Một nửa (1/2)' },
    { value: '33.33%', label: 'Một phần ba (1/3)' },
    { value: '25%', label: 'Một phần tư (1/4)' },
];

// ========================
// Base Form Element Wrapper - Now using flow layout with columnWidth
// ========================
interface FormElementWrapperProps {
    children: React.ReactNode;
    columnWidth?: ColumnWidthType;
}

const FormElementWrapper: React.FC<FormElementWrapperProps & { nodeRef: any, selected?: boolean }> = ({
    children,
    columnWidth = '100%',
    nodeRef,
    selected = false,
}) => {
    // Calculate actual width with gap consideration
    const getActualWidth = () => {
        switch (columnWidth) {
            case '50%': return 'calc(50% - 6px)';
            case '33.33%': return 'calc(33.33% - 8px)';
            case '25%': return 'calc(25% - 9px)';
            default: return '100%';
        }
    };

    return (
        <div
            ref={nodeRef}
            style={{
                width: getActualWidth(),
                cursor: 'move',
                flexShrink: 0,
            }}
            className={`rounded transition-all ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-2 hover:ring-blue-300'}`}
        >
            {children}
        </div>
    );
};

// ========================
// Common Props Interface
// ========================
interface BaseFormProps {
    label?: string;
    placeholder?: string;
    isRequired?: boolean;
    validationPattern?: string;
    validationMessage?: string;
    fontSize?: string;
    color?: string;
    backgroundColor?: string;
    borderRadius?: string;
    padding?: string;
    margin?: string;
    columnWidth?: ColumnWidthType;
    width?: string;
}

// ========================
// Text Input Component
// ========================
interface TextInputProps extends BaseFormProps {
    inputType?: 'text' | 'email' | 'password' | 'tel';
}

export const TextInput: UserComponent<TextInputProps> = ({
    label = 'Text Input',
    placeholder = 'Enter text',
    isRequired = false,
    fontSize = '14px',
    color = '#000000',
    backgroundColor = '#ffffff',
    borderRadius = '4px',
    padding = '8px',
    columnWidth = '100%',
    inputType = 'text',
}) => {
    const { connectors: { connect, drag }, selected } = useNode((state) => ({
        selected: state.events.selected,
    }));

    return (
        <FormElementWrapper columnWidth={columnWidth} selected={selected} nodeRef={(ref: HTMLDivElement) => { if (ref) connect(drag(ref)); }}>
            <div style={{ fontSize, color, backgroundColor, borderRadius, padding }}>
                <label className="block text-sm font-medium mb-1">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                    type={inputType}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                    style={{ pointerEvents: 'none' }}
                />
            </div>
        </FormElementWrapper>
    );
};

TextInput.craft = {
    displayName: 'TextInput',
    props: {
        label: 'Text Input',
        placeholder: 'Enter text',
        isRequired: false,
        fontSize: '14px',
        color: '#000000',
        backgroundColor: '#ffffff',
        borderRadius: '4px',
        padding: '8px',
        columnWidth: '100%',
        inputType: 'text',
    },
    related: {
        settings: () => null,
    },
};

// ========================
// Name Field Component - Supports 1, 2, or 3 input modes
// ========================
type NameInputModeType = '1' | '2' | '3';

export const NAME_INPUT_MODE_OPTIONS: { value: NameInputModeType; label: string }[] = [
    { value: '1', label: 'Họ và tên (1 ô)' },
    { value: '2', label: 'Họ + Tên (2 ô)' },
    { value: '3', label: 'Họ + Tên đệm + Tên (3 ô)' },
];

interface NameFieldProps extends BaseFormProps {
    prefix?: string;
    displayLabel?: boolean;
    nameInputMode?: NameInputModeType;
    keepSpace?: boolean;
    useCustomerName?: boolean;
}

export const NameField: UserComponent<NameFieldProps> = ({
    label = 'Name',
    placeholder = '',
    isRequired = true,
    displayLabel = true,
    nameInputMode = '1',
    fontSize = '14px',
    color = '#000000',
    backgroundColor = '#ffffff',
    borderRadius = '4px',
    padding = '8px',
    columnWidth = '100%',
}) => {
    const { connectors: { connect, drag }, selected } = useNode((state) => ({
        selected: state.events.selected,
    }));

    const renderInputs = () => {
        switch (nameInputMode) {
            case '1':
                return (
                    <input
                        type="text"
                        placeholder={placeholder || 'Họ và tên'}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        readOnly
                        style={{ pointerEvents: 'none' }}
                    />
                );
            case '2':
                return (
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="text"
                            placeholder="Họ"
                            className="px-3 py-2 border border-gray-300 rounded"
                            readOnly
                            style={{ pointerEvents: 'none' }}
                        />
                        <input
                            type="text"
                            placeholder="Tên"
                            className="px-3 py-2 border border-gray-300 rounded"
                            readOnly
                            style={{ pointerEvents: 'none' }}
                        />
                    </div>
                );
            case '3':
                return (
                    <div className="grid grid-cols-3 gap-2">
                        <input
                            type="text"
                            placeholder="Họ"
                            className="px-3 py-2 border border-gray-300 rounded"
                            readOnly
                            style={{ pointerEvents: 'none' }}
                        />
                        <input
                            type="text"
                            placeholder="Tên đệm"
                            className="px-3 py-2 border border-gray-300 rounded"
                            readOnly
                            style={{ pointerEvents: 'none' }}
                        />
                        <input
                            type="text"
                            placeholder="Tên"
                            className="px-3 py-2 border border-gray-300 rounded"
                            readOnly
                            style={{ pointerEvents: 'none' }}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <FormElementWrapper columnWidth={columnWidth} selected={selected} nodeRef={(ref: HTMLDivElement) => { if (ref) connect(drag(ref)); }}>
            <div style={{ fontSize, color, backgroundColor, borderRadius, padding }}>
                {displayLabel && (
                    <label className="block text-sm font-medium mb-1">
                        {label}
                        {isRequired && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                {renderInputs()}
            </div>
        </FormElementWrapper>
    );
};

NameField.craft = {
    displayName: 'NameField',
    props: {
        label: 'Name',
        placeholder: '',
        isRequired: true,
        displayLabel: true,
        nameInputMode: '1',
        fontSize: '14px',
        color: '#000000',
        backgroundColor: '#ffffff',
        borderRadius: '4px',
        padding: '8px',
        columnWidth: '100%',
        validationPattern: '^[a-zA-ZÀ-ỹĂ-ắÂ-ậĐđĨ-ịÔ-ộƠ-ờÚ-ứỲỹ\\s]{2,50}$',
        validationMessage: 'Tên phải từ 2-50 ký tự và chỉ chứa chữ cái',
    },
};

// ========================
// Email Field Component
// ========================
export const EmailField: UserComponent<BaseFormProps> = ({
    label = 'Email',
    placeholder = 'Enter your email',
    isRequired = true,
    fontSize = '14px',
    color = '#000000',
    backgroundColor = '#ffffff',
    borderRadius = '4px',
    padding = '8px',
    columnWidth = '100%',
}) => {
    const { connectors: { connect, drag }, selected } = useNode((state) => ({
        selected: state.events.selected,
    }));

    return (
        <FormElementWrapper columnWidth={columnWidth} selected={selected} nodeRef={(ref: HTMLDivElement) => { if (ref) connect(drag(ref)); }}>
            <div style={{ fontSize, color, backgroundColor, borderRadius, padding }}>
                <label className="block text-sm font-medium mb-1">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                    type="email"
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    readOnly
                    style={{ pointerEvents: 'none' }}
                />
            </div>
        </FormElementWrapper>
    );
};

EmailField.craft = {
    displayName: 'EmailField',
    props: {
        label: 'Email',
        placeholder: 'Enter your email',
        isRequired: true,
        fontSize: '14px',
        color: '#000000',
        backgroundColor: '#ffffff',
        borderRadius: '4px',
        padding: '8px',
        columnWidth: '100%',
        validationPattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        validationMessage: 'Please enter a valid email address',
    },
};

// ========================
// Password Field Component
// ========================
export const PasswordField: UserComponent<BaseFormProps> = ({
    label = 'Password',
    placeholder = 'Enter your password',
    isRequired = true,
    fontSize = '14px',
    color = '#000000',
    backgroundColor = '#ffffff',
    borderRadius = '4px',
    padding = '8px',
    columnWidth = '100%',
}) => {
    const { connectors: { connect, drag }, selected } = useNode((state) => ({
        selected: state.events.selected,
    }));

    return (
        <FormElementWrapper columnWidth={columnWidth} selected={selected} nodeRef={(ref: HTMLDivElement) => { if (ref) connect(drag(ref)); }}>
            <div style={{ fontSize, color, backgroundColor, borderRadius, padding }}>
                <label className="block text-sm font-medium mb-1">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                    type="password"
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    readOnly
                    style={{ pointerEvents: 'none' }}
                />
            </div>
        </FormElementWrapper>
    );
};

PasswordField.craft = {
    displayName: 'PasswordField',
    props: {
        label: 'Password',
        placeholder: 'Enter your password',
        isRequired: true,
        fontSize: '14px',
        color: '#000000',
        backgroundColor: '#ffffff',
        borderRadius: '4px',
        padding: '8px',
        columnWidth: '100%',
        validationPattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$',
        validationMessage: 'Password must be at least 8 characters with uppercase, lowercase, and number',
    },
};

// ========================
// Phone Field Component
// ========================
export const PhoneField: UserComponent<BaseFormProps> = ({
    label = 'Phone',
    placeholder = 'Enter your phone number',
    isRequired = false,
    fontSize = '14px',
    color = '#000000',
    backgroundColor = '#ffffff',
    borderRadius = '4px',
    padding = '8px',
    columnWidth = '100%',
}) => {
    const { connectors: { connect, drag }, selected } = useNode((state) => ({
        selected: state.events.selected,
    }));

    return (
        <FormElementWrapper columnWidth={columnWidth} selected={selected} nodeRef={(ref: HTMLDivElement) => { if (ref) connect(drag(ref)); }}>
            <div style={{ fontSize, color, backgroundColor, borderRadius, padding }}>
                <label className="block text-sm font-medium mb-1">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                    type="tel"
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    readOnly
                    style={{ pointerEvents: 'none' }}
                />
            </div>
        </FormElementWrapper>
    );
};

PhoneField.craft = {
    displayName: 'PhoneField',
    props: {
        label: 'Phone',
        placeholder: 'Enter your phone number',
        isRequired: false,
        fontSize: '14px',
        color: '#000000',
        backgroundColor: '#ffffff',
        borderRadius: '4px',
        padding: '8px',
        columnWidth: '100%',
        validationPattern: '^[+]?[0-9\\s\\-\\(\\)]{10,}$',
        validationMessage: 'Please enter a valid phone number',
    },
};

// ========================
// Address Field Component
// ========================
export const AddressField: UserComponent<BaseFormProps> = ({
    label = 'Address',
    placeholder = 'Enter your address',
    isRequired = false,
    fontSize = '14px',
    color = '#000000',
    backgroundColor = '#ffffff',
    borderRadius = '4px',
    padding = '8px',
    columnWidth = '100%',
}) => {
    const { connectors: { connect, drag }, selected } = useNode((state) => ({
        selected: state.events.selected,
    }));

    return (
        <FormElementWrapper columnWidth={columnWidth} selected={selected} nodeRef={(ref: HTMLDivElement) => { if (ref) connect(drag(ref)); }}>
            <div style={{ fontSize, color, backgroundColor, borderRadius, padding }}>
                <label className="block text-sm font-medium mb-1">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    readOnly
                    style={{ pointerEvents: 'none' }}
                />
            </div>
        </FormElementWrapper>
    );
};

AddressField.craft = {
    displayName: 'AddressField',
    props: {
        label: 'Address',
        placeholder: 'Enter your address',
        isRequired: false,
        fontSize: '14px',
        color: '#000000',
        backgroundColor: '#ffffff',
        borderRadius: '4px',
        padding: '8px',
        columnWidth: '100%',
    },
};

// ========================
// Postal Field Component
// ========================
export const PostalField: UserComponent<BaseFormProps> = ({
    label = 'Postal/Zipcode',
    placeholder = 'Enter postal code',
    isRequired = false,
    fontSize = '14px',
    color = '#000000',
    backgroundColor = '#ffffff',
    borderRadius = '4px',
    padding = '8px',
    columnWidth = '100%',
}) => {
    const { connectors: { connect, drag }, selected } = useNode((state) => ({
        selected: state.events.selected,
    }));

    return (
        <FormElementWrapper columnWidth={columnWidth} selected={selected} nodeRef={(ref: HTMLDivElement) => { if (ref) connect(drag(ref)); }}>
            <div style={{ fontSize, color, backgroundColor, borderRadius, padding }}>
                <label className="block text-sm font-medium mb-1">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    readOnly
                    style={{ pointerEvents: 'none' }}
                />
            </div>
        </FormElementWrapper>
    );
};

PostalField.craft = {
    displayName: 'PostalField',
    props: {
        label: 'Postal/Zipcode',
        placeholder: 'Enter postal code',
        isRequired: false,
        fontSize: '14px',
        color: '#000000',
        backgroundColor: '#ffffff',
        borderRadius: '4px',
        padding: '8px',
        columnWidth: '100%',
        validationPattern: '^[A-Za-z0-9\\s\\-]{3,10}$',
        validationMessage: 'Please enter a valid postal/zip code',
    },
};

// ========================
// Country Select Component
// ========================
export const CountrySelect: UserComponent<BaseFormProps> = ({
    label = 'Country',
    placeholder = 'Select country',
    isRequired = false,
    fontSize = '14px',
    color = '#000000',
    backgroundColor = '#ffffff',
    borderRadius = '4px',
    padding = '8px',
    columnWidth = '100%',
}) => {
    const { connectors: { connect, drag }, selected } = useNode((state) => ({
        selected: state.events.selected,
    }));

    return (
        <FormElementWrapper columnWidth={columnWidth} selected={selected} nodeRef={(ref: HTMLDivElement) => { if (ref) connect(drag(ref)); }}>
            <div style={{ fontSize, color, backgroundColor, borderRadius, padding }}>
                <label className="block text-sm font-medium mb-1">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                </label>
                <select
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    disabled
                    style={{ pointerEvents: 'none' }}
                >
                    <option value="">{placeholder}</option>
                    <option value="VN">Vietnam</option>
                    <option value="US">United States</option>
                    <option value="JP">Japan</option>
                </select>
            </div>
        </FormElementWrapper>
    );
};

CountrySelect.craft = {
    displayName: 'CountrySelect',
    props: {
        label: 'Country',
        placeholder: 'Select country',
        isRequired: false,
        fontSize: '14px',
        color: '#000000',
        backgroundColor: '#ffffff',
        borderRadius: '4px',
        padding: '8px',
        columnWidth: '100%',
    },
};

// ========================
// Language Select Component
// ========================
export const LanguageSelect: UserComponent<BaseFormProps> = ({
    label = 'Language',
    placeholder = 'Select language',
    isRequired = false,
    fontSize = '14px',
    color = '#000000',
    backgroundColor = '#ffffff',
    borderRadius = '4px',
    padding = '8px',
    columnWidth = '100%',
}) => {
    const { connectors: { connect, drag }, selected } = useNode((state) => ({
        selected: state.events.selected,
    }));

    return (
        <FormElementWrapper columnWidth={columnWidth} selected={selected} nodeRef={(ref: HTMLDivElement) => { if (ref) connect(drag(ref)); }}>
            <div style={{ fontSize, color, backgroundColor, borderRadius, padding }}>
                <label className="block text-sm font-medium mb-1">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                </label>
                <select
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    disabled
                    style={{ pointerEvents: 'none' }}
                >
                    <option value="">{placeholder}</option>
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                    <option value="ja">日本語</option>
                </select>
            </div>
        </FormElementWrapper>
    );
};

LanguageSelect.craft = {
    displayName: 'LanguageSelect',
    props: {
        label: 'Language',
        placeholder: 'Select language',
        isRequired: false,
        fontSize: '14px',
        color: '#000000',
        backgroundColor: '#ffffff',
        borderRadius: '4px',
        padding: '8px',
        columnWidth: '100%',
    },
};

// ========================
// Textarea Field Component
// ========================
interface TextareaFieldProps extends BaseFormProps {
    rows?: number;
}

export const TextareaField: UserComponent<TextareaFieldProps> = ({
    label = 'Textarea',
    placeholder = 'Enter text...',
    isRequired = false,
    fontSize = '14px',
    color = '#000000',
    backgroundColor = '#ffffff',
    borderRadius = '4px',
    padding = '8px',
    columnWidth = '100%',
    rows = 4,
}) => {
    const { connectors: { connect, drag }, selected } = useNode((state) => ({
        selected: state.events.selected,
    }));

    return (
        <FormElementWrapper columnWidth={columnWidth} selected={selected} nodeRef={(ref: HTMLDivElement) => { if (ref) connect(drag(ref)); }}>
            <div style={{ fontSize, color, backgroundColor, borderRadius, padding }}>
                <label className="block text-sm font-medium mb-1">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                </label>
                <textarea
                    placeholder={placeholder}
                    rows={rows}
                    className="w-full px-3 py-2 border border-gray-300 rounded resize-none"
                    readOnly
                    style={{ pointerEvents: 'none' }}
                />
            </div>
        </FormElementWrapper>
    );
};

TextareaField.craft = {
    displayName: 'TextareaField',
    props: {
        label: 'Textarea',
        placeholder: 'Enter text...',
        isRequired: false,
        fontSize: '14px',
        color: '#000000',
        backgroundColor: '#ffffff',
        borderRadius: '4px',
        padding: '8px',
        columnWidth: '100%',
        rows: 4,
    },
};

// ========================
// Checkbox Field Component
// ========================
interface CheckboxFieldProps extends BaseFormProps {
    options?: string[];
}

export const CheckboxField: UserComponent<CheckboxFieldProps> = ({
    label = 'Checkbox',
    isRequired = false,
    fontSize = '14px',
    color = '#000000',
    backgroundColor = '#ffffff',
    borderRadius = '4px',
    padding = '8px',
    columnWidth = '100%',
    options = ['Option 1', 'Option 2', 'Option 3'],
}) => {
    const { connectors: { connect, drag }, selected } = useNode((state) => ({
        selected: state.events.selected,
    }));

    return (
        <FormElementWrapper columnWidth={columnWidth} selected={selected} nodeRef={(ref: HTMLDivElement) => { if (ref) connect(drag(ref)); }}>
            <div style={{ fontSize, color, backgroundColor, borderRadius, padding }}>
                <label className="block text-sm font-medium mb-2">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="space-y-2">
                    {options.map((option, index) => (
                        <label key={index} className="flex items-center gap-2">
                            <input type="checkbox" disabled style={{ pointerEvents: 'none' }} />
                            <span className="text-sm">{option}</span>
                        </label>
                    ))}
                </div>
            </div>
        </FormElementWrapper>
    );
};

CheckboxField.craft = {
    displayName: 'CheckboxField',
    props: {
        label: 'Checkbox',
        isRequired: false,
        fontSize: '14px',
        color: '#000000',
        backgroundColor: '#ffffff',
        borderRadius: '4px',
        padding: '8px',
        columnWidth: '100%',
        options: ['Option 1', 'Option 2', 'Option 3'],
    },
};

// ========================
// Radio Field Component
// ========================
interface RadioFieldProps extends BaseFormProps {
    options?: string[];
}

export const RadioField: UserComponent<RadioFieldProps> = ({
    label = 'Radio',
    isRequired = false,
    fontSize = '14px',
    color = '#000000',
    backgroundColor = '#ffffff',
    borderRadius = '4px',
    padding = '8px',
    columnWidth = '100%',
    options = ['Option 1', 'Option 2', 'Option 3'],
}) => {
    const { connectors: { connect, drag }, selected } = useNode((state) => ({
        selected: state.events.selected,
    }));

    return (
        <FormElementWrapper columnWidth={columnWidth} selected={selected} nodeRef={(ref: HTMLDivElement) => { if (ref) connect(drag(ref)); }}>
            <div style={{ fontSize, color, backgroundColor, borderRadius, padding }}>
                <label className="block text-sm font-medium mb-2">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="space-y-2">
                    {options.map((option, index) => (
                        <label key={index} className="flex items-center gap-2">
                            <input type="radio" name="radio-group" disabled style={{ pointerEvents: 'none' }} />
                            <span className="text-sm">{option}</span>
                        </label>
                    ))}
                </div>
            </div>
        </FormElementWrapper>
    );
};

RadioField.craft = {
    displayName: 'RadioField',
    props: {
        label: 'Radio',
        isRequired: false,
        fontSize: '14px',
        color: '#000000',
        backgroundColor: '#ffffff',
        borderRadius: '4px',
        padding: '8px',
        columnWidth: '100%',
        options: ['Option 1', 'Option 2', 'Option 3'],
    },
};

// ========================
// Select Field Component
// ========================
interface SelectFieldProps extends BaseFormProps {
    options?: string[];
}

export const SelectField: UserComponent<SelectFieldProps> = ({
    label = 'Select',
    placeholder = 'Select an option',
    isRequired = false,
    fontSize = '14px',
    color = '#000000',
    backgroundColor = '#ffffff',
    borderRadius = '4px',
    padding = '8px',
    columnWidth = '100%',
    options = ['Option 1', 'Option 2', 'Option 3'],
}) => {
    const { connectors: { connect, drag }, selected } = useNode((state) => ({
        selected: state.events.selected,
    }));

    return (
        <FormElementWrapper columnWidth={columnWidth} selected={selected} nodeRef={(ref: HTMLDivElement) => { if (ref) connect(drag(ref)); }}>
            <div style={{ fontSize, color, backgroundColor, borderRadius, padding }}>
                <label className="block text-sm font-medium mb-1">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                </label>
                <select
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    disabled
                    style={{ pointerEvents: 'none' }}
                >
                    <option value="">{placeholder}</option>
                    {options.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
            </div>
        </FormElementWrapper>
    );
};

SelectField.craft = {
    displayName: 'SelectField',
    props: {
        label: 'Select',
        placeholder: 'Select an option',
        isRequired: false,
        fontSize: '14px',
        color: '#000000',
        backgroundColor: '#ffffff',
        borderRadius: '4px',
        padding: '8px',
        columnWidth: '100%',
        options: ['Option 1', 'Option 2', 'Option 3'],
    },
};

// ========================
// Button Field Component
// ========================
interface ButtonFieldProps extends BaseFormProps {
    buttonText?: string;
    buttonType?: 'submit' | 'button' | 'reset';
    buttonColor?: string;
    textColor?: string;
}

export const ButtonField: UserComponent<ButtonFieldProps> = ({
    buttonText = 'Submit',
    buttonType = 'submit',
    buttonColor = '#3b82f6',
    textColor = '#ffffff',
    fontSize = '14px',
    borderRadius = '4px',
    padding = '12px 24px',
    columnWidth = '100%',
}) => {
    const { connectors: { connect, drag }, selected } = useNode((state) => ({
        selected: state.events.selected,
    }));

    return (
        <FormElementWrapper columnWidth={columnWidth} selected={selected} nodeRef={(ref: HTMLDivElement) => { if (ref) connect(drag(ref)); }}>
            <button
                type={buttonType}
                style={{
                    backgroundColor: buttonColor,
                    color: textColor,
                    fontSize,
                    borderRadius,
                    padding,
                    width: '100%',
                    cursor: 'pointer',
                    border: 'none',
                    fontWeight: 500,
                }}
                disabled
            >
                {buttonText}
            </button>
        </FormElementWrapper>
    );
};

ButtonField.craft = {
    displayName: 'ButtonField',
    props: {
        buttonText: 'Submit',
        buttonType: 'submit',
        buttonColor: '#3b82f6',
        textColor: '#ffffff',
        fontSize: '14px',
        borderRadius: '4px',
        padding: '12px 24px',
        columnWidth: '100%',
    },
};

// ========================
// Switch Field Component
// ========================
export const SwitchField: UserComponent<BaseFormProps> = ({
    label = 'Toggle Switch',
    isRequired = false,
    fontSize = '14px',
    color = '#000000',
    backgroundColor = '#ffffff',
    borderRadius = '4px',
    padding = '8px',
    columnWidth = '100%',
}) => {
    const { connectors: { connect, drag }, selected } = useNode((state) => ({
        selected: state.events.selected,
    }));

    return (
        <FormElementWrapper columnWidth={columnWidth} selected={selected} nodeRef={(ref: HTMLDivElement) => { if (ref) connect(drag(ref)); }}>
            <div style={{ fontSize, color, backgroundColor, borderRadius, padding }}>
                <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                        <input type="checkbox" className="sr-only" disabled />
                        <div className="w-10 h-6 bg-gray-300 rounded-full shadow-inner"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"></div>
                    </div>
                    <span className="text-sm font-medium">
                        {label}
                        {isRequired && <span className="text-red-500 ml-1">*</span>}
                    </span>
                </label>
            </div>
        </FormElementWrapper>
    );
};

SwitchField.craft = {
    displayName: 'SwitchField',
    props: {
        label: 'Toggle Switch',
        isRequired: false,
        fontSize: '14px',
        color: '#000000',
        backgroundColor: '#ffffff',
        borderRadius: '4px',
        padding: '8px',
        columnWidth: '100%',
    },
};

// ========================
// Export all components resolver
// ========================
export const componentResolver = {
    Container,
    TextInput,
    NameField,
    EmailField,
    PasswordField,
    PhoneField,
    AddressField,
    PostalField,
    CountrySelect,
    LanguageSelect,
    TextareaField,
    CheckboxField,
    RadioField,
    SelectField,
    ButtonField,
    SwitchField,
};

// Component type mapping for sidebar
export const COMPONENT_TYPE_MAP: Record<string, keyof typeof componentResolver> = {
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
