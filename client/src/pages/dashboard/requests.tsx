import { useState } from "react";
import { useRequests, useCreateRequest } from "@/hooks/use-requests";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { LayoutShell } from "@/components/layout-shell";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Plus, Loader2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function RequestsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: requests, isLoading } = useRequests();
  const createRequest = useCreateRequest();
  const [isOpen, setIsOpen] = useState(false);

  // Filter requests for the current user
  const myRequests = requests?.filter(r => r.userId === user?.id) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const type = formData.get("type") as string;
    
    createRequest.mutate({ type }, {
      onSuccess: () => setIsOpen(false)
    });
  };

  const documentTypes = [
    { id: "birth-certificate", labelKey: "requests.docBirthCertificate" },
    { id: "residence-certificate", labelKey: "requests.docResidenceCertificate" },
    { id: "celibacy-certificate", labelKey: "requests.docCelibacyCertificate" },
    { id: "building-permit-inquiry", labelKey: "requests.docBuildingPermitInquiry" },
    { id: "business-tax-certificate", labelKey: "requests.docBusinessTaxCertificate" },
    { id: "administrative-certificate", labelKey: "requests.docAdministrativeCertificate" }
  ];

  return (
    <LayoutShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl mb-2">{t("requests.myRequests")}</h1>
          <p className="text-muted-foreground">{t("requests.manageTrack")}</p>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button className="px-6 py-3 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                <Plus className="w-5 h-5" />
                {t("requests.newRequest")}
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-2xl p-0 overflow-hidden gap-0">
              <div className="p-6 bg-primary text-primary-foreground">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-display">{t("requests.requestDocument")}</DialogTitle>
                  <p className="text-primary-foreground/80">{t("requests.selectDocument")}</p>
                </DialogHeader>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">{t("requests.documentType")}</label>
                  <select 
                    name="type" 
                    required
                    className="w-full px-4 py-3 rounded-xl bg-secondary/30 border-2 border-transparent focus:border-primary focus:bg-background transition-all outline-none appearance-none"
                  >
                    <option value="" disabled selected>{t("requests.selectDocumentPlaceholder")}</option>
                    {documentTypes.map(type => (
                      <option key={type.id} value={type.id}>{t(type.labelKey)}</option>
                    ))}
                  </select>
                </div>

                <div className="p-4 rounded-xl bg-secondary/50 border border-border text-sm text-muted-foreground">
                  <p>{t("requests.note")}</p>
                </div>

                <div className="flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded-lg hover:bg-secondary font-medium transition-colors"
                  >
                    {t("requests.cancel")}
                  </button>
                  <button 
                    type="submit" 
                    disabled={createRequest.isPending}
                    className="px-6 py-2 rounded-lg bg-primary text-white font-semibold shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {createRequest.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    {t("requests.submitRequest")}
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : myRequests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-border/60">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-bold text-xl mb-2">{t("requests.noRequestsFound")}</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            {t("requests.noRequestsDesc")}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {myRequests.map((req, i) => {
            const fileUrl = req.fileUrl;
            return (
            <motion.div 
              key={req.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-border/50 hover:border-primary/30 transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    {fileUrl ? (
                      fileUrl.startsWith("indexeddb://") ? (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            const key = fileUrl.replace("indexeddb://", "");
                            try {
                              const blob = await (await import("@/hooks/use-requests")).getBlobFromIndexedDB(key);
                              if (!blob) return;
                              const url = URL.createObjectURL(blob);
                              window.open(url, "_blank");
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          className="w-12 h-12 flex items-center justify-center"
                        >
                          <FileText className="w-6 h-6" />
                        </button>
                      ) : (
                        <a href={fileUrl} target="_blank" rel="noreferrer">
                          <img src={fileUrl} alt={req.type} className="w-12 h-12 rounded-xl object-cover" />
                        </a>
                      )
                    ) : (
                      <FileText className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{req.type}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {req.createdAt ? format(new Date(req.createdAt), "PPP") : t("requests.dateUnknown")}
                    </div>
                    {fileUrl && (
                      <div className="mt-2">
                        {fileUrl.startsWith("indexeddb://") ? (
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              const key = fileUrl.replace("indexeddb://", "");
                              try {
                                const blob = await (await import("@/hooks/use-requests")).getBlobFromIndexedDB(key);
                                if (!blob) return;
                                const url = URL.createObjectURL(blob);
                                window.open(url, "_blank");
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className="text-sm text-primary underline"
                          >
                            {t("requests.viewDocument") || "View document"}
                          </button>
                        ) : (
                          <a href={fileUrl} target="_blank" rel="noreferrer" className="text-sm text-primary underline">
                            {t("requests.viewDocument") || "View document"}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="flex items-center gap-2 md:gap-4">
                  {["Pending", "Approved", "Ready"].map((step, idx) => {
                    const statusOrder = ["Pending", "Approved", "Ready"];
                    const currentIdx = statusOrder.indexOf(req.status);
                    const stepIdx = statusOrder.indexOf(step);
                    const isActive = currentIdx >= stepIdx;
                    const isRejected = req.status === "Rejected";

                    if (isRejected) return idx === 0 ? <span key="rejected" className="text-destructive font-bold px-4 py-2 bg-destructive/10 rounded-lg">{t("requests.requestRejected")}</span> : null;

                    return (
                      <div key={step} className={`flex items-center gap-2 ${isActive ? "text-primary font-medium" : "text-muted-foreground/50"}`}>
                        <div className={`
                          w-3 h-3 rounded-full border-2 
                          ${isActive ? "bg-primary border-primary" : "border-current"}
                        `} />
                        <span className="text-sm hidden sm:inline">
                          {step === "Pending" ? t("common.pending") : step === "Approved" ? t("requests.approved") : t("common.ready")}
                        </span>
                        {idx < 2 && <div className={`w-8 h-0.5 ${isActive && currentIdx > stepIdx ? "bg-primary" : "bg-border"}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
            );
          })}
        </div>
      )}
    </LayoutShell>
  );
}
