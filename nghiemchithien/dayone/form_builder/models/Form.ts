import mongoose, { Document, Model, Schema } from 'mongoose';

// Craft.js SerializedNode structure
export interface SerializedNode {
    type: {
        resolvedName: string;
    };
    isCanvas?: boolean;
    props: Record<string, unknown>;
    displayName?: string;
    custom?: Record<string, unknown>;
    parent?: string | null;
    nodes: string[];
    linkedNodes?: Record<string, string>;
    hidden?: boolean;
}

// The complete serialized state from Craft.js
export interface CraftState {
    [nodeId: string]: SerializedNode;
}

// Form document interface
export interface IForm extends Document {
    name: string;
    canvasConfig: {
        width: string;
        height?: string;
        backgroundColor: string;
    };
    // Craft.js serialized state
    craftState: CraftState;
    createdAt: Date;
    updatedAt: Date;
}

// Schema for storing Craft.js state - using Mixed type for flexibility
const FormSchema = new Schema({
    name: { type: String, required: true },
    canvasConfig: {
        width: { type: String, default: '800px' },
        height: { type: String, default: '600px' },
        backgroundColor: { type: String, default: '#ffffff' },
    },
    // Store the entire Craft.js serialized state
    craftState: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

// Prevent model recompilation in development
const Form: Model<IForm> = mongoose.models.Form || mongoose.model<IForm>('Form', FormSchema);

export default Form;

// Component properties interfaces for type safety
export interface BaseComponentProps {
    label?: string;
    placeholder?: string;
    isRequired?: boolean;
    validationPattern?: string;
    validationMessage?: string;
    // Styles
    fontSize?: string;
    color?: string;
    backgroundColor?: string;
    borderRadius?: string;
    padding?: string;
    margin?: string;
    // Layout
    width?: string;
    height?: string;
    position?: { x: number; y: number };
}

export interface NameFieldProps extends BaseComponentProps {
    prefix?: string;
    displayLabel?: boolean;
    fullName?: boolean;
    keepSpace?: boolean;
    useCustomerName?: boolean;
}

export interface SelectableProps extends BaseComponentProps {
    options?: Array<{ label: string; value: string }>;
}

export interface ContainerProps {
    width?: string;
    height?: string;
    backgroundColor?: string;
    padding?: string;
    flexDirection?: 'row' | 'column';
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
}
