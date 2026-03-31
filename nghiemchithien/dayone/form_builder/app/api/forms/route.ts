import dbConnect from '@/lib/mongodb';
import Form from '@/models/Form';
import { NextRequest, NextResponse } from 'next/server';

// GET all forms
export async function GET() {
    try {
        await dbConnect();
        const forms = await Form.find({}).sort({ updatedAt: -1 });
        return NextResponse.json({ success: true, data: forms });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch forms' },
            { status: 500 }
        );
    }
}

// POST create new form
export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();

        const form = await Form.create({
            name: body.name || 'Untitled Form',
            canvasConfig: body.canvasConfig || {
                width: '800px',
                height: '600px',
                backgroundColor: '#ffffff',
            },
            craftState: body.craftState || {},
        });

        return NextResponse.json({ success: true, data: form }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to create form' },
            { status: 500 }
        );
    }
}
