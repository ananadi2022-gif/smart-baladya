import { useCreateReport } from "@/hooks/use-requests";
import { useTranslation } from "@/hooks/use-translation";
import { LayoutShell } from "@/components/layout-shell";
import { LanguageSwitcher } from "@/components/language-switcher";
import { AlertTriangle, MapPin, Camera, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function ReportPage() {
  const { t } = useTranslation();
  const createReport = useCreateReport();
  const [, setLocation] = useLocation();

  const [fileInput, setFileInput] = useState<File | null>(null);

  const readFileAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    let imageUrl = "";
    const file = (formData.get("image") as File) || fileInput;
    if (file) {
      try {
        imageUrl = await readFileAsDataUrl(file);
      } catch (err) {
        console.error("Failed to read file:", err);
      }
    }

    createReport.mutate({
      category: formData.get("category") as string,
      location: formData.get("location") as string,
      description: formData.get("description") as string,
      imageUrl: imageUrl || "",
    }, {
      onSuccess: () => setLocation("/dashboard")
    });
  };

  const categories = [
    { id: "road-maintenance", labelKey: "report.categoryRoadMaintenance" },
    { id: "trash-collection", labelKey: "report.categoryTrashCollection" },
    { id: "street-lighting", labelKey: "report.categoryStreetLighting" },
    { id: "water-leakage", labelKey: "report.categoryWaterLeakage" },
    { id: "public-park-issue", labelKey: "report.categoryPublicParkIssue" }
  ];

  return (
    <LayoutShell>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <LanguageSwitcher />
          </div>
          <h1 className="font-display font-bold text-3xl mb-2">{t("report.reportIssue")}</h1>
          <p className="text-muted-foreground">{t("report.helpImprove")}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-border p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                {t("report.problemCategory")} <span className="text-destructive">*</span>
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <label key={cat.id} className="relative cursor-pointer group">
                    <input type="radio" name="category" value={cat.id} className="peer sr-only" required />
                    <div className="p-4 rounded-xl border-2 border-border peer-checked:border-accent peer-checked:bg-accent/5 hover:border-accent/50 transition-all text-sm font-medium text-center">
                      {t(cat.labelKey)}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" /> {t("report.location")} <span className="text-destructive">*</span>
              </label>
              <input
                name="location"
                required
                className="w-full px-4 py-3 rounded-xl bg-secondary/30 border-2 border-transparent focus:border-accent focus:bg-background transition-all outline-none"
                placeholder={t("report.locationPlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t("report.description")}</label>
              <textarea
                name="description"
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-secondary/30 border-2 border-transparent focus:border-accent focus:bg-background transition-all outline-none resize-none"
                placeholder={t("report.descriptionPlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Camera className="w-4 h-4 text-muted-foreground" /> {t("report.photoEvidence")}
              </label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-secondary/30 transition-colors cursor-pointer group">
                  <input
                    id="report-file"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setFileInput(e.target.files?.[0] || null)}
                  />
                  <label htmlFor="report-file" className="cursor-pointer block">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Camera className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">{t("report.clickUpload")}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">{fileInput?.name || t("report.fileLimit")}</p>
                  </label>
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
                t("report.submitReport")
              )}
            </button>
          </form>
        </div>
      </div>
    </LayoutShell>
  );
}
