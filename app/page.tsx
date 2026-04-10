"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Brain, 
  BookOpen, 
  Trophy, 
  BarChart3, 
  MessageSquare, 
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  Users,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Vishwa Mitr</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</Link>
              <Link href="#subjects" className="text-muted-foreground hover:text-foreground transition-colors">Subjects</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="text-center lg:text-left"
            >
              <motion.div 
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">AI-Powered Learning Platform</span>
              </motion.div>
              <motion.h1 
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance"
              >
                Your AI Study{" "}
                <span className="text-primary">Companion</span>
              </motion.h1>
              <motion.p 
                variants={fadeInUp}
                className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0"
              >
                Experience personalized AI-powered learning tailored to your unique needs. 
                Master Physics, Maths, Chemistry, and more with intelligent tutoring.
              </motion.p>
              <motion.div 
                variants={fadeInUp}
                className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start"
              >
                <Link href="/signup">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2 text-base px-8">
                    Start Learning
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="gap-2 text-base px-8">
                    Explore Features
                  </Button>
                </Link>
              </motion.div>
              <motion.div 
                variants={fadeInUp}
                className="mt-10 flex items-center gap-8 justify-center lg:justify-start"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">10K+ Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">98% Success Rate</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Illustration - Chat Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <div className="relative bg-card border border-border rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Vishwa Mitr AI</h3>
                    <p className="text-xs text-muted-foreground">Online - Ready to help</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-end"
                  >
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3 max-w-[80%]">
                      <p className="text-sm">Can you explain Newton&apos;s third law?</p>
                    </div>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex justify-start"
                  >
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 max-w-[80%]">
                      <p className="text-sm text-foreground">
                        Newton&apos;s Third Law states that for every action, there is an equal and opposite reaction. 
                        When you push against a wall, the wall pushes back with the same force!
                      </p>
                    </div>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 max-w-[80%]">
                      <p className="text-sm text-foreground">Would you like me to show you some real-world examples?</p>
                    </div>
                  </motion.div>
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex items-center gap-3 bg-muted/50 rounded-xl px-4 py-3">
                    <MessageSquare className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Ask anything...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Powerful Features</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Everything you need to excel in your studies, powered by advanced AI technology
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                title: "AI Tutor",
                description: "Get personalized explanations and guidance from our intelligent AI tutor",
                color: "from-blue-500/20 to-blue-600/20"
              },
              {
                icon: BookOpen,
                title: "Quiz System",
                description: "Test your knowledge with adaptive quizzes that adjust to your level",
                color: "from-green-500/20 to-green-600/20"
              },
              {
                icon: Trophy,
                title: "Exam Prep",
                description: "Access previous year questions and important topics for exam success",
                color: "from-amber-500/20 to-amber-600/20"
              },
              {
                icon: BarChart3,
                title: "Analytics",
                description: "Track your progress with detailed performance analytics and insights",
                color: "from-purple-500/20 to-purple-600/20"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="group bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">How It Works</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                description: "Tell us about your class, subjects, and learning preferences",
                icon: Users
              },
              {
                step: "02",
                title: "Start Learning",
                description: "Chat with AI tutor, take quizzes, and explore subjects",
                icon: Zap
              },
              {
                step: "03",
                title: "Track Progress",
                description: "Monitor your improvement with detailed analytics and reports",
                icon: Target
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="text-8xl font-bold text-primary/10 absolute -top-4 -left-2">{item.step}</div>
                <div className="relative pt-8 pl-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="w-8 h-8 text-border" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section id="subjects" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Explore Subjects</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Master your favorite subjects with AI-powered assistance
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Physics", color: "from-blue-500 to-cyan-500", icon: "F=ma" },
              { name: "Mathematics", color: "from-indigo-500 to-purple-500", icon: "x+y" },
              { name: "Chemistry", color: "from-emerald-500 to-green-500", icon: "H2O" },
              { name: "History", color: "from-amber-500 to-orange-500", icon: "1947" },
              { name: "Biology", color: "from-pink-500 to-rose-500", icon: "DNA" },
              { name: "Geography", color: "from-teal-500 to-cyan-500", icon: "Map" },
              { name: "English", color: "from-violet-500 to-purple-500", icon: "ABC" },
              { name: "Economics", color: "from-yellow-500 to-amber-500", icon: "GDP" }
            ].map((subject, index) => (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <span className="text-2xl font-bold opacity-50 mb-2">{subject.icon}</span>
                  <h3 className="text-lg font-semibold">{subject.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Preview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">See It In Action</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Experience the power of AI-driven learning
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-3xl blur-3xl -z-10" />
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
              {/* Mock Browser Header */}
              <div className="bg-muted px-4 py-3 flex items-center gap-2 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-background rounded-lg px-4 py-1.5 text-sm text-muted-foreground text-center">
                    app.vishwamitr.com/dashboard
                  </div>
                </div>
              </div>
              
              {/* Mock Dashboard Preview */}
              <div className="p-6 bg-background">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-4">
                    <div className="bg-muted/50 rounded-xl p-4">
                      <h4 className="font-semibold text-foreground mb-3">Welcome back, Student!</h4>
                      <p className="text-sm text-muted-foreground">Continue your Physics chapter on Newton&apos;s Laws</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-primary">85%</div>
                        <p className="text-sm text-muted-foreground">Weekly Progress</p>
                      </div>
                      <div className="bg-muted/50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-green-500">12</div>
                        <p className="text-sm text-muted-foreground">Quizzes Completed</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4">
                    <h4 className="font-semibold text-foreground mb-3">Quick Chat</h4>
                    <div className="space-y-2">
                      <div className="bg-background rounded-lg px-3 py-2 text-sm text-muted-foreground">
                        What is momentum?
                      </div>
                      <div className="bg-primary/10 rounded-lg px-3 py-2 text-sm text-foreground">
                        Momentum is mass times velocity...
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground">Ready to Transform Your Learning?</h2>
            <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
              Join thousands of students who are already learning smarter with Vishwa Mitr
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="gap-2 text-base px-8">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">Vishwa Mitr</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your AI-powered study companion for smarter learning.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#subjects" className="hover:text-foreground transition-colors">Subjects</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>2026 Vishwa Mitr. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
