import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiArrowLeft, FiAlertTriangle } from "react-icons/fi";

const NotFoundPage = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-12 text-center">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
                <FiAlertTriangle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-8xl font-bold text-white mb-2">404</h1>
              <p className="text-2xl font-semibold text-white mb-2">Page Not Found</p>
              <p className="text-orange-100">The page you're looking for doesn't exist or has been moved.</p>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-10">
            {/* Error Details */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <p className="text-sm text-gray-500 mb-2">Requested URL:</p>
              <code className="text-sm font-mono text-gray-700 bg-gray-100 px-3 py-2 rounded-lg block break-all">
                {currentPath}
              </code>
            </div>

            {/* Helpful Message */}
            <div className="text-center mb-8">
              <p className="text-gray-600 mb-4">
                Oops! The page you're trying to access doesn't exist. 
                It might have been removed, renamed, or didn't exist in the first place.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-300 hover:shadow-lg"
                >
                  <FiHome className="w-5 h-5" />
                  Go to Homepage
                </Link>
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300"
                >
                  <FiArrowLeft className="w-5 h-5" />
                  Go Back
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500 text-center mb-4">You might want to try these pages:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Link to="/" className="text-sm text-orange-600 hover:text-orange-700 text-center py-2 px-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                  Home
                </Link>
                <Link to="/dashboard" className="text-sm text-orange-600 hover:text-orange-700 text-center py-2 px-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                  Dashboard
                </Link>
                <Link to="/about" className="text-sm text-orange-600 hover:text-orange-700 text-center py-2 px-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                  About
                </Link>
                <Link to="/contact" className="text-sm text-orange-600 hover:text-orange-700 text-center py-2 px-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                  Contact
                </Link>
                <Link to="/blog" className="text-sm text-orange-600 hover:text-orange-700 text-center py-2 px-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                  Blog
                </Link>
                <Link to="/authpage" className="text-sm text-orange-600 hover:text-orange-700 text-center py-2 px-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Need help? <a href="/contact" className="text-orange-500 hover:text-orange-600">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;