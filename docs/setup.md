# Project Setup Guide

## Initial Setup

```bash
# Create project with Vite
pnpm create vite wisebill --template react-ts

# Install dependencies
pnpm install

# UI dependencies
pnpm add @radix-ui/react-icons
pnpm add class-variance-authority
pnpm add clsx
pnpm add tailwindcss
pnpm add postcss
pnpm add autoprefixer
pnpm add tailwindcss-animate
pnpm add @types/node -D
pnpm add lucide-react

# shadcn/ui setup
pnpm add -D @shadcn/ui

# Database and API
pnpm add @supabase/supabase-js
pnpm add drizzle-orm postgres
pnpm add -D drizzle-kit @types/pg

# Charts
pnpm add recharts

# Utils
pnpm add date-fns
pnpm add zod
pnpm add @hookform/resolvers
pnpm add react-hook-form

# Development dependencies
pnpm add -D prettier prettier-plugin-tailwindcss
```

## Configuration Files

1. Create `.npmrc`:
```ini
shamefully-hoist=true
strict-peer-dependencies=false
```

2. Create `pnpm-workspace.yaml`:
```yaml
packages:
  - '.'
```

3. Update `package.json`:
```json
{
  "name": "wisebill",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "db:generate": "drizzle-kit generate:pg",
    "db:push": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio"
  }
}
```

## Post-Installation Steps

1. Initialize Tailwind:
```bash
pnpm dlx tailwindcss init -p
```

2. Initialize shadcn-ui:
```bash
pnpm dlx shadcn-ui@latest init
```

3. Configure components.json:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/styles/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

4. Create Supabase project and add environment variables to `.env`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_url
``` 