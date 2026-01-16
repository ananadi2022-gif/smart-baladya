import { useCreateReport } from "@/hooks/use-requests";
import { LayoutShell } from "@/components/layout-shell";
import { AlertTriangle, MapPin, Camera, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function ReportPage() {
  const createReport = useCreateReport();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    createReport.mutate({
      category: formData.get("category") as string,
      location: formData.get("location") as string,
      description: formData.get("description") as string,
      imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400", // Placeholder for MVP
    }, {
      onSuccess: () => setLocation("/dashboard")
    });
  };

  const categories = ["Road Maintenance", "Trash Collection", "Street Lighting", "Water Leakage", "Public Park Issue"];

  return (
    <LayoutShell>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="font-display font-bold text-3xl mb-2">Report an Issue</h1>
          <p className="text-muted-foreground">Help us improve the city by reporting infrastructure problems.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-border p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                Problem Category <span className="text-destructive">*</span>
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <label key={cat} className="relative cursor-pointer group">
                    <input type="radio" name="category" value={cat} className="peer sr-only" required />
                    <div className="p-4 rounded-xl border-2 border-border peer-checked:border-accent peer-checked:bg-accent/5 hover:border-accent/50 transition-all text-sm font-medium text-center">
                      {cat}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" /> Location <span className="text-destructive">*</span>
              </label>
              <input
                name="location"
                required
                className="w-full px-4 py-3 rounded-xl bg-secondary/30 border-2 border-transparent focus:border-accent focus:bg-background transition-all outline-none"
                placeholder="e.g. Corner of Hassan II Avenue and Zerktouni"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Description</label>
              <textarea
                name="description"
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-secondary/30 border-2 border-transparent focus:border-accent focus:bg-background transition-all outline-none resize-none"
                placeholder="Describe the issue in detail..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Camera className="w-4 h-4 text-muted-foreground" /> Photo Evidence
              </label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-secondary/30 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">Click to upload photo</p>
                <p className="text-xs text-muted-foreground/70 mt-1">JPG, PNG up to 5MB</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={createReport.isPending}
              className="w-full py-4 rounded-xl bg-accent text-white font-bold shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {createReport.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Submit Report"
              )}
            </button>
          </form>
        </div>
      </div>
    </LayoutShell>
  );
}
