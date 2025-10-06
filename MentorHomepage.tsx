'use client'

import Link from 'next/link'
import { ArrowRight, Heart, Users, BookOpen, MessageCircle, Target, Award, Calendar } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const mentorFeatures = [
  {
    icon: Users,
    title: 'Mentee Matching',
    description: 'Get matched with mentees based on your expertise, industry experience, and availability preferences.',
  },
  {
    icon: MessageCircle,
    title: 'Communication Hub',
    description: 'Stay connected through integrated messaging, video calls, and progress tracking systems.',
  },
  {
    icon: Calendar,
    title: 'Flexible Scheduling',
    description: 'Set your availability and manage mentoring sessions with built-in calendar integration.',
  },
  {
    icon: BookOpen,
    title: 'Resource Library',
    description: 'Access and contribute to a comprehensive library of career development resources and templates.',
  },
  {
    icon: Target,
    title: 'Impact Tracking',
    description: 'Monitor your mentees\' progress and see the real impact of your guidance and support.',
  },
  {
    icon: Award,
    title: 'Recognition Program',
    description: 'Earn recognition for your contributions and build your reputation as a community leader.',
  },
]

const mentorStats = [
  { number: '1,200+', label: 'Active Mentors' },
  { number: '5,000+', label: 'Mentoring Sessions' },
  { number: '89%', label: 'Mentee Success Rate' },
  { number: '4.9/5', label: 'Average Rating' },
]

export default function MentorHomepage() {
  const { user } = useAuth()
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden cyber-grid-bg">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-900 via-accent-800 to-accent-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-secondary-400/10 via-transparent to-neon-blue/10"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 border border-secondary-400/30 rotate-45 floating-element"></div>
        <div className="absolute top-40 right-20 w-16 h-16 border border-neon-blue/30 rounded-full floating-element" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-secondary-400 to-secondary-500 rounded-lg floating-element" style={{animationDelay: '2s'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {user && (
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Welcome back, <span className="neon-text">{user.firstName}</span>!
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-secondary-400 to-secondary-500 mx-auto rounded-full"></div>
              </div>
            )}
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Shape the Future by
              <br />
              <span className="neon-text glow-effect"> Mentoring Tomorrow's Leaders</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
              Share your expertise and experience with motivated job seekers and career changers. 
              Make a meaningful impact by providing guidance, support, and industry insights that 
              can transform careers and lives.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              {user ? (
                <>
                  <Link href="/mentorship/dashboard" className="cyber-button text-lg px-10 py-4 group">
                    <span className="flex items-center justify-center">
                      <Heart className="w-5 h-5 mr-3" />
                      View Dashboard
                    </span>
                  </Link>
                  <Link href="/mentorship/mentees" className="btn-secondary text-lg px-10 py-4 group">
                    <span className="flex items-center justify-center">
                      My Mentees
                      <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/register" className="cyber-button text-lg px-10 py-4 group">
                    <span className="flex items-center justify-center">
                      <Heart className="w-5 h-5 mr-3" />
                      Start Mentoring
                    </span>
                  </Link>
                  <Link href="/mentorship/learn-more" className="btn-secondary text-lg px-10 py-4">
                    Learn More
                  </Link>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              <div className="cyber-card text-center group hover:scale-105 transition-all duration-300">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary-400 to-secondary-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-r from-secondary-400 to-secondary-500 rounded-full flex items-center justify-center">
                    <Users className="w-10 h-10 text-black" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Meaningful Connections</h3>
                <p className="text-white/90 leading-relaxed">Build lasting relationships with mentees and watch them grow professionally and personally</p>
              </div>
              
              <div className="cyber-card text-center group hover:scale-105 transition-all duration-300">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-full flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-black" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Share Your Expertise</h3>
                <p className="text-white/90 leading-relaxed">Contribute to career maps, resources, and educational content that helps thousands</p>
              </div>
              
              <div className="cyber-card text-center group hover:scale-105 transition-all duration-300">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-full flex items-center justify-center">
                    <MessageCircle className="w-10 h-10 text-black" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Flexible Engagement</h3>
                <p className="text-white/90 leading-relaxed">Choose your level of involvement and mentoring style that fits your schedule</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent-800 to-accent-900"></div>
        <div className="absolute inset-0 cyber-grid-bg opacity-30"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 right-10 w-32 h-32 border border-secondary-400/20 rotate-45 floating-element"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 border border-neon-blue/20 rounded-full floating-element" style={{animationDelay: '1.5s'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Tools to Maximize Your <span className="neon-text">Impact</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              Everything you need to provide effective mentorship and support the next generation 
              of professionals from underrepresented communities.
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-secondary-400 to-secondary-500 mx-auto mt-8 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentorFeatures.map((feature, index) => (
              <div key={index} className="cyber-card group hover:scale-105 transition-all duration-300 shimmer-effect">
                <div className="relative w-16 h-16 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary-400 to-secondary-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-r from-secondary-400 to-secondary-500 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-black" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-white/90 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-900 via-accent-800 to-accent-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-secondary-400/5 via-transparent to-neon-blue/5"></div>
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 cyber-grid-bg opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Join a Community of <span className="neon-text">Change-Makers</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Mentors on WorkQit are making a real difference in people's lives and careers
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-secondary-400 to-secondary-500 mx-auto mt-8 rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {mentorStats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="cyber-card p-8 hover:scale-105 transition-all duration-300">
                  <div className="text-5xl md:text-6xl font-bold neon-text mb-4 glow-effect">
                    {stat.number}
                  </div>
                  <div className="text-white/90 font-semibold text-lg">
                    {stat.label}
                  </div>
                  <div className="w-16 h-1 bg-gradient-to-r from-secondary-400 to-secondary-500 mx-auto mt-4 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Real Stories, Real Impact
            </h2>
            <p className="text-xl text-gray-600">
              See how mentors are changing lives and building the next generation of leaders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="mb-4">
                <div className="text-green-600 text-4xl font-bold">12</div>
                <div className="text-gray-600">mentees placed in jobs</div>
              </div>
              <p className="text-gray-700 mb-4">
                "Mentoring through WorkQit has been incredibly rewarding. Seeing my mentees land their dream jobs makes it all worthwhile."
              </p>
              <div className="text-sm text-gray-500">
                - Sarah Chen, Senior Software Engineer
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="mb-4">
                <div className="text-green-600 text-4xl font-bold">50+</div>
                <div className="text-gray-600">hours of mentoring</div>
              </div>
              <p className="text-gray-700 mb-4">
                "The platform makes it easy to stay connected with mentees and track their progress. It's flexible and fits my schedule perfectly."
              </p>
              <div className="text-sm text-gray-500">
                - Marcus Johnson, Marketing Director
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="mb-4">
                <div className="text-green-600 text-4xl font-bold">95%</div>
                <div className="text-gray-600">would recommend</div>
              </div>
              <p className="text-gray-700 mb-4">
                "WorkQit connects me with motivated individuals who are eager to learn. It's one of the most fulfilling things I do."
              </p>
              <div className="text-sm text-gray-500">
                - Dr. Amanda Rodriguez, Data Scientist
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mentoring Opportunities Section */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ways to Make a Difference
            </h2>
            <p className="text-xl text-gray-600">
              Choose the mentoring style that works best for you and your schedule
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1-on-1 Mentoring</h3>
              <p className="text-gray-600 mb-4">
                Work closely with individual mentees on their career goals, skill development, and job search strategies.
              </p>
              <div className="text-sm text-green-600 font-medium">2-4 hours/month</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Group Mentoring</h3>
              <p className="text-gray-600 mb-4">
                Lead group sessions, workshops, or webinars to share your expertise with multiple mentees at once.
              </p>
              <div className="text-sm text-green-600 font-medium">1-2 hours/month</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Content Creation</h3>
              <p className="text-gray-600 mb-4">
                Create resources, guides, and career maps that help thousands of job seekers in your industry.
              </p>
              <div className="text-sm text-green-600 font-medium">Flexible timing</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Lasting Impact?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community of mentors who are helping shape careers and create opportunities 
            for talented individuals from diverse backgrounds. Your experience can change lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="bg-white text-green-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors text-lg">
              <Heart className="w-5 h-5 mr-2 inline" />
              Become a Mentor
            </Link>
            <Link href="/mentorship/learn-more" className="border-2 border-white text-white hover:bg-white hover:text-green-600 font-medium py-3 px-8 rounded-lg transition-colors text-lg">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}