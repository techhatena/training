'use client';

import { Canvas } from '@/components/craft/Canvas';
import { SettingsPanel } from '@/components/craft/SettingsPanel';
import { Toolbox } from '@/components/craft/Toolbox';
import { componentResolver } from '@/components/craft/UserComponents';
import { generateJSON, generateTSX } from '@/lib/exportTSX';
import { CraftState } from '@/models/Form';
import { Editor, SerializedNodes, useEditor } from '@craftjs/core';
import { ArrowLeft, Download, PanelLeft, PanelRight, Save } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

interface FormData {
    _id?: string;
    name: string;
    canvasConfig: {
        width: string;
        height?: string;
        backgroundColor: string;
    };
    craftState: CraftState;
}

// Component to load saved state into editor
function EditorStateLoader({
    craftState,
    editorActionsRef
}: {
    craftState: CraftState;
    editorActionsRef: React.MutableRefObject<any>;
}) {
    const { actions, query } = useEditor();
    const hasLoadedRef = useRef(false);

    useEffect(() => {
        // Store query ref for save/export
        editorActionsRef.current = query;

        // Load saved state if exists and not already loaded
        if (!hasLoadedRef.current && craftState && Object.keys(craftState).length > 0) {
            hasLoadedRef.current = true;
            try {
                // Deserialize the saved state - cast to SerializedNodes
                actions.deserialize(craftState as SerializedNodes);
            } catch (error) {
                console.error('Error loading saved state:', error);
            }
        }
    }, [craftState, actions, query, editorActionsRef]);

    return null;
}

export default function EditorPage() {
    const params = useParams();
    const router = useRouter();
    const formId = params.id as string;
    const isNew = formId === 'new';

    const [formData, setFormData] = useState<FormData>({
        name: 'Untitled Form',
        canvasConfig: {
            width: '800px',
            height: '600px',
            backgroundColor: '#ffffff',
        },
        craftState: {},
    });

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [leftSidebarVisible, setLeftSidebarVisible] = useState(true);
    const [rightSidebarVisible, setRightSidebarVisible] = useState(true);
    const [editorKey, setEditorKey] = useState(0);
    const editorActionsRef = useRef<any>(null);

    useEffect(() => {
        if (!isNew) {
            fetchForm();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formId]);

    const fetchForm = async () => {
        try {
            const response = await fetch(`/api/forms/${formId}`);
            const result = await response.json();
            if (result.success) {
                const formDataWithDefaults = {
                    ...result.data,
                    canvasConfig: {
                        ...result.data.canvasConfig,
                        height: result.data.canvasConfig.height || '600px',
                    },
                    craftState: result.data.craftState || {},
                };
                setFormData(formDataWithDefaults);
                setEditorKey(prev => prev + 1); // Force editor remount with new state
            }
        } catch (error) {
            console.error('Error fetching form:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);

        try {
            // Get current craft state from ref
            let craftState = formData.craftState;

            if (editorActionsRef.current) {
                const query = editorActionsRef.current;
                craftState = query.getSerializedNodes();
            }

            const dataToSave = {
                ...formData,
                craftState,
            };

            const url = isNew ? '/api/forms' : `/api/forms/${formId}`;
            const method = isNew ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSave),
            });

            const result = await response.json();
            if (result.success) {
                if (isNew) {
                    router.push(`/editor/${result.data._id}`);
                }
                toast.success('Lưu form thành công!');
            }
        } catch (error) {
            console.error('Error saving form:', error);
            toast.error('Lưu form thất bại!');
        } finally {
            setSaving(false);
        }
    };

    const handleExport = () => {
        let craftState = formData.craftState;

        if (editorActionsRef.current) {
            craftState = editorActionsRef.current.getSerializedNodes();
        }

        const exportData = {
            ...formData,
            craftState,
        };

        const tsxCode = generateTSX(exportData);
        const blob = new Blob([tsxCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formData.name.replace(/\s+/g, '_')}.tsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleExportJson = () => {
        let craftState = formData.craftState;

        if (editorActionsRef.current) {
            craftState = editorActionsRef.current.getSerializedNodes();
        }

        const exportData = {
            ...formData,
            craftState,
        };

        const jsonData = generateJSON(exportData);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formData.name.replace(/\s+/g, '_')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const setCanvasConfig = (config: { width: string; height?: string; backgroundColor: string }) => {
        setFormData(prev => ({
            ...prev,
            canvasConfig: config,
        }));
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-ping opacity-75"></div>
                    <div className="relative w-20 h-20 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                    <div className="absolute inset-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 opacity-20 animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-800 px-6 py-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-white hover:text-blue-100 transition">
                        <ArrowLeft size={24} />
                    </Link>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="text-xl font-semibold bg-white/10 text-white placeholder-white/60 border-none outline-none focus:ring-2 focus:ring-white/40 px-4 py-2 rounded-lg backdrop-blur-sm"
                        placeholder="Tên form..."
                    />
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setLeftSidebarVisible(!leftSidebarVisible)}
                        className={`flex items-center gap-2 px-3 py-2.5 text-white border rounded-lg transition-all duration-200 backdrop-blur-sm font-medium ${leftSidebarVisible
                            ? 'bg-white/20 hover:bg-white/30 border-white/30'
                            : 'bg-gray-600/80 hover:bg-gray-600 border-gray-700'
                            }`}
                        title="Toggle Elements Panel"
                    >
                        <PanelLeft size={18} />
                    </button>
                    <button
                        onClick={() => setRightSidebarVisible(!rightSidebarVisible)}
                        className={`flex items-center gap-2 px-3 py-2.5 text-white border rounded-lg transition-all duration-200 backdrop-blur-sm font-medium ${rightSidebarVisible
                            ? 'bg-white/20 hover:bg-white/30 border-white/30'
                            : 'bg-gray-600/80 hover:bg-gray-600 border-gray-700'
                            }`}
                        title="Toggle Properties Panel"
                    >
                        <PanelRight size={18} />
                    </button>

                    <button
                        onClick={handleExportJson}
                        className="flex items-center gap-2 px-5 py-2.5 text-white bg-green-600/80 hover:bg-green-600 border border-green-700 rounded-lg transition-all duration-200 backdrop-blur-sm font-medium"
                    >
                        <Download size={18} />
                        Export JSON
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-5 py-2.5 text-white bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm font-medium"
                    >
                        <Download size={18} />
                        Export TSX
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white text-blue-700 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md font-medium"
                    >
                        <Save size={18} />
                        {saving ? 'Đang lưu...' : 'Lưu'}
                    </button>
                </div>
            </header>

            {/* Main Editor */}
            <div className="flex-1 flex overflow-hidden">
                <Editor
                    key={editorKey}
                    resolver={componentResolver}
                    enabled={true}
                    onRender={({ render }) => render}
                >
                    {leftSidebarVisible && <Toolbox />}
                    <Canvas
                        canvasConfig={formData.canvasConfig}
                        setCanvasConfig={setCanvasConfig}
                    />
                    {rightSidebarVisible && <SettingsPanel />}
                    <EditorStateLoader
                        craftState={formData.craftState}
                        editorActionsRef={editorActionsRef}
                    />
                </Editor>
            </div>
        </div>
    );
}
