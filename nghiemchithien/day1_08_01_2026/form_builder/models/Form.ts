import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFormComponent {
    id: string;
    type: string; // 'name_field', 'email', 'text', 'button', etc.
    properties: {
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
    };
    layout: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    styles: {
        fontSize?: string;
        color?: string;
        backgroundColor?: string;
        borderRadius?: string;
        padding?: string;
        margin?: string;
    };
}

export interface IForm extends Document {
    name: string;
    canvasConfig: {
        width: string;
        height?: string;
        backgroundColor: string;
    };
    components: IFormComponent[];
    createdAt: Date;
    updatedAt: Date;
}

const FormComponentSchema = new Schema({
    id: { type: String, required: true },
    type: { type: String, required: true },
    properties: {
        label: String,
        placeholder: String,
        isRequired: Boolean,
        options: [{ label: String, value: String }],
        prefix: String,
        useCustomerName: Boolean,
        fullName: Boolean,
        keepSpace: Boolean,
        displayLabel: Boolean,
    },
    layout: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
        w: { type: Number, required: true },
        h: { type: Number, required: true },
    },
    styles: {
        fontSize: String,
        color: String,
        backgroundColor: String,
        borderRadius: String,
        padding: String,
        margin: String,
    },
});

const FormSchema = new Schema({
    name: { type: String, required: true },
    canvasConfig: {
        width: { type: String, default: '800px' },
        height: { type: String, default: '600px' },
        backgroundColor: { type: String, default: '#ffffff' },
    },
    components: [FormComponentSchema],
}, { timestamps: true });

// Prevent model recompilation in development
const Form: Model<IForm> = mongoose.models.Form || mongoose.model<IForm>('Form', FormSchema);

export default Form;
