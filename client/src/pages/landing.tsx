import { Link } from "wouter";
import { Building2, CheckCircle2, ArrowRight, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Smart Baladiya</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm font-medium hover:text-primary transition-colors">Services</a>
            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">About</a>
            <Link href="/auth">
              <button className="px-6 py-2.5 rounded-full bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200">
                Login / Register
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-secondary/30 -skew-y-3 transform origin-top-left z-0" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                Digital Municipality Services
              </div>
              
              <h1 className="font-display font-bold text-5xl lg:text-7xl leading-[1.1] mb-6 text-foreground">
                Your City,<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  One Click Away
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Skip the lines and paperwork. Access official documents, report local issues, and stay connected with your municipality from anywhere, anytime.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth">
                  <button className="px-8 py-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2">
                    Get Started <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <button className="px-8 py-4 rounded-xl bg-white border border-border font-bold text-foreground hover:bg-secondary/50 transition-all duration-200">
                  Learn More
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 border border-white/20 aspect-video lg:aspect-square bg-gradient-to-br from-blue-50 to-white">
                {/* Abstract City Representation */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-transparent" />
                
                {/* Floating Elements Animation */}
                <div className="absolute top-1/4 left-1/4 p-4 bg-white rounded-2xl shadow-xl animate-bounce duration-[3000ms]">
                  <FileText className="w-8 h-8 text-accent" />
                </div>
                <div className="absolute bottom-1/3 right-1/4 p-4 bg-white rounded-2xl shadow-xl animate-bounce duration-[4000ms]">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                
                {/* Unsplash Image with Overlay */}
                {/* modern minimal architectural building facade */}
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
                  alt="Modern City Services" 
                  className="w-full h-full object-cover mix-blend-overlay opacity-60"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">Smart Services for Citizens</h2>
            <p className="text-muted-foreground">Everything you need to interact with your local administration, digitized for your convenience.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText className="w-8 h-8 text-primary" />,
                title: "Document Requests",
                desc: "Request birth certificates, residence permits, and administrative documents online."
              },
              {
                icon: <Building2 className="w-8 h-8 text-accent" />,
                title: "Report Issues",
                desc: "Spot a problem? Snap a photo and report road, lighting, or sanitation issues instantly."
              },
              {
                icon: <CheckCircle2 className="w-8 h-8 text-success" />,
                title: "Real-time Tracking",
                desc: "Track the status of your requests and reports in real-time with instant notifications."
              }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border/50">
                <div className="mb-6 p-4 rounded-xl bg-white shadow-sm inline-block">{item.icon}</div>
                <h3 className="font-display font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-lg">Smart Baladiya</span>
          </div>
          <p className="text-sm text-gray-400">© 2024 Smart Baladiya. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
