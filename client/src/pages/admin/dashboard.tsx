import { useRequests, useReports, useUpdateRequestStatus, useUpdateReportStatus } from "@/hooks/use-requests";
import { LayoutShell } from "@/components/layout-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Clock, FileText, AlertTriangle, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export default function AdminDashboard() {
  const { data: requests, isLoading: isLoadingRequests } = useRequests();
  const { data: reports, isLoading: isLoadingReports } = useReports();
  const updateRequest = useUpdateRequestStatus();
  const updateReport = useUpdateReportStatus();
  const [filter, setFilter] = useState("all");

  const filteredRequests = filter === "all" ? requests : requests?.filter(r => r.status.toLowerCase() === filter);

  return (
    <LayoutShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage citizen requests and reports</p>
        </div>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-xl border border-border shadow-sm">
          <TabsTrigger value="requests" className="px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
            Requests ({requests?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="reports" className="px-6 rounded-lg data-[state=active]:bg-accent data-[state=active]:text-white">
            Reports ({reports?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4 animate-enter">
          <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/30 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRequests?.map((req) => (
                    <tr key={req.id} className="hover:bg-secondary/10 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-muted-foreground">#{req.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="font-medium">{req.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {req.createdAt ? format(new Date(req.createdAt), "MMM d, yyyy") : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${req.status === 'Pending' ? 'bg-warning/10 text-warning' : 
                            req.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                            req.status === 'Ready' ? 'bg-success/10 text-success' : 
                            'bg-destructive/10 text-destructive'}
                        `}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {req.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => updateRequest.mutate({ id: req.id, status: "Approved" })}
                              className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => updateRequest.mutate({ id: req.id, status: "Rejected" })}
                              className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {req.status === 'Approved' && (
                          <button 
                            onClick={() => updateRequest.mutate({ id: req.id, status: "Ready" })}
                            className="px-3 py-1.5 rounded-lg bg-success/10 text-success hover:bg-success hover:text-white transition-colors text-xs font-bold"
                          >
                            Mark Ready
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4 animate-enter">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports?.map((report) => (
              <div key={report.id} className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm flex flex-col">
                <div className="h-40 bg-secondary relative">
                  {/* Image placeholder */}
                  {report.imageUrl ? (
                    <img src={report.imageUrl} alt="Report" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <AlertTriangle className="w-8 h-8 opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm capitalize">
                    {report.status}
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2 text-accent font-medium text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    {report.category}
                  </div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{report.location}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">{report.description}</p>
                  
                  <div className="pt-4 border-t border-border mt-auto flex justify-between items-center">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {report.createdAt ? format(new Date(report.createdAt), "MMM d") : "-"}
                    </span>
                    
                    {report.status === "Pending" && (
                      <button 
                        onClick={() => updateReport.mutate({ id: report.id, status: "In Progress" })}
                        className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-bold shadow-md shadow-accent/20 hover:shadow-lg hover:bg-accent/90 transition-all"
                      >
                        Start Work
                      </button>
                    )}
                    {report.status === "In Progress" && (
                      <button 
                        onClick={() => updateReport.mutate({ id: report.id, status: "Resolved" })}
                        className="px-3 py-1.5 rounded-lg bg-success text-white text-xs font-bold shadow-md shadow-success/20 hover:shadow-lg hover:bg-success/90 transition-all"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </LayoutShell>
  );
}
