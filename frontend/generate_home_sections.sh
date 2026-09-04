#!/bin/bash
mkdir -p src/components/modules/home
mkdir -p src/components/shared

# 1. Logo Strip
cat << 'FILE' > src/components/modules/home/logo-strip.tsx
export function LogoStrip() {
  return (
    <section className="py-12 border-b border-border/40 bg-background/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-muted-foreground mb-8">Trusted by innovative teams worldwide</p>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Fictional Logos (using text/svg placeholders) */}
          {['Acme Corp', 'GlobalBank', 'Nexus', 'Starlight', 'Vanguard'].map((name) => (
            <div key={name} className="flex items-center gap-2 font-bold text-xl text-slate-800 dark:text-slate-200">
              <div className="w-6 h-6 bg-slate-300 rounded-md"></div>
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
FILE

# 2. Features
cat << 'FILE' > src/components/modules/home/features.tsx
import { Layers, Zap, Users, LayoutDashboard, Shield, Smartphone } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Real-time Synchronization",
      description: "Powered by WebSockets, every move you make instantly appears on your team's screens. No refresh required.",
      icon: <Zap className="w-6 h-6 text-indigo-500" />
    },
    {
      title: "Kanban Workflows",
      description: "Organize tasks into customizable columns. Drag, drop, and manage your pipeline with intuitive ease.",
      icon: <LayoutDashboard className="w-6 h-6 text-emerald-500" />
    },
    {
      title: "Multiplayer Collaboration",
      description: "See exactly who is working on what with live presence indicators and real-time multiplayer cursors.",
      icon: <Users className="w-6 h-6 text-purple-500" />
    },
    {
      title: "Nested Subtasks",
      description: "Break down mammoth projects into bite-sized actionable items. Track progress at a granular level.",
      icon: <Layers className="w-6 h-6 text-pink-500" />
    },
    {
      title: "Enterprise-grade Security",
      description: "Your data is encrypted at rest and in transit. Granular role-based access control keeps things safe.",
      icon: <Shield className="w-6 h-6 text-amber-500" />
    },
    {
      title: "Access Anywhere",
      description: "Fully responsive design ensures you can manage your team from your desktop, tablet, or mobile device.",
      icon: <Smartphone className="w-6 h-6 text-cyan-500" />
    }
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Everything you need to ship faster</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            ZenBoard is packed with features designed to remove friction from your daily workflows.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl border border-border/50 bg-background shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
FILE

# 3. Showcase
cat << 'FILE' > src/components/modules/home/showcase.tsx
import { CheckCircle2 } from "lucide-react";

export function ShowcaseSection() {
  return (
    <section className="py-24 bg-muted/30 border-y border-border/40 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-sm font-medium text-indigo-600 mb-6">
              Designed for Flow
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6">
              Drag, drop, and conquer your day
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Experience the smoothest Kanban board ever built. Moving tasks feels intuitive, snappy, and deeply satisfying. Focus on the work, not the tool.
            </p>
            
            <ul className="space-y-4">
              {['Fractional indexing for exact positioning', 'Instant optimistic UI updates', 'Keyboard accessible drag operations'].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 font-medium">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mini Interactive-looking Mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[2.5rem] transform rotate-3 opacity-20 blur-xl"></div>
            <div className="relative bg-background border border-border shadow-xl rounded-3xl p-6 transform transition-transform hover:-translate-y-2 duration-500">
              <div className="flex gap-4">
                {/* Column */}
                <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-border/50">
                  <h4 className="text-sm font-bold mb-4">In Progress</h4>
                  <div className="space-y-3">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-border/40 transform -rotate-2 scale-105 z-10 relative cursor-grabbing">
                      <div className="w-10 h-1.5 bg-orange-400 rounded-full mb-3"></div>
                      <p className="text-sm font-semibold">Update landing page copy</p>
                    </div>
                    <div className="h-[90px] border-2 border-dashed border-indigo-200 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-lg"></div>
                  </div>
                </div>
                {/* Column */}
                <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-border/50">
                  <h4 className="text-sm font-bold mb-4">Review</h4>
                  <div className="space-y-3">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-border/40">
                      <div className="w-10 h-1.5 bg-pink-400 rounded-full mb-3"></div>
                      <p className="text-sm font-semibold">User testing phase 1</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
FILE

# 4. FAQ
cat << 'FILE' > src/components/modules/home/faq.tsx
export function FaqSection() {
  const faqs = [
    { q: "Is ZenBoard entirely free?", a: "We offer a generous free tier that covers most small teams. Advanced features require a premium subscription." },
    { q: "How real-time is the sync?", a: "Near-instantaneous. We use persistent WebSocket connections so changes appear on your screen the millisecond they happen." },
    { q: "Can I self-host ZenBoard?", a: "Yes! ZenBoard is built with NestJS and Next.js. You can deploy it completely on your own infrastructure using Docker." },
    { q: "What databases are supported?", a: "ZenBoard officially supports PostgreSQL via Prisma ORM for robust relational data integrity." },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Frequently asked questions</h2>
        </div>
        
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-border/60 rounded-2xl p-6 bg-muted/20 hover:bg-muted/40 transition-colors">
              <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
              <p className="text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
FILE

# 5. CTA Section
cat << 'FILE' > src/components/modules/home/cta.tsx
import { GetStartedButton } from "./get-started-button";

export function CtaSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary opacity-[0.03]"></div>
      <div className="mx-auto max-w-4xl px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
          Ready to find your focus?
        </h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Join thousands of forward-thinking teams who have already switched to a calmer, more connected way of working.
        </p>
        <div className="flex justify-center">
          <GetStartedButton />
        </div>
      </div>
    </section>
  );
}
FILE

# 6. Footer
cat << 'FILE' > src/components/shared/footer.tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-[2px] bg-white"></div>
              </div>
              <span className="font-bold text-lg text-foreground">ZenBoard</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A calmer, more connected workspace for modern engineering teams.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Integrations</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ZenBoard Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground">Twitter</Link>
            <Link href="#" className="hover:text-foreground">GitHub</Link>
            <Link href="#" className="hover:text-foreground">Discord</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
FILE

chmod +x generate_home_sections.sh
./generate_home_sections.sh
