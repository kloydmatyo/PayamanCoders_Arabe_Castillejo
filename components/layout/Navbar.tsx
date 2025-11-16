'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { User, LogOut, Settings, Bell, Bookmark } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Navbar() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()
  const { user, loading, logout } = useAuth()

  const isAuthenticated = !!user

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications()
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.notifications?.filter((n: any) => !n.read).length || 0)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setShowUserMenu(false)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const AuthenticatedNav = () => (
    <>
      {/* Notifications */}
      <div className="relative">
        {/* Bookmarks Button */}
        <Link
          href="/bookmarks"
          className="group relative flex items-center justify-center h-10 w-10 rounded-full border border-primary-500/40 bg-white/70 text-secondary-700 shadow-lg shadow-primary-700/20 backdrop-blur-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 hover:border-primary-500/60 hover:bg-white/80 hover:text-primary-600 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300"
          title="My Bookmarks"
        >
          <Bookmark className="h-5 w-5" />
        </Link>

        {/* Notifications Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowNotifications(!showNotifications)
          }}
          className="group relative flex items-center justify-center h-10 w-10 rounded-full border border-primary-500/40 bg-white/70 text-secondary-700 shadow-lg shadow-primary-700/20 backdrop-blur-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 hover:border-primary-500/60 hover:bg-white/80 hover:text-primary-600 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-white">
              {unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-primary-500/40 bg-white/90 shadow-2xl shadow-primary-700/20 backdrop-blur-xl animate-[floatUp_0.3s_ease-out]">
            <div className="p-4 border-b border-primary-500/20">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-secondary-600">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className="p-3 hover:bg-primary-50/50 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      {!notification.read && (
                        <div className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-blue-500"></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${notification.read ? 'text-secondary-600' : 'font-medium text-gray-900'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-secondary-500 mt-1">
                          {new Date(notification.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-3 border-t border-primary-500/20 text-center">
                <Link
                  href="/notifications"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                  onClick={() => setShowNotifications(false)}
                >
                  View all notifications
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowUserMenu(!showUserMenu)
          }}
          className="group relative flex items-center gap-2 sm:gap-3 rounded-full border border-primary-500/40 bg-white/70 px-2 sm:px-3 py-2 text-secondary-700 shadow-lg shadow-primary-700/20 backdrop-blur-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 hover:border-primary-500/60 hover:bg-white/80 hover:text-primary-600 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300"
        >
          <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-primary-500/25 ring-2 ring-white/50 group-hover:scale-110 transition-all duration-300">
            {user?.firstName?.[0] && user?.lastName?.[0] ? (
              <span className="relative z-10">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
            ) : (
              <User className="relative z-10 h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </div>
          <div className="hidden sm:flex flex-col items-start min-w-0">
            <span className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-300 truncate max-w-[120px]">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="text-xs text-secondary-600 capitalize truncate max-w-[120px]">
              {user?.role?.replace('_', ' ')}
            </span>
          </div>
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-primary-500/20 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10"></div>
        </button>

        {showUserMenu && (
          <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-primary-500/40 bg-white/80 p-4 shadow-2xl shadow-primary-700/20 backdrop-blur-xl animate-[floatUp_0.3s_ease-out]">
            <div className="relative rounded-xl border border-primary-500/30 bg-gradient-to-br from-primary-500/10 via-white/60 to-secondary-500/10 px-5 py-4 mb-3 shadow-inner shadow-primary-700/10 backdrop-blur">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-secondary-500/5 rounded-xl"></div>
              <div className="relative">
                <div className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-1">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-sm font-medium text-secondary-600 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  {user?.email}
                </div>
              </div>
            </div>
            <Link
              href="/profile"
              className="group relative flex items-center gap-4 rounded-xl px-5 py-3.5 text-base font-medium text-secondary-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-primary-500/20 hover:to-secondary-500/20 hover:text-primary-600 hover:shadow-lg hover:shadow-primary-500/20 border border-transparent hover:border-primary-500/30"
              onClick={() => setShowUserMenu(false)}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary-500/30 bg-primary-500/15 text-primary-600 shadow-inner shadow-primary-700/20 group-hover:bg-primary-500/25 group-hover:border-primary-500/50 transition-all duration-300">
                <Settings className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="flex-1">Profile Settings</span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="h-1 w-1 rounded-full bg-primary-500 animate-pulse"></div>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="group relative flex w-full items-center gap-4 rounded-xl px-5 py-3.5 text-left text-base font-medium text-red-600 transition-all duration-300 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/20 hover:text-red-700 hover:shadow-lg hover:shadow-red-500/20 border border-transparent hover:border-red-500/30 mt-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/15 text-red-600 shadow-inner shadow-red-700/20 group-hover:bg-red-500/25 group-hover:border-red-500/50 transition-all duration-300">
                <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="flex-1">Sign Out</span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="h-1 w-1 rounded-full bg-red-500 animate-pulse"></div>
              </div>
            </button>
          </div>
        )}
      </div>
    </>
  )

  const UnauthenticatedNav = () => (
    <>
      <Link href="/auth/login" className="btn-primary text-sm px-4 py-2 whitespace-nowrap">
        Sign In
      </Link>
      <Link href="/auth/register" className="btn-secondary text-sm px-4 py-2 whitespace-nowrap">
        Sign Up
      </Link>
    </>
  )

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showUserMenu) {
        setShowUserMenu(false)
      }
      if (showNotifications) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showUserMenu, showNotifications])

  return (
    <nav className="relative z-50 border-b border-white/30 bg-white/60 shadow-lg shadow-primary-900/10 backdrop-blur-2xl transition-all duration-500">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo - Always visible, hidden on desktop only when user is authenticated (sidebar shows it) */}
          <div className={`flex items-center flex-shrink-0 ${isAuthenticated ? 'lg:hidden' : ''}`}>
            <Link href="/" className="group flex items-center">
              <span className="brand-logo text-lg sm:text-xl lg:text-2xl group-hover:-translate-y-0.5 group-hover:scale-[1.06] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.35)] group-hover:animate-brandPulse whitespace-nowrap">
                WorkQit
              </span>
            </Link>
          </div>

          {/* Right side - User menu or auth buttons */}
          <div className="flex items-center gap-2 ml-auto">
            {loading ? (
              <div className="flex space-x-4 animate-pulse">
                <div className="h-8 w-24 rounded-full bg-white/60"></div>
              </div>
            ) : isAuthenticated ? (
              <AuthenticatedNav />
            ) : (
              <UnauthenticatedNav />
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}