'use client';

import { Container } from '@/components/craft/UserComponents';
import { Element, Frame } from '@craftjs/core';

interface CanvasProps {
    canvasConfig: {
        width: string;
        height?: string;
        backgroundColor: string;
    };
    setCanvasConfig: (config: { width: string; height?: string; backgroundColor: string }) => void;
}

export function Canvas({ canvasConfig }: CanvasProps) {
    return (
        <div className="flex-1 bg-gray-100 overflow-auto p-8">
            <div
                className="mx-auto bg-white shadow-xl rounded-lg border border-gray-200"
                style={{
                    width: canvasConfig.width,
                    minHeight: canvasConfig.height || '600px',
                    backgroundColor: canvasConfig.backgroundColor,
                }}
            >
                <Frame>
                    <Element
                        is={Container}
                        canvas
                        width="100%"
                        height="100%"
                        backgroundColor="transparent"
                        padding="20px"
                    >
                    </Element>
                </Frame>
            </div>
        </div>
    );
}
