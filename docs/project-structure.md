# WiseBill - Financial Analysis App

## Tech Stack
- Package Manager: pnpm
- Frontend: React + TypeScript + Vite
- Styling: TailwindCSS + shadcn/ui
- Database: Supabase
- ORM: Drizzle
- Deployment: Vercel

## Project Structure
```
wisebill/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/           # shadcn components
│   │   ├── charts/       # financial charts components
│   │   ├── layout/       # layout components
│   │   └── analytics/    # analytics specific components
│   ├── lib/
│   │   ├── supabase.ts   # supabase client
│   │   └── utils.ts      # utility functions
│   ├── db/
│   │   ├── schema/       # drizzle schema definitions
│   │   └── migrations/   # database migrations
│   ├── types/           # TypeScript type definitions
│   ├── hooks/           # custom React hooks
│   └── styles/          # global styles
├── public/             # static assets
├── docs/              # documentation
├── config/            # configuration files
├── .npmrc            # pnpm configuration
├── pnpm-lock.yaml    # pnpm lock file
└── pnpm-workspace.yaml # pnpm workspace config
```

## Database Schema
```sql
Table transactions {
  id uuid pk
  user_id uuid
  amount decimal
  category varchar
  description text
  date timestamp
  created_at timestamp
  updated_at timestamp
}

Table categories {
  id uuid pk
  name varchar
  icon varchar
  color varchar
  created_at timestamp
}

Table budgets {
  id uuid pk
  category_id uuid
  amount decimal
  period varchar // monthly, yearly
  created_at timestamp
}
```

## Key Features
1. Transaction Management
   - Add/Edit/Delete transactions
   - Categorize transactions
   - Bulk import support

2. Analytics Dashboard
   - Monthly spending overview
   - Category-wise breakdown
   - Trend analysis
   - Budget tracking

3. Visualization
   - Pie charts for category distribution
   - Line charts for spending trends
   - Bar charts for budget comparison

4. Budget Management
   - Set category-wise budgets
   - Budget alerts
   - Progress tracking

## UI Components (shadcn)
- Card
- DataTable
- DatePicker
- Dropdown
- Charts
- Forms
- Modals
- Toast notifications

## Styling Guidelines
- Apple-inspired minimalist design
- Clean typography
- Subtle animations
- Responsive layout
- Dark/Light mode support

## Color Palette
```css
--primary: #007AFF;     /* iOS Blue */
--secondary: #5856D6;   /* iOS Purple */
--success: #34C759;     /* iOS Green */
--warning: #FF9500;     /* iOS Orange */
--danger: #FF3B30;      /* iOS Red */
--gray: #8E8E93;       /* iOS Gray */
--background: #F2F2F7;  /* iOS Light Background */
--text: #000000;       /* Primary Text */
``` 