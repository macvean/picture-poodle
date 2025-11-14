# Postcard Poodle 🐩

Transform your photos into whimsical postcards with silly filters! Upload an image, choose from fun filters like "Mustache & Monocle", "Neon Dog", "Pixel Vomit", or "1990s Lens Flare", add a custom message, and download your personalized postcard.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js) or **yarn** or **pnpm** or **bun**

You can check if you have Node.js installed by running:
```bash
node --version
```

## Installation

1. Navigate to the project directory:
   ```bash
   cd picture-poodle
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   
   Or if you prefer using another package manager:
   ```bash
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

   **Note:** If you encounter peer dependency conflicts (especially with React 19), you can use:
   ```bash
   npm install --legacy-peer-deps
   ```
   This flag tells npm to use the legacy peer dependency resolution algorithm, which is more permissive.

3. **Set up OpenAI API Key** (for AI message generation):
   
   Create a `.env.local` file in the `picture-poodle` directory:
   ```bash
   touch .env.local
   ```
   
   Add your OpenAI API key to the file:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   **Important Security Notes:**
   - Never commit your `.env.local` file to git (it's already in `.gitignore`)
   - Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - The API key is only used server-side and never exposed to the client
   
   **Note:** The AI message generation feature is optional. The app will work without it, but the "Generate with AI" button will show an error if the API key is not configured.

## Launching the App

### Development Mode

To start the development server:

```bash
npm run dev
```

Or with other package managers:
```bash
yarn dev
# or
pnpm dev
# or
bun dev
```

Once the server is running, open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

The page will automatically reload when you make changes to the code.

### Production Build

To create an optimized production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

The production server will also run on [http://localhost:3000](http://localhost:3000) by default.

## How to Use

1. **Upload a Photo**: Click or drag and drop an image into the upload area
2. **Choose a Filter**: Select from the available filters:
   - Original 📸
   - Mustache & Monocle 🎩
   - Neon Dog 🌈
   - Pixel Vomit 🎮
   - 1990s Lens Flare ✨
3. **Add a Message**: 
   - Type your own message (up to 60 characters), or
   - Click "Generate with AI" to create a playful message using OpenAI GPT (context-aware based on your selected filter!)
4. **Download**: Click the "Download My Postcard" button to save your creation

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues

## Tech Stack

- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icons
- **OpenAI GPT** - AI-powered message generation

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
