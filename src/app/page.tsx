import Link from "next/link";

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 12h4M14 12h4" /><circle cx="6" cy="16" r="2" /><circle cx="18" cy="16" r="2" />
      </svg>
    ),
    title: "Vehicle Registry",
    desc: "Track every vehicle — status, odometer, load capacity, and acquisition cost in one place.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8" />
      </svg>
    ),
    title: "Driver Management",
    desc: "License tracking, safety scores, and availability management for your entire driver pool.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    ),
    title: "Trip Dispatch",
    desc: "Create, dispatch, complete, and cancel trips with full lifecycle status transitions.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: "Maintenance Logs",
    desc: "Auto-lock vehicles to In Shop when maintenance begins. Close logs to restore availability.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: "Fuel & Expenses",
    desc: "Log fuel consumption, tolls, and maintenance costs. Auto-compute operational cost per vehicle.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
    title: "Reports & Analytics",
    desc: "Fuel efficiency, fleet utilization, ROI, and monthly revenue charts with PDF export.",
  },
];

const ROLES = [
  { name: "Fleet Manager", color: "#6366f1", access: "Full platform access" },
  { name: "Dispatcher", color: "#0ea5e9", access: "Vehicles, drivers, trips" },
  { name: "Safety Officer", color: "#f59e0b", access: "Drivers, maintenance" },
  { name: "Financial Analyst", color: "#10b981", access: "Fuel, expenses, reports" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-foreground overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary/10 blur-[120px] opacity-70"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-primary/5 blur-[150px] opacity-50"></div>
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60%] h-[30%] rounded-full bg-brand-primary/[0.03] blur-[100px]"></div>
      </div>

      {/* Navigation */}
      <header className="relative z-10 w-full px-6 py-5 lg:px-12 flex items-center justify-between border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-[#8a6538] flex items-center justify-center shadow-[0_0_20px_rgba(180,138,88,0.3)]">
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
              <path d="M6 14h4M18 14h4M10 14a4 4 0 1 0 8 0 4 4 0 0 0-8 0z" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M14 6v4M14 18v4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Transit<span className="text-brand-primary">Ops</span></span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-text-muted hover:text-white transition-colors">Features</Link>
          <Link href="#roles" className="text-sm font-medium text-text-muted hover:text-white transition-colors">Roles</Link>
          <Link href="#workflow" className="text-sm font-medium text-text-muted hover:text-white transition-colors">Workflow</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-text-muted hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="hidden sm:flex px-5 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1">
        <section className="flex flex-col items-center justify-center text-center px-4 pt-20 pb-28 lg:pt-32 lg:pb-36">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
            </span>
            Smart Transport Operations Platform
          </div>
          
          <h1 className="max-w-5xl text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8 leading-[1.08]">
            Digitize Your Fleet.<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-[#e6c498] to-brand-primary bg-[length:200%_auto] animate-gradient">
              Optimize Operations.
            </span>
          </h1>
          
          <p className="max-w-2xl text-lg md:text-xl text-text-muted mb-12 leading-relaxed">
            The end-to-end platform for managing vehicles, dispatching drivers, tracking maintenance, logging expenses, and unlocking real-time operational insights.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/register" className="px-8 py-4 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-lg transition-all shadow-[0_0_30px_rgba(180,138,88,0.3)] hover:shadow-[0_0_40px_rgba(180,138,88,0.5)] hover:-translate-y-0.5 flex items-center gap-2">
              Start for Free
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <Link href="/login" className="px-8 py-4 rounded-xl bg-surface border border-surface-border hover:border-text-muted hover:bg-surface-hover text-white font-semibold text-lg transition-all flex items-center gap-2">
              Sign In
            </Link>
          </div>

          {/* Stats Row */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 max-w-3xl w-full">
            {[
              { value: "4", label: "User Roles" },
              { value: "10+", label: "Business Rules" },
              { value: "100%", label: "RBAC Enforced" },
              { value: "PDF", label: "Export Ready" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-text-muted mt-1 uppercase tracking-wider font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 lg:px-12 py-24 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-primary font-semibold mb-3">Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Everything you need to run your fleet</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-[#09090b] border border-white/[0.06] hover:border-brand-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(180,138,88,0.08)]"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary mb-5 group-hover:bg-brand-primary/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* RBAC Roles Section */}
        <section id="roles" className="px-6 lg:px-12 py-24 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.2em] text-brand-primary font-semibold mb-3">Access Control</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Role-Based Access for every team member</h2>
              <p className="text-text-muted mt-4 max-w-xl mx-auto">Each user sees only what they need. Server-side enforcement ensures security at every layer.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {ROLES.map((role) => (
                <div key={role.name} className="p-6 rounded-2xl bg-[#09090b] border border-white/[0.06] text-center">
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: `${role.color}20`, color: role.color, border: `1px solid ${role.color}40` }}
                  >
                    {role.name.charAt(0)}
                  </div>
                  <h3 className="text-white font-semibold mb-1">{role.name}</h3>
                  <p className="text-text-muted text-sm">{role.access}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="workflow" className="px-6 lg:px-12 py-24 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.2em] text-brand-primary font-semibold mb-3">How It Works</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">From registration to reporting</h2>
            </div>

            <div className="space-y-0">
              {[
                { step: "01", title: "Register a vehicle", desc: "Add vehicles with capacity, cost, and type. Status defaults to Available." },
                { step: "02", title: "Add your drivers", desc: "Create driver profiles with license data and safety scores." },
                { step: "03", title: "Create & dispatch trips", desc: "Select vehicle, driver, and cargo. System validates capacity and dispatches atomically." },
                { step: "04", title: "Complete or cancel", desc: "Final odometer and fuel are logged. Vehicles and drivers return to Available automatically." },
                { step: "05", title: "Track costs & analytics", desc: "Fuel efficiency, ROI, and operational costs are computed and exportable as PDF." },
              ].map((item, i, arr) => (
                <div key={item.step} className="flex gap-6 items-start">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/15 border border-brand-primary/30 flex items-center justify-center text-brand-primary text-sm font-bold shrink-0">
                      {item.step}
                    </div>
                    {i < arr.length - 1 && (
                      <div className="w-px h-12 bg-white/[0.06] my-1"></div>
                    )}
                  </div>
                  <div className="pb-8">
                    <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                    <p className="text-text-muted text-sm mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 lg:px-12 py-24 border-t border-white/5">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to optimize your fleet?</h2>
            <p className="text-text-muted text-lg mb-10">Sign up in seconds. No credit card required.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="px-8 py-4 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-lg transition-all shadow-[0_0_30px_rgba(180,138,88,0.3)] hover:shadow-[0_0_40px_rgba(180,138,88,0.5)] hover:-translate-y-0.5">
                Create Account
              </Link>
              <Link href="/login" className="px-8 py-4 rounded-xl bg-surface border border-surface-border hover:border-text-muted text-white font-semibold text-lg transition-all">
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 lg:px-12 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-primary to-[#8a6538] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 28 28" fill="none">
                <path d="M6 14h4M18 14h4M10 14a4 4 0 1 0 8 0 4 4 0 0 0-8 0z" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">TransitOps</span>
          </div>
          <p className="text-xs text-text-muted">© {new Date().getFullYear()} TransitOps. Built for the hackathon.</p>
        </div>
      </footer>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 6s ease infinite;
        }
      `}} />
    </div>
  );
}
