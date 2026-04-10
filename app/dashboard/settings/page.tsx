"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  User,
  Palette,
  Brain,
  Shield,
  Sun,
  Moon,
  Sparkles,
  Check,
  ChevronRight,
  LogOut,
  Key,
  Languages,
  BookOpen,
  Sliders,
  Save
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "../layout"

const subjects = ["Physics", "Mathematics", "Chemistry", "Biology", "History", "Geography"]
const weakTopics = ["Thermodynamics", "Calculus", "Organic Chemistry", "Modern History"]
const languages = ["English", "Hindi", "Both"]
const explanationStyles = ["Short & Quick", "Detailed", "Step-by-Step"]
const difficultyLevels = ["Easy", "Medium", "Advanced"]

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [activeSection, setActiveSection] = useState("profile")
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    class: "12th",
    subjects: ["Physics", "Mathematics", "Chemistry"],
    weakTopics: ["Thermodynamics", "Calculus"],
    language: "English"
  })
  const [aiSettings, setAiSettings] = useState({
    explanationStyle: "Detailed",
    difficulty: "Medium",
    language: "English"
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const sections = [
    { id: "profile", label: "Profile & Personalization", icon: User },
    { id: "theme", label: "Theme Settings", icon: Palette },
    { id: "ai", label: "AI Tutor Customization", icon: Brain },
    { id: "account", label: "Account Settings", icon: Shield },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Customize your learning experience</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <section.icon className="w-5 h-5" />
                <span className="font-medium">{section.label}</span>
                {activeSection === section.id && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Profile Section */}
            {activeSection === "profile" && (
              <>
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Personal Information
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Full Name</label>
                      <Input 
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Email</label>
                      <Input 
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="h-12 rounded-xl"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Learning Profile
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Class / Grade</label>
                      <div className="flex flex-wrap gap-2">
                        {["8th", "9th", "10th", "11th", "12th", "UG", "PG"].map((cls) => (
                          <button
                            key={cls}
                            onClick={() => setProfile({...profile, class: cls})}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                              profile.class === cls
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground hover:bg-muted/80"
                            }`}
                          >
                            {cls}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Subjects</label>
                      <div className="flex flex-wrap gap-2">
                        {subjects.map((subject) => (
                          <button
                            key={subject}
                            onClick={() => {
                              const newSubjects = profile.subjects.includes(subject)
                                ? profile.subjects.filter(s => s !== subject)
                                : [...profile.subjects, subject]
                              setProfile({...profile, subjects: newSubjects})
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                              profile.subjects.includes(subject)
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground hover:bg-muted/80"
                            }`}
                          >
                            {profile.subjects.includes(subject) && <Check className="w-4 h-4" />}
                            {subject}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Weak Topics (AI will focus on these)</label>
                      <div className="flex flex-wrap gap-2">
                        {weakTopics.map((topic) => (
                          <button
                            key={topic}
                            onClick={() => {
                              const newTopics = profile.weakTopics.includes(topic)
                                ? profile.weakTopics.filter(t => t !== topic)
                                : [...profile.weakTopics, topic]
                              setProfile({...profile, weakTopics: newTopics})
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                              profile.weakTopics.includes(topic)
                                ? "bg-amber-500/20 text-amber-600 border border-amber-500/30"
                                : "bg-muted text-foreground hover:bg-muted/80"
                            }`}
                          >
                            {profile.weakTopics.includes(topic) && <Check className="w-4 h-4" />}
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Languages className="w-4 h-4" />
                        Preferred Language
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {languages.map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setProfile({...profile, language: lang})}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                              profile.language === lang
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground hover:bg-muted/80"
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSave} className="gap-2">
                  {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? "Saved!" : "Save Changes"}
                </Button>
              </>
            )}

            {/* Theme Section */}
            {activeSection === "theme" && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  Theme Settings
                </h2>
                <p className="text-muted-foreground mb-6">Choose your preferred appearance</p>
                
                <div className="grid sm:grid-cols-3 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTheme("light")}
                    className={`relative p-6 rounded-2xl border-2 transition-all ${
                      theme === "light"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {theme === "light" && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center mb-4 shadow-sm">
                      <Sun className="w-6 h-6 text-amber-500" />
                    </div>
                    <h3 className="font-semibold text-foreground">Light Mode</h3>
                    <p className="text-sm text-muted-foreground mt-1">Clean and bright interface</p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTheme("dark")}
                    className={`relative p-6 rounded-2xl border-2 transition-all ${
                      theme === "dark"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {theme === "dark" && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-center mb-4">
                      <Moon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-foreground">Dark Mode</h3>
                    <p className="text-sm text-muted-foreground mt-1">Easy on the eyes at night</p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTheme("gradient")}
                    className={`relative p-6 rounded-2xl border-2 transition-all ${
                      theme === "gradient"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {theme === "gradient" && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground">Gradient Mode</h3>
                    <p className="text-sm text-muted-foreground mt-1">Vibrant and modern look</p>
                  </motion.button>
                </div>
              </div>
            )}

            {/* AI Settings Section */}
            {activeSection === "ai" && (
              <>
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    AI Tutor Preferences
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Sliders className="w-4 h-4" />
                        Explanation Style
                      </label>
                      <p className="text-sm text-muted-foreground mb-3">How should AI explain concepts to you?</p>
                      <div className="flex flex-wrap gap-2">
                        {explanationStyles.map((style) => (
                          <button
                            key={style}
                            onClick={() => setAiSettings({...aiSettings, explanationStyle: style})}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                              aiSettings.explanationStyle === style
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground hover:bg-muted/80"
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Difficulty Level</label>
                      <p className="text-sm text-muted-foreground mb-3">Set the complexity of explanations and quizzes</p>
                      <div className="flex flex-wrap gap-2">
                        {difficultyLevels.map((level) => (
                          <button
                            key={level}
                            onClick={() => setAiSettings({...aiSettings, difficulty: level})}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                              aiSettings.difficulty === level
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground hover:bg-muted/80"
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Languages className="w-4 h-4" />
                        Response Language
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {languages.map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setAiSettings({...aiSettings, language: lang})}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                              aiSettings.language === lang
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground hover:bg-muted/80"
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSave} className="gap-2">
                  {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? "Saved!" : "Save AI Preferences"}
                </Button>
              </>
            )}

            {/* Account Section */}
            {activeSection === "account" && (
              <>
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Security Settings
                  </h2>
                  
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Key className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-foreground">Change Password</p>
                          <p className="text-sm text-muted-foreground">Update your account password</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-foreground">Update Profile Photo</p>
                          <p className="text-sm text-muted-foreground">Change your profile picture</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                <div className="bg-card border border-destructive/30 rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Danger Zone</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you log out, you will need to sign in again to access your account.
                  </p>
                  <Link href="/">
                    <Button variant="destructive" className="gap-2">
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
