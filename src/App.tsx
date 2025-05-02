import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Dashboard } from '@/pages/Dashboard'
import TransactionsPage from '@/pages/transactions/page'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { Toaster } from '@/components/ui/toaster'
import { AuthorProvider } from '@/lib/AuthorContext'

function App() {
  return (
    <AuthorProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            {/* Other routes will be added here */}
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </AuthorProvider>
  )
}

export default App
