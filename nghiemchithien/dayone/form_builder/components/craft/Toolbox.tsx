'use client';

import {
    AddressField,
    ButtonField,
    CheckboxField,
    CountrySelect,
    EmailField,
    LanguageSelect,
    NameField,
    PasswordField,
    PhoneField,
    PostalField,
    RadioField,
    SelectField,
    SwitchField,
    TextareaField,
    TextInput,
} from '@/components/craft/UserComponents';
import { useEditor } from '@craftjs/core';
import {
    AlignLeft,
    CheckSquare,
    ChevronDown,
    Circle,
    Globe,
    Hash,
    Languages,
    Lock,
    Mail,
    MapPin,
    MousePointer2,
    Phone,
    ToggleLeft,
    Type,
    User,
} from 'lucide-react';

const FORM_ELEMENTS = {
    information: [
        { type: 'name_field', label: 'Họ và Tên', icon: User, component: NameField },
        { type: 'email', label: 'Email', icon: Mail, component: EmailField },
        { type: 'password', label: 'Mật Khẩu', icon: Lock, component: PasswordField },
        { type: 'phone', label: 'Số Điện Thoại', icon: Phone, component: PhoneField },
        { type: 'country', label: 'Quốc Gia', icon: Globe, component: CountrySelect },
        { type: 'language', label: 'Ngôn Ngữ', icon: Languages, component: LanguageSelect },
        { type: 'address', label: 'Địa Chỉ', icon: MapPin, component: AddressField },
        { type: 'postal', label: 'Mã Bưu Chính', icon: Hash, component: PostalField },
    ],
    textBoxes: [
        { type: 'text', label: 'Text Input', icon: Type, component: TextInput },
        { type: 'textarea', label: 'Textarea', icon: AlignLeft, component: TextareaField },
    ],
    choices: [
        { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, component: CheckboxField },
        { type: 'radio', label: 'Radio Button', icon: Circle, component: RadioField },
        { type: 'select', label: 'Dropdown', icon: ChevronDown, component: SelectField },
        { type: 'button', label: 'Button', icon: MousePointer2, component: ButtonField },
        { type: 'switch', label: 'Switch', icon: ToggleLeft, component: SwitchField },
    ],
};

interface ToolboxItemProps {
    label: string;
    icon: React.ElementType;
    component: React.ComponentType<any>;
}

function ToolboxItem({ label, icon: Icon, component: Component }: ToolboxItemProps) {
    const { connectors, query } = useEditor();

    return (
        <div
            ref={(ref) => {
                if (ref) {
                    connectors.create(ref, <Component />);
                }
            }}
            draggable={true}
            className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-grab hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm hover:shadow active:cursor-grabbing"
        >
            <div className="p-2 bg-blue-100 rounded-lg">
                <Icon className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
    );
}

export function Toolbox() {
    return (
        <div className="w-72 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Thành phần Form</h2>

                {/* Information Fields */}
                <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Thông tin cá nhân
                    </h3>
                    <div className="space-y-2">
                        {FORM_ELEMENTS.information.map((element) => (
                            <ToolboxItem
                                key={element.type}
                                label={element.label}
                                icon={element.icon}
                                component={element.component}
                            />
                        ))}
                    </div>
                </div>

                {/* Text Boxes */}
                <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Nhập văn bản
                    </h3>
                    <div className="space-y-2">
                        {FORM_ELEMENTS.textBoxes.map((element) => (
                            <ToolboxItem
                                key={element.type}
                                label={element.label}
                                icon={element.icon}
                                component={element.component}
                            />
                        ))}
                    </div>
                </div>

                {/* Choice Elements */}
                <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Lựa chọn & Hành động
                    </h3>
                    <div className="space-y-2">
                        {FORM_ELEMENTS.choices.map((element) => (
                            <ToolboxItem
                                key={element.type}
                                label={element.label}
                                icon={element.icon}
                                component={element.component}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
