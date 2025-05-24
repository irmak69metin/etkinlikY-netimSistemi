import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { ShoppingCartProvider } from './contexts/ShoppingCartContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Layout from './components/layout/Layout'
import { UserInterestProvider } from './contexts/UserInterestContext'

// Lazy-loaded page components for better performance
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const DashboardHome = lazy(() => import('./pages/DashboardHome'))
const Events = lazy(() => import('./pages/Events'))
const EventCreate = lazy(() => import('./pages/EventCreate'))
const EventDetails = lazy(() => import('./pages/EventDetails'))
const EventEdit = lazy(() => import('./pages/EventEdit'))
const Unauthorized = lazy(() => import('./pages/Unauthorized'))
const NotFound = lazy(() => import('./pages/NotFound'))
const SearchResults = lazy(() => import('./pages/SearchResults'))
const MyTickets = lazy(() => import('./pages/MyTickets'))
const FirstTimePasswordChange = lazy(() => import('./pages/FirstTimePasswordChange'))
const CartPage = lazy(() => import('./pages/CartPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
// const ResponsiveTest = lazy(() => import('./pages/ResponsiveTest'))

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    <span className="ml-3 text-lg font-medium text-primary">Loading...</span>
  </div>
)

function App() { 
  return (
    <AuthProvider>
      <UserInterestProvider>
        <ShoppingCartProvider>
          <Router>
            <Suspense fallback={<LoadingFallback />}>
              <Layout>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:id" element={<EventDetails />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route path="/cart" element={<CartPage />} />
                  {/* <Route path="/responsive-test" element={<ResponsiveTest />} /> */}
                  
                  {/* First-time password change route - requires auth but allowed with password change flag */}
                  <Route element={<ProtectedRoute allowWithPasswordChange={true} />}>
                    <Route path="/change-password" element={<FirstTimePasswordChange />} />
                  </Route>
                  
                  {/* Protected routes - require authentication */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardHome />} />
                  </Route>
                  
                  {/* Protected routes - require authentication and activated account */}
                  <Route element={<ProtectedRoute requireActive={true} />}>
                    <Route path="/my-tickets" element={<MyTickets />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                  </Route>
                  
                  {/* Admin routes - require admin role */}
                  <Route element={<ProtectedRoute requireAdmin={true} />}>
                    <Route path="/events/create" element={<EventCreate />} />
                    <Route path="/events/:id/edit" element={<EventEdit />} />
                  </Route>
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </Suspense>
          </Router>
        </ShoppingCartProvider>
      </UserInterestProvider>
    </AuthProvider>
  )
}

export default App
