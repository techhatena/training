/* eslint-disable @typescript-eslint/no-explicit-any */
export const FORM_ELEMENTS = {
    information: [
        { id: 'name_field', label: 'Name', icon: 'User', type: 'name_field' },
        { id: 'email', label: 'Email', icon: 'Mail', type: 'email' },
        { id: 'password', label: 'Password', icon: 'Lock', type: 'password' },
        { id: 'phone', label: 'Phone', icon: 'Phone', type: 'phone' },
        { id: 'country', label: 'Country', icon: 'Globe', type: 'country' },
        { id: 'language', label: 'Language', icon: 'Languages', type: 'language' },
        { id: 'address', label: 'Address', icon: 'MapPin', type: 'address' },
        { id: 'postal', label: 'Postal/Zipcode', icon: 'Mail', type: 'postal' },
    ],
    textBoxes: [
        { id: 'text', label: 'Text', icon: 'Type', type: 'text' },
        { id: 'textarea', label: 'Textarea', icon: 'AlignLeft', type: 'textarea' },
    ],
    choices: [
        { id: 'checkbox', label: 'Checkbox / Swatch', icon: 'CheckSquare', type: 'checkbox' },
        { id: 'radio', label: 'Radio / Swatch', icon: 'Circle', type: 'radio' },
        { id: 'select', label: 'Select / Dropdown', icon: 'ChevronDown', type: 'select' },
        { id: 'button', label: 'Button', icon: 'RectangleHorizontal', type: 'button' },
        { id: 'switch', label: 'Switch', icon: 'ToggleRight', type: 'switch' },
    ],
};

export const DEFAULT_COMPONENT_PROPS: Record<string, any> = {
    name_field: {
        label: 'Name',
        placeholder: '',
        isRequired: true,
        prefix: '',
        displayLabel: true,
        fullName: false,
        keepSpace: false,
        useCustomerName: false,
    },
    email: {
        label: 'Email',
        placeholder: 'Enter your email',
        isRequired: true,
    },
    password: {
        label: 'Password',
        placeholder: 'Enter your password',
        isRequired: true,
    },
    phone: {
        label: 'Phone',
        placeholder: 'Enter your phone number',
        isRequired: false,
    },
    country: {
        label: 'Country',
        placeholder: 'Select country',
        isRequired: false,
    },
    language: {
        label: 'Language',
        placeholder: 'Select language',
        isRequired: false,
    },
    address: {
        label: 'Address',
        placeholder: 'Enter your address',
        isRequired: false,
    },
    postal: {
        label: 'Postal/Zipcode',
        placeholder: 'Enter postal code',
        isRequired: false,
    },
    text: {
        label: 'Text Input',
        placeholder: 'Enter text',
        isRequired: false,
    },
    textarea: {
        label: 'Text Area',
        placeholder: 'Enter your message',
        isRequired: false,
    },
    checkbox: {
        label: 'Checkbox',
        isRequired: false,
        options: [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
        ],
    },
    radio: {
        label: 'Radio',
        isRequired: false,
        options: [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
        ],
    },
    select: {
        label: 'Select',
        placeholder: 'Choose an option',
        isRequired: false,
        options: [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
        ],
    },
    button: {
        label: 'Submit',
    },
    switch: {
        label: 'Toggle Switch',
        isRequired: false,
    },
};

export const DEFAULT_STYLES = {
    fontSize: '14px',
    color: '#000000',
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    padding: '8px',
    margin: '0px',
};

export const DEFAULT_LAYOUT = {
    w: 4,
    h: 2,
    minW: 2,
    minH: 1,
};
