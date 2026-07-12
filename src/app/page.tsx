import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-foreground overflow-hidden font-sans">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary/10 blur-[120px] opacity-70"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-primary/5 blur-[150px] opacity-50"></div>
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>

      {/* Navigation */}
      <header className="relative z-10 w-full px-6 py-6 lg:px-12 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-[#8a6538] flex items-center justify-center shadow-[0_0_20px_rgba(180,138,88,0.3)]">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <path d="M6 14h4M18 14h4M10 14a4 4 0 1 0 8 0 4 4 0 0 0-8 0z" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M14 6v4M14 18v4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Transit<span className="text-brand-primary">Ops</span></span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-text-muted hover:text-white transition-colors">Features</Link>
          <Link href="#solutions" className="text-sm font-medium text-text-muted hover:text-white transition-colors">Solutions</Link>
          <Link href="#security" className="text-sm font-medium text-text-muted hover:text-white transition-colors">Security</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-white hover:text-brand-primary transition-colors">
            Sign In
          </Link>
          <Link href="/dashboard" className="hidden sm:flex px-5 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]">
            Open Dashboard
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-20 lg:py-32">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold uppercase tracking-widest mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
          </span>
          v0.1.0 Platform Live
        </div>
        
        <h1 className="max-w-4xl text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8 leading-[1.1]">
          Intelligent Logistics & <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-[#e6c498] to-brand-primary bg-[length:200%_auto] animate-gradient">
            Fleet Operations.
          </span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-text-muted mb-12 leading-relaxed">
          The enterprise-grade platform for modern transit agencies. Manage vehicles, dispatch drivers, and monitor real-time trips with unparalleled operational clarity.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md mx-auto">
          <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-lg transition-all shadow-[0_0_30px_rgba(180,138,88,0.3)] hover:shadow-[0_0_40px_rgba(180,138,88,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2">
            Enter Platform
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
          <a href="#demo" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-surface border border-surface-border hover:border-text-muted hover:bg-surface-hover text-white font-semibold text-lg transition-all flex items-center justify-center gap-2">
            View Demo
          </a>
        </div>

        {/* Floating Dashboard Preview Mockup */}
        <div className="mt-24 relative w-full max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10 pointer-events-none rounded-t-3xl"></div>
          <div className="relative rounded-t-3xl border-t border-l border-r border-white/10 bg-[#09090b] shadow-[0_-20px_60px_-15px_rgba(180,138,88,0.2)] overflow-hidden">
            <div className="h-10 bg-[#050505] border-b border-white/5 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
            </div>
            
            {/* Fake Dashboard Content */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
              <div className="col-span-1 space-y-4">
                <div className="h-24 rounded-xl bg-surface border border-surface-border p-4 flex flex-col justify-between">
                  <div className="w-20 h-4 bg-zinc-800 rounded"></div>
                  <div className="w-12 h-8 bg-brand-primary/20 rounded"></div>
                </div>
                <div className="h-48 rounded-xl bg-surface border border-surface-border"></div>
              </div>
              <div className="col-span-1 md:col-span-2 space-y-4">
                <div className="h-48 rounded-xl bg-surface border border-surface-border p-6">
                  <div className="w-32 h-5 bg-zinc-800 rounded mb-6"></div>
                  <div className="space-y-3">
                    <div className="w-full h-8 bg-zinc-900 rounded"></div>
                    <div className="w-full h-8 bg-zinc-900 rounded"></div>
                    <div className="w-3/4 h-8 bg-zinc-900 rounded"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 rounded-xl bg-surface border border-surface-border"></div>
                  <div className="h-24 rounded-xl bg-surface border border-surface-border"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 8s ease infinite;
        }
      `}} />
    </div>
  );
}
