import { useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ currentTab, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleNav = (tab) => {
    if (onNavigate) {
      onNavigate(tab);
    }
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => handleNav("dashboard")}
            className="flex items-center gap-2 font-bold text-xl text-indigo-600 focus:outline-none"
          >
            <User size={22} />
            CareerCoach AI
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => handleNav("dashboard")}
              className={`font-medium transition-colors ${
                currentTab === "dashboard" ? "text-indigo-600 font-semibold" : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              ATS Resume Match
            </button>
            <button
              onClick={() => handleNav("interview")}
              className={`font-medium transition-colors ${
                currentTab === "interview" ? "text-indigo-600 font-semibold" : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              Mock Interview
            </button>

            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                <span className="text-sm font-medium text-gray-700">Hi, {user.name}</span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium cursor-pointer"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNav("login")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === "login"
                      ? "text-indigo-600 bg-indigo-50 font-semibold"
                      : "text-gray-600 hover:text-indigo-600"
                  }`}
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav("register")}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 p-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {isOpen && (
          <div className="md:hidden pb-4 pt-2 flex flex-col gap-2 border-t border-gray-100">
            <button
              onClick={() => handleNav("dashboard")}
              className="text-left text-gray-600 hover:text-indigo-600 font-medium py-2"
            >
              ATS Resume Match
            </button>
            <button
              onClick={() => handleNav("interview")}
              className="text-left text-gray-600 hover:text-indigo-600 font-medium py-2"
            >
              Mock Interview
            </button>
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="text-left text-red-600 font-medium py-2"
              >
                Logout ({user.name})
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleNav("login")}
                  className="text-left text-gray-600 hover:text-indigo-600 font-medium py-2"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav("register")}
                  className="text-left text-indigo-600 font-medium py-2"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}