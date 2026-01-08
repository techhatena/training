import dbConnect from '@/lib/mongodb';
import Form from '@/models/Form';
import { NextRequest, NextResponse } from 'next/server';

// GET single form by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();
        const form = await Form.findById(id);

        if (!form) {
            return NextResponse.json(
                { success: false, error: 'Form not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: form });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch form' },
            { status: 500 }
        );
    }
}

// PUT update form by ID
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();
        const body = await request.json();

        // Debug log
        console.log('=== API PUT Request ===');
        console.log('body.canvasConfig:', body.canvasConfig);
        console.log('body.canvasConfig.height:', body.canvasConfig?.height);
        console.log('=====================');

        const form = await Form.findByIdAndUpdate(
            id,
            {
                name: body.name,
                canvasConfig: body.canvasConfig,
                components: body.components,
            },
            { new: true, runValidators: true }
        );

        console.log('=== After Update ===');
        console.log('Saved form.canvasConfig:', form?.canvasConfig);
        console.log('====================');

        if (!form) {
            return NextResponse.json(
                { success: false, error: 'Form not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: form });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to update form' },
            { status: 500 }
        );
    }
}

// DELETE form by ID
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();
        const form = await Form.findByIdAndDelete(id);

        if (!form) {
            return NextResponse.json(
                { success: false, error: 'Form not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to delete form' },
            { status: 500 }
        );
    }
}
