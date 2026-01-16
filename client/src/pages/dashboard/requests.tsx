import { useState } from "react";
import { useRequests, useCreateRequest } from "@/hooks/use-requests";
import { useAuth } from "@/hooks/use-auth";
import { LayoutShell } from "@/components/layout-shell";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Plus, Loader2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function RequestsPage() {
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
    "Birth Certificate",
    "Residence Certificate",
    "Celibacy Certificate",
    "Building Permit Inquiry",
    "Business Tax Certificate",
    "Administrative Certificate"
  ];

  return (
    <LayoutShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl mb-2">My Requests</h1>
          <p className="text-muted-foreground">Manage and track your official document requests</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="px-6 py-3 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Request
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-2xl p-0 overflow-hidden gap-0">
            <div className="p-6 bg-primary text-primary-foreground">
              <DialogHeader>
                <DialogTitle className="text-2xl font-display">Request Document</DialogTitle>
                <p className="text-primary-foreground/80">Select the type of document you need.</p>
              </DialogHeader>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Document Type</label>
                <select 
                  name="type" 
                  required
                  className="w-full px-4 py-3 rounded-xl bg-secondary/30 border-2 border-transparent focus:border-primary focus:bg-background transition-all outline-none appearance-none"
                >
                  <option value="" disabled selected>Select a document...</option>
                  {documentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="p-4 rounded-xl bg-secondary/50 border border-border text-sm text-muted-foreground">
                <p>Note: Most documents are processed within 48 hours. You will receive a notification when your document is ready for pickup.</p>
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg hover:bg-secondary font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={createRequest.isPending}
                  className="px-6 py-2 rounded-lg bg-primary text-white font-semibold shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {createRequest.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit Request
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
          <h3 className="font-bold text-xl mb-2">No requests found</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            You haven't submitted any document requests yet. Click the "New Request" button to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {myRequests.map((req, i) => (
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
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{req.type}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {req.createdAt ? format(new Date(req.createdAt), "PPP") : "Date unknown"}
                    </div>
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

                    if (isRejected) return idx === 0 ? <span key="rejected" className="text-destructive font-bold px-4 py-2 bg-destructive/10 rounded-lg">Request Rejected</span> : null;

                    return (
                      <div key={step} className={`flex items-center gap-2 ${isActive ? "text-primary font-medium" : "text-muted-foreground/50"}`}>
                        <div className={`
                          w-3 h-3 rounded-full border-2 
                          ${isActive ? "bg-primary border-primary" : "border-current"}
                        `} />
                        <span className="text-sm hidden sm:inline">{step}</span>
                        {idx < 2 && <div className={`w-8 h-0.5 ${isActive && currentIdx > stepIdx ? "bg-primary" : "bg-border"}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </LayoutShell>
  );
}
