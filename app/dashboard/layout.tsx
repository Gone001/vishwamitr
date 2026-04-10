"use client"

import { useState, createContext, useContext, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Brain, 
  MessageSquare, 
  BookOpen, 
  FileQuestion,
  GraduationCap,
  BarChart3,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  ChevronRight,
  Home
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Theme = "light" | "dark" | "gradient"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {}
})

export const useTheme = () => useContext(ThemeContext)

const menuItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: MessageSquare, label: "AI Tutor", href: "/dashboard/tutor" },
  { icon: BookOpen, label: "Subjects", href: "/dashboard/subjects" },
  { icon: FileQuestion, label: "Quiz", href: "/dashboard/quiz" },
  { icon: GraduationCap, label: "Exams", href: "/dashboard/exams" },
  { icon: BarChart3, label: "Reports", href: "/dashboard/reports" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>("light")
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove("dark", "gradient")
    if (theme === "dark" || theme === "gradient") {
      root.classList.add(theme)
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-muted rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6 text-foreground" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Vishwa Mitr</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">JD</span>
            </div>
          </div>
        </header>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-sidebar border-r border-sidebar-border z-40">
          <div className="flex items-center gap-3 p-6 border-b border-sidebar-border">
            <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
              <Brain className="w-6 h-6 text-sidebar-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">Vishwa Mitr</span>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div layoutId="activeIndicator" className="ml-auto">
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 p-3 bg-sidebar-accent rounded-xl">
              <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center">
                <span className="text-sm font-medium text-sidebar-primary-foreground">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sidebar-foreground truncate">John Doe</p>
                <p className="text-sm text-muted-foreground truncate">Class 12 - Science</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden fixed inset-0 bg-blue-900/50 z-50"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-sidebar border-r border-sidebar-border z-50 flex flex-col"
              >
                <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
                      <Brain className="w-6 h-6 text-sidebar-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold text-sidebar-foreground">Vishwa Mitr</span>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 hover:bg-sidebar-accent rounded-xl"
                  >
                    <X className="w-5 h-5 text-sidebar-foreground" />
                  </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <div
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                            isActive
                              ? "bg-sidebar-primary text-sidebar-primary-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent"
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                      </Link>
                    )
                  })}
                </nav>

                <div className="p-4 border-t border-sidebar-border">
                  <div className="flex items-center gap-3 p-3 bg-sidebar-accent rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center">
                      <span className="text-sm font-medium text-sidebar-primary-foreground">JD</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sidebar-foreground truncate">John Doe</p>
                      <p className="text-sm text-muted-foreground truncate">Class 12 - Science</p>
                    </div>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="lg:ml-64">
          {/* Desktop Header */}
          <header className="hidden lg:flex fixed top-0 right-0 left-64 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
            <div className="flex items-center justify-between h-16 px-6 w-full">
              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search topics, questions, subjects..."
                    className="pl-10 h-10 rounded-xl bg-muted border-0"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative rounded-xl">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </Button>
                <Link href="/dashboard/settings">
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <Settings className="w-5 h-5" />
                  </Button>
                </Link>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">JD</span>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="pt-20 lg:pt-20 pb-24 lg:pb-8 px-4 lg:px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border z-40">
          <div className="flex items-center justify-around h-16 px-2">
            {menuItems.slice(0, 5).map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </ThemeContext.Provider>
  )
}
