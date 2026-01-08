// Global type definitions for the Form Builder application

export interface FormComponent {
    id: string;
    type: FormElementType;
    properties: ComponentProperties;
    layout: ComponentLayout;
    styles: ComponentStyles;
}

export type FormElementType =
    | 'name_field'
    | 'email'
    | 'password'
    | 'phone'
    | 'country'
    | 'language'
    | 'address'
    | 'postal'
    | 'text'
    | 'textarea'
    | 'checkbox'
    | 'radio'
    | 'select'
    | 'button'
    | 'switch';

export interface ComponentProperties {
    label?: string;
    placeholder?: string;
    isRequired?: boolean;
    options?: Array<{ label: string; value: string }>;
    // Name field specific
    prefix?: string;
    useCustomerName?: boolean;
    fullName?: boolean;
    keepSpace?: boolean;
    displayLabel?: boolean;
}

export interface ComponentLayout {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface ComponentStyles {
    fontSize?: string;
    color?: string;
    backgroundColor?: string;
    borderRadius?: string;
    padding?: string;
    margin?: string;
}

export interface CanvasConfig {
    width: string;
    backgroundColor: string;
}

export interface Form {
    _id?: string;
    name: string;
    canvasConfig: CanvasConfig;
    components: FormComponent[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
