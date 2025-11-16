'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  Home,
  Briefcase,
  FileText,
  BookOpen,
  Users,
  Video,
  Award,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Target,
  MessageCircle,
  TrendingUp,
  Calendar,
  Building2,
  UserPlus,
  Shield,
  BarChart3
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles?: string[]
  badge?: string
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Don't render sidebar if user is not authenticated
  if (!user) {
    return null
  }

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname?.startsWith(path)
  }

  const navItems: NavItem[] = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Jobs', href: '/jobs', icon: Briefcase },
    { 
      label: 'Resume Builder', 
      href: '/resume-builder', 
      icon: FileText,
      roles: ['job_seeker']
    },
    { 
      label: 'My Applications', 
      href: '/applications', 
      icon: Target,
      roles: ['job_seeker']
    },
    { label: 'Career Map', href: '/career-map', icon: TrendingUp },
    { label: 'Webinars', href: '/webinars', icon: Video },
    { label: 'Mentors', href: '/mentors', icon: Users },
    { 
      label: 'My Mentorship', 
      href: '/my-mentorship', 
      icon: UserPlus,
      roles: ['job_seeker', 'student']
    },
    { 
      label: 'Mentorship Requests', 
      href: '/mentorship/requests', 
      icon: Users,
      roles: ['mentor']
    },
    { label: 'Community', href: '/community', icon: MessageCircle },
    { 
      label: 'Assessments', 
      href: '/assessments', 
      icon: Award,
      roles: ['job_seeker', 'student']
    },
    { 
      label: 'Certificates', 
      href: '/certificates', 
      icon: Award,
      roles: ['job_seeker', 'student']
    },
    { 
      label: 'Resources', 
      href: '/resources', 
      icon: BookOpen,
      roles: ['mentor', 'admin']
    },
    { 
      label: 'Post Job', 
      href: '/jobs/new', 
      icon: Building2,
      roles: ['employer']
    },
    { 
      label: 'Create Assessment', 
      href: '/admin/assessments/create', 
      icon: Award,
      roles: ['admin']
    },
    { 
      label: 'Verification', 
      href: '/verification', 
      icon: Shield,
      roles: ['admin']
    },
    { 
      label: 'Analytics', 
      href: '/admin/analytics', 
      icon: BarChart3,
      roles: ['admin', 'employer']
    },
  ]

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true
    return user?.role && item.roles.includes(user.role)
  })

  const handleLogout = async () => {
    await logout()
    setIsMobileOpen(false)
  }

  const SidebarContent = () => (
    <>
      {/* Logo/Brand */}
      <div className={`relative flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-6 border-b border-white/40 bg-gradient-to-r from-primary-500/5 via-transparent to-secondary-500/5`}>
        {!isCollapsed && (
          <Link 
            href="/" 
            className="brand-logo text-2xl font-bold tracking-tight relative group/logo"
          >
            <span className="relative z-10">WorkQit</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-primary-500/20 rounded-xl opacity-0 group-hover/logo:opacity-100 blur-xl transition-opacity duration-500"></div>
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex items-center justify-center w-10 h-10 rounded-xl border border-white/40 bg-white/40 backdrop-blur transition-all duration-300 text-secondary-600 hover:text-primary-600 hover:border-primary-500/50 hover:bg-white/60 hover:scale-110 hover:shadow-lg hover:shadow-primary-500/30 group/btn"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
          ) : (
            <ChevronLeft className="w-5 h-5 group-hover/btn:-translate-x-0.5 transition-transform" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-4 pt-6 space-y-2">
        {filteredNavItems.map((item, index) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`
                relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-500 group/nav overflow-hidden
                ${active 
                  ? 'bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 text-white shadow-xl shadow-primary-500/40 scale-[1.02]' 
                  : 'text-secondary-700 hover:scale-[1.03] hover:shadow-lg hover:shadow-primary-500/20'
                }
                ${isCollapsed ? 'justify-center px-3' : ''}
              `}
              title={isCollapsed ? item.label : undefined}
              style={{ '--float-delay': `${index * 0.05}s` } as React.CSSProperties}
            >
              {/* Gradient overlay on hover */}
              {!active && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 opacity-0 group-hover/nav:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              )}
              
              {/* Active indicator glow */}
              {active && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400/30 via-secondary-400/30 to-primary-400/30 rounded-2xl animate-pulse"></div>
              )}
              
              <div className={`relative flex-shrink-0 ${isCollapsed ? 'w-7 h-7' : 'w-6 h-6'} flex items-center justify-center`}>
                <Icon className={`w-full h-full ${active ? 'drop-shadow-lg' : 'group-hover/nav:scale-110 group-hover/nav:drop-shadow-md'} transition-all duration-300`} />
                {active && (
                  <div className="absolute inset-0 bg-primary-300/40 rounded-full blur-md animate-pulse"></div>
                )}
              </div>
              
              {!isCollapsed && (
                <span className={`relative font-semibold text-base truncate flex-1 ${active ? 'text-white' : 'group-hover/nav:text-primary-600'} transition-colors duration-300`}>
                  {item.label}
                </span>
              )}
              
              {!isCollapsed && item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-lg shadow-red-500/40 animate-pulse">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/40 bg-gradient-to-r from-primary-500/5 via-transparent to-secondary-500/5 space-y-2">
        <Link
          href="/settings"
          onClick={() => setIsMobileOpen(false)}
          className={`
            relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-500 group/settings overflow-hidden
            text-secondary-700 hover:scale-[1.03] hover:shadow-lg hover:shadow-primary-500/20
            ${isCollapsed ? 'justify-center px-3' : ''}
          `}
          title={isCollapsed ? 'Settings' : undefined}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 opacity-0 group-hover/settings:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
          <div className={`relative flex-shrink-0 ${isCollapsed ? 'w-7 h-7' : 'w-6 h-6'} flex items-center justify-center`}>
            <Settings className={`w-full h-full group-hover/settings:scale-110 group-hover/settings:rotate-90 group-hover/settings:drop-shadow-md transition-all duration-500`} />
          </div>
          {!isCollapsed && (
            <span className="relative font-semibold text-base flex-1 group-hover/settings:text-primary-600 transition-colors duration-300">
              Settings
            </span>
          )}
        </Link>
        
        {user && (
          <button
            onClick={handleLogout}
            className={`
              relative w-full flex items-center gap-2 px-4 py-3.5 rounded-2xl transition-all duration-500 group/logout overflow-hidden
              text-secondary-700 hover:scale-[1.03] hover:shadow-lg hover:shadow-red-500/20
              ${isCollapsed ? 'justify-center px-3' : ''}
            `}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-600/10 to-red-500/10 opacity-0 group-hover/logout:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            <div className={`relative flex-shrink-0 ${isCollapsed ? 'w-7 h-7' : 'w-6 h-6'} flex items-center justify-center`}>
              <LogOut className={`w-full h-full group-hover/logout:scale-110 group-hover/logout:-translate-x-1 group-hover/logout:drop-shadow-md transition-all duration-500 text-red-600 group-hover/logout:text-red-500`} />
            </div>
            {!isCollapsed && (
              <span className="relative font-semibold text-base group-hover/logout:text-red-600 transition-colors duration-300">
                Logout
              </span>
            )}
          </button>
        )}
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col
          fixed left-0 top-0 h-screen
          bg-white/70 backdrop-blur-2xl border-r border-white/40
          shadow-2xl shadow-primary-900/20 transition-all duration-500 z-40
          ${isCollapsed ? 'w-24' : 'w-72'}
        `}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col h-full">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`
          lg:hidden flex flex-col
          fixed left-0 top-0 h-screen w-72 sm:w-80
          bg-white/80 backdrop-blur-2xl border-r border-white/40
          shadow-2xl transition-transform duration-500 z-50
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col h-full">
          <SidebarContent />
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className={`hidden lg:block transition-all duration-500 ${isCollapsed ? 'w-24' : 'w-72'}`} />
    </>
  )
}
