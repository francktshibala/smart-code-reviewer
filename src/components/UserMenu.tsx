import { useState, useRef, useEffect } from 'react';
import { User, LogOut, History, Settings, ChevronDown, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserMenuProps {
  onNavigate?: (page: 'dashboard' | 'analyzer') => void;
}

export function UserMenu({ onNavigate }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-blue-200 hover:bg-white hover:shadow-md transition-all duration-200 transform hover:scale-105"
      >
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-600">{user.email}</div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 transform transition-all duration-200 scale-100">
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="text-sm font-semibold text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-600">{user.email}</div>
            <div className="text-xs text-gray-500 mt-1">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Menu items */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onNavigate?.('dashboard');
              }}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150"
            >
              <BarChart3 className="w-4 h-4 text-gray-400" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onNavigate?.('analyzer');
              }}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150"
            >
              <History className="w-4 h-4 text-gray-400" />
              <span>Code Analyzer</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                // TODO: Navigate to settings
                console.log('Navigate to settings');
              }}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150"
            >
              <Settings className="w-4 h-4 text-gray-400" />
              <span>Settings</span>
            </button>

            <div className="border-t border-gray-100 my-2"></div>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors duration-150"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}