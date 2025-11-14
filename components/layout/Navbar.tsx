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
      <div className="hidden md:block">
        <div className="ml-10 flex items-baseline space-x-3">
          <Link
            href="/dashboard"
            className={`nav-link ${isActive('/dashboard') ? 'nav-link-active' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            href="/counter-demo"
            className={`nav-link ${isActive('/counter-demo') ? 'nav-link-active' : ''}`}
          >
            Counter Demo
          </Link>
          <Link
            href="/counter-comparison"
            className={`nav-link ${isActive('/counter-comparison') ? 'nav-link-active' : ''}`}
          >
            Props vs Context
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
          <Link href="/career-map" className={`nav-link group ${isActive('/career-map') ? 'nav-link-active' : ''}`}>
            <BookOpen className="nav-icon text-secondary-500 group-hover:text-primary-500" />
            Career Map
          </Link>
          <Link href="/community" className={`nav-link group ${isActive('/community') ? 'nav-link-active' : ''}`}>
            <Users className="nav-icon text-secondary-500 group-hover:text-primary-500" />
            Community
          </Link>
        </div>
      </div>
      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-3 rounded-full border border-white/40 bg-white/60 px-3 py-2 text-secondary-700 shadow-lg shadow-primary-900/10 backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white hover:text-primary-600 transition-all duration-300"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-base font-semibold text-white shadow-inner shadow-primary-900/10">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <span className="hidden text-base font-semibold lg:block">{user?.firstName}</span>
        </button>

        {showUserMenu && (
          <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-white/30 bg-white/70 p-3 shadow-2xl shadow-primary-900/10 backdrop-blur-xl">
            <div className="rounded-xl border border-white/30 bg-white/60 px-4 py-3 text-base text-secondary-600 shadow-inner shadow-primary-900/5">
              <div className="text-lg font-semibold text-primary-600">{user?.firstName} {user?.lastName}</div>
              <div className="text-sm text-secondary-500">{user?.email}</div>
            </div>
            <Link
              href="/profile"
              className="mt-2 flex items-center gap-3 rounded-xl px-4 py-2.5 text-base text-secondary-600 transition-colors duration-300 hover:bg-white/70 hover:text-primary-600"
              onClick={() => setShowUserMenu(false)}
            >
              <Settings className="nav-icon text-primary-500" />
              Profile Settings
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-base text-red-500 transition-colors duration-300 hover:bg-red-50/80"
            >
              <LogOut className="nav-icon text-red-500" />
              Sign Out
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
      <Link href="/career-map" className={`nav-link group ${isActive('/career-map') ? 'nav-link-active' : ''}`}>
        <BookOpen className="nav-icon text-secondary-500 group-hover:text-primary-500" />
        Career Map
      </Link>
      <Link href="/community" className={`nav-link group ${isActive('/community') ? 'nav-link-active' : ''}`}>
        <Users className="nav-icon text-secondary-500 group-hover:text-primary-500" />
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
      <Link href="/career-map" className={`nav-link-block ${isActive('/career-map') ? 'nav-link-block-active' : ''}`}>
        Career Map
      </Link>
      <Link href="/community" className={`nav-link-block ${isActive('/community') ? 'nav-link-block-active' : ''}`}>
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
      <Link href="/career-map" className={`nav-link-block ${isActive('/career-map') ? 'nav-link-block-active' : ''}`}>
        Career Map
      </Link>
      <Link href="/community" className={`nav-link-block ${isActive('/community') ? 'nav-link-block-active' : ''}`}>
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