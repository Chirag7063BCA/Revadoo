import React from 'react'
import Navbar from '../components/globalcomp/Navbar';
import Footer from '../components/globalcomp/Footer';
import { Outlet } from 'react-router-dom';
import ScrollToTop from '../components/globalcomp/ScrollToTop';
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <ScrollToTop />
      <Navbar/>
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout
