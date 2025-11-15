'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Menu, X, User, Briefcase, Users, BookOpen, LogOut, Settings, FileText } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading, logout } = useAuth()

  const isAuthenticated = !!user

  const isActive = (href: string) => {
    if (!pathname) return false
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
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
      <div className="hidden md:flex items-center gap-3">
        <Link
          href="/dashboard"
          className={`nav-link ${isActive('/dashboard') ? 'nav-link-active' : ''}`}
        >
          Dashboard
        </Link>
        <Link href="/jobs" className={`nav-link group ${isActive('/jobs') ? 'nav-link-active' : ''}`}>
          <Briefcase className="nav-icon text-secondary-500 group-hover:text-primary-500" />
          Jobs
        </Link>
        {user?.role === 'job_seeker' && (
          <>
            <Link href="/resume-builder" className={`nav-link group ${isActive('/resume-builder') ? 'nav-link-active' : ''}`}>
              <FileText className="nav-icon text-secondary-500 group-hover:text-primary-500" />
              Resume Builder
            </Link>
            <Link href="/applications" className={`nav-link group ${isActive('/applications') ? 'nav-link-active' : ''}`}>
              <FileText className="nav-icon text-secondary-500 group-hover:text-primary-500" />
              My Applications
            </Link>
          </>
        )}
        <Link href="/career-map" className={`nav-link group ${isActive('/career-map') ? 'nav-link-active-yellow' : ''}`}>
          <BookOpen className={`nav-icon ${isActive('/career-map') ? 'text-yellow-500' : 'text-secondary-500 group-hover:text-primary-500'}`} />
          Career Map
        </Link>
        <Link href="/community" className={`nav-link group ${isActive('/community') ? 'nav-link-active-green' : ''}`}>
          <Users className={`nav-icon ${isActive('/community') ? 'text-green-500' : 'text-secondary-500 group-hover:text-primary-500'}`} />
          Community
        </Link>
      </div>
      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="group relative flex items-center gap-3 rounded-full border border-primary-500/40 bg-white/70 px-4 py-2.5 text-secondary-700 shadow-lg shadow-primary-700/20 backdrop-blur-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white hover:border-primary-500/60 hover:bg-white/80 hover:text-primary-600 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300"
        >
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 text-base font-semibold text-white shadow-inner shadow-primary-900/20 ring-2 ring-primary-500/30 group-hover:ring-primary-500/60 group-hover:scale-110 transition-all duration-300">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-primary-700/30 to-transparent"></div>
            {user?.firstName?.[0] && user?.lastName?.[0] ? (
              <span className="relative z-10">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
            ) : (
              <User className="relative z-10 h-6 w-6" />
            )}
            <div className="absolute -inset-1 rounded-full bg-primary-500/40 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span className="hidden text-base font-semibold lg:block group-hover:text-primary-600 transition-colors duration-300">{user?.firstName}</span>
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
      <Link href="/jobs" className={`nav-link group ${isActive('/jobs') ? 'nav-link-active' : ''}`}>
        <Briefcase className="nav-icon text-secondary-500 group-hover:text-primary-500" />
        Jobs
      </Link>
      <Link href="/career-map" className={`nav-link group ${isActive('/career-map') ? 'nav-link-active-yellow' : ''}`}>
        <BookOpen className={`nav-icon ${isActive('/career-map') ? 'text-yellow-500' : 'text-secondary-500 group-hover:text-primary-500'}`} />
        Career Map
      </Link>
      <Link href="/community" className={`nav-link group ${isActive('/community') ? 'nav-link-active-green' : ''}`}>
        <Users className={`nav-icon ${isActive('/community') ? 'text-green-500' : 'text-secondary-500 group-hover:text-primary-500'}`} />
        Community
      </Link>
      <Link href="/auth/login" className="btn-primary">
        Sign In
      </Link>
      <Link href="/auth/register" className="btn-secondary">
        Sign Up
      </Link>
    </>
  )

  const MobileAuthenticatedNav = () => (
    <>
      <Link href="/jobs" className={`nav-link-block ${isActive('/jobs') ? 'nav-link-block-active' : ''}`}>
        Jobs
      </Link>
      {user?.role === 'job_seeker' && (
        <Link href="/applications" className={`nav-link-block ${isActive('/applications') ? 'nav-link-block-active' : ''}`}>
          My Applications
        </Link>
      )}
      <Link href="/career-map" className={`nav-link-block ${isActive('/career-map') ? 'nav-link-block-active-yellow' : ''}`}>
        Career Map
      </Link>
      <Link href="/community" className={`nav-link-block ${isActive('/community') ? 'nav-link-block-active-green' : ''}`}>
        Community
      </Link>
      <Link href="/dashboard" className={`nav-link-block ${isActive('/dashboard') ? 'nav-link-block-active' : ''}`}>
        Dashboard
      </Link>
      <Link href="/profile" className={`nav-link-block ${isActive('/profile') ? 'nav-link-block-active' : ''}`}>
        Profile Settings
      </Link>
      <div className="mt-3 border-t border-white/50 pt-3">
        <div className="px-3 py-2 text-base font-medium text-secondary-600">
          {user?.firstName} {user?.lastName}
        </div>
        <button
          onClick={handleLogout}
          className="nav-link-block text-left text-red-500 hover:bg-red-50/80"
        >
          Sign Out
        </button>
      </div>
    </>
  )

  const MobileUnauthenticatedNav = () => (
    <>
      <Link href="/jobs" className={`nav-link-block ${isActive('/jobs') ? 'nav-link-block-active' : ''}`}>
        Jobs
      </Link>
      <Link href="/career-map" className={`nav-link-block ${isActive('/career-map') ? 'nav-link-block-active-yellow' : ''}`}>
        Career Map
      </Link>
      <Link href="/community" className={`nav-link-block ${isActive('/community') ? 'nav-link-block-active-green' : ''}`}>
        Community
      </Link>
      <Link href="/auth/login" className="nav-link-block font-semibold text-primary-600">
        Sign In
      </Link>
      <Link href="/auth/register" className="nav-link-block">
        Sign Up
      </Link>
    </>
  )

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showUserMenu])

  return (
    <nav className="relative z-50 border-b border-white/30 bg-white/60 shadow-lg shadow-primary-900/10 backdrop-blur-2xl transition-all duration-500">
      <div className="mx-auto flex max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="group flex items-center gap-3">
              <span className="brand-logo group-hover:-translate-y-0.5 group-hover:scale-[1.06] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.35)] group-hover:animate-brandPulse">
                WorkQit
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-4 md:flex">
            {loading ? (
              <div className="flex space-x-4 animate-pulse">
                <div className="h-4 w-16 rounded-full bg-white/60"></div>
                <div className="h-4 w-20 rounded-full bg-white/60"></div>
                <div className="h-8 w-24 rounded-full bg-white/60"></div>
              </div>
            ) : isAuthenticated ? (
              <AuthenticatedNav />
            ) : (
              <UnauthenticatedNav />
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-xl border border-white/40 bg-white/70 p-2 text-secondary-700 shadow-lg shadow-primary-900/10 backdrop-blur transition-all duration-300 hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        >
          <div className="mt-2 rounded-2xl border border-white/40 bg-white/70 p-3 shadow-2xl shadow-primary-900/10 backdrop-blur-xl">
            <div className="space-y-1">
              {loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 w-20 rounded-full bg-white/70"></div>
                  <div className="h-4 w-24 rounded-full bg-white/70"></div>
                  <div className="h-4 w-16 rounded-full bg-white/70"></div>
                </div>
              ) : isAuthenticated ? (
                <MobileAuthenticatedNav />
              ) : (
                <MobileUnauthenticatedNav />
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}