import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Favorites from './pages/Favorites'
import Checkout from './pages/Checkout'
import ConfirmarPagamento from './pages/ConfirmarPagamento'
import Orders from './pages/Orders'
import TrackingPublic from './pages/TrackingPublic'
import AdminPanel from './pages/AdminPanel'
// import Careers from './pages/Careers'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Componente para proteger rota de admin
const ProtectedAdminRoute = ({ element }) => {
  const user = localStorage.getItem('user')
  const currentUser = user ? JSON.parse(user) : null
  
  // Se não há usuário logado ou não é admin, redireciona
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/" replace />
  }
  
  return element
}

const App = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <SearchBar />
      <Navbar />
      
      <main className='flex-1 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/estoque' element={<Collection />} />
          <Route path='/sobre' element={<About />} />
          <Route path='/contato' element={<Contact />} />
          {/* <Route path='/carreiras' element={<Careers />} /> */}
          <Route path='/product/:productId' element={<Product />} />
          <Route path='/sacola' element={<Cart />} />
          <Route path='/login' element={<Login />} />
          <Route path='/perfil' element={<Profile />} />
          <Route path='/favoritos' element={<Favorites />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/confirmar-pagamento/:orderId' element={<ConfirmarPagamento />} />
          <Route path='/pedidos' element={<Orders />} />
          <Route path='/rastreamento' element={<TrackingPublic />} />
          <Route path='/admin' element={<ProtectedAdminRoute element={<AdminPanel />} />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  )
}

export default App
