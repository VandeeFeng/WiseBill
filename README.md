# WiseBill - Personal Finance Management

WiseBill is a modern personal finance management application built with React and TypeScript. It helps users track expenses, analyze spending patterns, and manage their financial health through an intuitive and visually appealing interface.

Integrate this [shortcut](https://www.icloud.com/shortcuts/f61df2c45b6843e690fcd131ed903bd6) to automatically record and store expense data in the database.

## Features

- **Dashboard Overview**: Get a quick snapshot of your financial health, including total balance, monthly spending, and savings.
- **Transaction Management**: Log, categorize, and track all your financial transactions.
- **Analytics & Visualization**: Visualize your spending patterns with interactive charts, including monthly spending trends and category breakdowns.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Dark/Light Mode**: Support for both dark and light themes.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: TailwindCSS, shadcn/ui components
- **State Management**: React hooks
- **Routing**: React Router
- **Data Visualization**: Chart.js, react-chartjs-2
- **Database**: Supabase postgreSQL with Drizzle ORM

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm
- PostgreSQL database

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/vandeefeng/wisebill.git
   cd wisebill
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgresql_url
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   INITIAL_AUTHOR_KEY=YourSecretKey
   # Optional: set to 'true' to update an existing author key
   UPDATE_AUTHOR_KEY=false
   # Set to 'true' to enable database setup on first deployment
   # Set to 'false' for subsequent deployments
   ENABLE_DB_SETUP=true
   ```

4. Initialize the database with Drizzle
   ```bash
   # Generate migration files
   pnpm db:generate
   
   # Set up the database with tables, security and initial data
   pnpm db:setup
   ```

5. Start the development server
   ```bash
   pnpm dev
   ```

## Project Structure

```
wisebill/
├── docs/                 # Documentation
├── drizzle/              # Database migrations and schema
├── public/               # Public assets
├── src/
│   ├── assets/           # Static assets
│   ├── components/
│   │   ├── dashboard/    # Dashboard-specific components
│   │   ├── layout/       # Layout components
│   │   ├── transactions/ # Transaction-related components
│   │   └── ui/           # Reusable UI components
│   ├── db/               # Database configuration
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and helpers
│   ├── pages/            # Page components
│   │   └── transactions/ # Transaction pages
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main App component
│   ├── index.css         # Global styles
│   └── main.tsx          # Entry point
├── .env                  # Environment variables
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## Usage

The application is organized into several main sections:

- **Dashboard**: The home page provides an overview of your financial status.
- **Transactions**: View, add, edit, and filter your transactions.
- **Analytics**: Explore detailed charts and insights about your spending habits.

## Security: Author Key

WiseBill implements a secure author key mechanism:

- All sensitive operations require author key validation
- The key is stored securely in the database (not in frontend code)
- Validation happens through Supabase RPC functions
- No key values are exposed in client-side code

This ensures only authorized users can access real data while maintaining security.

## Development

- Run dev server: `pnpm dev`
- Build for production: `pnpm build`
- Preview production build: `pnpm preview`
- Database operations:
  - Generate migrations: `pnpm db:generate`
  - Push schema to database: `pnpm db:push`
  - Open Drizzle Studio: `pnpm db:studio`

## Deployment on Vercel

1. Fork this repository to your GitHub account
2. Create a new project on Vercel and connect it to your fork
3. Set up environment variables:
   ```
   DATABASE_URL=postgresql_url
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   INITIAL_AUTHOR_KEY=YourSecretKey
   ENABLE_DB_SETUP=true
   ```
4. Deploy the project
5. After the first successful deployment, set `ENABLE_DB_SETUP=false` to prevent 
   running database setup on subsequent deployments

For manual database operations, you can run:
```bash
# Generate migration files
vercel env pull .env.local
pnpm db:generate
pnpm db:setup
```

## License

MIT
