// src/components/Layout.jsx
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout({ children, title }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title={title} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  )
}
