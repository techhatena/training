# Form Builder Application

A comprehensive form builder application built with Next.js, TypeScript, Tailwind CSS, and MongoDB Atlas. This application allows users to create, manage, design, and export custom forms with a drag-and-drop interface.

## Features

### ✨ Core Functionality
- **Dashboard**: View all forms with create, edit, and delete capabilities
- **Visual Editor**: Drag-and-drop interface for form building
- **Real-time Preview**: See your form as you build it
- **Component Properties**: Customize each form element's properties and styles
- **TSX Export**: Export forms as React TSX files
- **MongoDB Storage**: Persist forms to MongoDB Atlas

### 🎨 Form Elements

#### Information Fields
- Name (with prefix, first/last name support)
- Email, Password, Phone
- Country, Language
- Address, Postal/Zipcode

#### Text Inputs
- Single-line Text
- Multi-line Textarea

#### Choice Elements
- Checkbox, Radio buttons
- Select dropdown
- Button, Toggle Switch

### ⚙️ Customization Options
- **Properties**: Label, placeholder, required status, options
- **Styles**: Font size, text color, background color, border radius, padding
- **Layout**: Position, width, height

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React

## Getting Started

First, install dependencies:

```bash
npm install
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
