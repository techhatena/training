/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { getValidationPresetsByType, VALIDATION_PRESETS, ValidationPresetKey } from '@/lib/validationPresets';
import { useEditor } from '@craftjs/core';
import { Settings, Trash2 } from "lucide-react";
import { COLUMN_WIDTH_OPTIONS, NAME_INPUT_MODE_OPTIONS } from './UserComponents';

// Settings component that will be displayed in the sidebar
export function SettingsPanel() {
    const { actions, selected } = useEditor((state, query) => {
        const currentNodeId = state.events.selected.values().next().value;
        let selected;

        if (currentNodeId) {
            selected = {
                id: currentNodeId,
                name: state.nodes[currentNodeId]?.data.name,
                displayName: state.nodes[currentNodeId]?.data.displayName,
                props: state.nodes[currentNodeId]?.data.props,
                isDeletable: query.node(currentNodeId).isDeletable(),
            };
        }

        return {
            selected,
        };
    });

    if (!selected) {
        return (
            <div className="w-80 bg-gray-50 border-l border-gray-200 p-6">
                <div className="flex flex-col items-center justify-center text-center h-full">
                    <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    <p className="text-black font-medium mb-2">Chưa chọn phần tử</p>
                    <p className="text-sm text-black">Click vào một phần tử trên canvas để chỉnh sửa thuộc tính</p>
                </div>
            </div>
        );
    }

    const handlePropChange = (propName: string, value: any) => {
        actions.setProp(selected.id, (props: any) => {
            props[propName] = value;
        });
    };

    const handleDelete = () => {
        if (selected.isDeletable) {
            actions.delete(selected.id);
        }
    };

    const handleValidationPresetChange = (presetKey: ValidationPresetKey) => {
        const preset = VALIDATION_PRESETS[presetKey];
        if (preset) {
            actions.setProp(selected.id, (props: any) => {
                props.validationPattern = preset.pattern;
                props.validationMessage = preset.message;
            });
        }
    };

    const getComponentType = (): string => {
        const name = selected.displayName || selected.name || '';
        if (name.includes('Name')) return 'name_field';
        if (name.includes('Email')) return 'email';
        if (name.includes('Password')) return 'password';
        if (name.includes('Phone')) return 'phone';
        if (name.includes('Address')) return 'address';
        if (name.includes('Postal')) return 'postal';
        if (name.includes('Textarea')) return 'textarea';
        if (name.includes('Text')) return 'text';
        return 'text';
    };

    const validationPresets = getValidationPresetsByType(getComponentType());
    const props = selected.props || {};

    return (
        <div className={`w-80 bg-gray-50 border-l border-gray-200 overflow-y-auto `}>
            <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-black" />
                        <h2 className="text-lg font-semibold text-black">Thuộc tính</h2>
                    </div>
                    {selected.isDeletable && (
                        <button
                            onClick={handleDelete}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa phần tử"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Component Info */}
                <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-black font-medium">
                        {selected.displayName || selected.name}
                    </p>
                </div>

                {/* Properties */}
                <div className="space-y-4">
                    {/* Label */}
                    {props.label !== undefined && (
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Nhãn</label>
                            <input
                                type="text"
                                value={props.label || ''}
                                onChange={(e) => handlePropChange('label', e.target.value)}
                                style={{ color: '#000000' }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    )}

                    {/* Placeholder */}
                    {props.placeholder !== undefined && (
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Placeholder</label>
                            <input
                                type="text"
                                value={props.placeholder || ''}
                                onChange={(e) => handlePropChange('placeholder', e.target.value)}
                                style={{ color: '#000000' }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    )}

                    {/* Required */}
                    {props.isRequired !== undefined && (
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={props.isRequired || false}
                                onChange={(e) => handlePropChange('isRequired', e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label className="text-sm font-medium text-black">Bắt buộc</label>
                        </div>
                    )}

                    {/* Display Label (for NameField) */}
                    {props.displayLabel !== undefined && (
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={props.displayLabel || false}
                                onChange={(e) => handlePropChange('displayLabel', e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label className="text-sm font-medium text-black">Hiển thị nhãn</label>
                        </div>
                    )}

                    {/* Name Input Mode (for NameField) */}
                    {props.nameInputMode !== undefined && (
                        <div>
                            <label className="block text-sm font-medium text-black mb-2">Chế độ nhập tên</label>
                            <div className="space-y-2">
                                {NAME_INPUT_MODE_OPTIONS.map((option) => (
                                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="nameInputMode"
                                            value={option.value}
                                            checked={props.nameInputMode === option.value}
                                            onChange={(e) => handlePropChange('nameInputMode', e.target.value)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-black">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Column Width */}
                    {props.columnWidth !== undefined && (
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Độ rộng cột</label>
                            <select
                                value={props.columnWidth || '100%'}
                                onChange={(e) => handlePropChange('columnWidth', e.target.value)}
                                style={{ color: '#000000' }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {COLUMN_WIDTH_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Options (for checkbox, radio, select) */}
                    {props.options !== undefined && (
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">
                                Các lựa chọn (mỗi dòng một lựa chọn)
                            </label>
                            <textarea
                                value={(props.options || []).join('\n')}
                                onChange={(e) => handlePropChange('options', e.target.value.split('\n').filter(Boolean))}
                                rows={4}
                                style={{ color: '#000000' }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                        </div>
                    )}

                    {/* Button Text */}
                    {props.buttonText !== undefined && (
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Nội dung nút</label>
                            <input
                                type="text"
                                value={props.buttonText || ''}
                                onChange={(e) => handlePropChange('buttonText', e.target.value)}
                                style={{ color: '#000000' }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    )}

                    {/* Button Color */}
                    {props.buttonColor !== undefined && (
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Màu nút</label>
                            <input
                                type="color"
                                value={props.buttonColor || '#3b82f6'}
                                onChange={(e) => handlePropChange('buttonColor', e.target.value)}
                                className="w-full h-10 rounded-lg cursor-pointer"
                            />
                        </div>
                    )}

                    {/* Text Color */}
                    {props.textColor !== undefined && (
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Màu chữ nút</label>
                            <input
                                type="color"
                                value={props.textColor || '#ffffff'}
                                onChange={(e) => handlePropChange('textColor', e.target.value)}
                                className="w-full h-10 rounded-lg cursor-pointer"
                            />
                        </div>
                    )}

                    {/* Rows (for textarea) */}
                    {props.rows !== undefined && (
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Số dòng</label>
                            <input
                                type="number"
                                min={2}
                                max={20}
                                value={props.rows || 4}
                                onChange={(e) => handlePropChange('rows', parseInt(e.target.value))}
                                style={{ color: '#000000' }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    )}

                    {/* Validation Section */}
                    {(props.validationPattern !== undefined || validationPresets.length > 0) && (
                        <div className="pt-4 border-t border-gray-200">
                            <h3 className="text-sm font-semibold text-black mb-3">Validation</h3>

                            {validationPresets.length > 0 && (
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-black mb-1">Preset</label>
                                    <select
                                        onChange={(e) => handleValidationPresetChange(e.target.value as ValidationPresetKey)}
                                        style={{ color: '#000000' }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Chọn preset...</option>
                                        {validationPresets.map((preset) => (
                                            <option key={preset.key} value={preset.key}>
                                                {preset.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="mb-3">
                                <label className="block text-sm font-medium text-black mb-1">Pattern (Regex)</label>
                                <input
                                    type="text"
                                    value={props.validationPattern || ''}
                                    onChange={(e) => handlePropChange('validationPattern', e.target.value)}
                                    placeholder="^[a-zA-Z]+$"
                                    style={{ color: '#000000' }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black mb-1">Thông báo lỗi</label>
                                <input
                                    type="text"
                                    value={props.validationMessage || ''}
                                    onChange={(e) => handlePropChange('validationMessage', e.target.value)}
                                    placeholder="Vui lòng nhập đúng định dạng"
                                    style={{ color: '#000000' }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    )}

                    {/* Style Section */}
                    <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-black mb-3">Kiểu dáng</h3>

                        {props.fontSize !== undefined && (
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-600 mb-1">Cỡ chữ</label>
                                <select
                                    value={props.fontSize || '14px'}
                                    onChange={(e) => handlePropChange('fontSize', e.target.value)}
                                    style={{ color: '#000000' }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="12px">12px</option>
                                    <option value="14px">14px</option>
                                    <option value="16px">16px</option>
                                    <option value="18px">18px</option>
                                    <option value="20px">20px</option>
                                </select>
                            </div>
                        )}

                        {props.color !== undefined && (
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-600 mb-1">Màu chữ</label>
                                <input
                                    type="color"
                                    value={props.color || '#000000'}
                                    onChange={(e) => handlePropChange('color', e.target.value)}
                                    className="w-full h-10 rounded-lg cursor-pointer"
                                />
                            </div>
                        )}

                        {props.backgroundColor !== undefined && (
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-600 mb-1">Màu nền</label>
                                <input
                                    type="color"
                                    value={props.backgroundColor || '#ffffff'}
                                    onChange={(e) => handlePropChange('backgroundColor', e.target.value)}
                                    className="w-full h-10 rounded-lg cursor-pointer"
                                />
                            </div>
                        )}

                        {props.borderRadius !== undefined && (
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-600 mb-1">Bo góc</label>
                                <select
                                    value={props.borderRadius || '4px'}
                                    onChange={(e) => handlePropChange('borderRadius', e.target.value)}
                                    style={{ color: '#000000' }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="0px">Không bo</option>
                                    <option value="4px">Nhỏ (4px)</option>
                                    <option value="8px">Vừa (8px)</option>
                                    <option value="12px">Lớn (12px)</option>
                                    <option value="16px">Rất lớn (16px)</option>
                                </select>
                            </div>
                        )}

                        {props.padding !== undefined && (
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Padding</label>
                                <select
                                    value={props.padding || '8px'}
                                    onChange={(e) => handlePropChange('padding', e.target.value)}
                                    style={{ color: '#000000' }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="4px">Nhỏ (4px)</option>
                                    <option value="8px">Vừa (8px)</option>
                                    <option value="12px">Lớn (12px)</option>
                                    <option value="16px">Rất lớn (16px)</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
