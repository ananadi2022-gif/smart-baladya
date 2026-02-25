import { useState } from "react";
import { useRequests, useReports, useUpdateRequestStatus, useUpdateReportStatus, useUploadRequestFile, useNews, useCreateNews, useDeleteNews } from "@/hooks/use-requests";
import { useToast } from "@/hooks/use-toast";
import { useUsers, type User } from "@/hooks/use-users";
import { useTranslation } from "@/hooks/use-translation";
import { LayoutShell } from "@/components/layout-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";

export default function AdminDashboard() {
  const { data: requests } = useRequests();
  const { data: reports } = useReports();
  const { data: news } = useNews();
  const updateRequest = useUpdateRequestStatus();
  const updateReport = useUpdateReportStatus();
  const uploadFile = useUploadRequestFile();
  const createNews = useCreateNews();
  const deleteNews = useDeleteNews();
  const { toast } = useToast();
  const { users, updateUserRole, banUser } = useUsers();
  const { t } = useTranslation();
  const [tab] = useState("requests");
  const [uploadFileInput, setUploadFileInput] = useState<File | null>(null);
  const [uploadForRequestId, setUploadForRequestId] = useState<number | null>(null);
  const [newsTitle, setNewsTitle] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsImage, setNewsImage] = useState<File | null>(null);

  const readFileAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  return (
    <LayoutShell>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl">{t("admin.adminDashboard")}</h1>
        <p className="text-muted-foreground">{t("admin.manageServices")}</p>
      </div>

      <Tabs defaultValue={tab} className="space-y-6">
        <TabsList className="bg-white p-1 rounded-xl border border-border shadow-sm">
          <TabsTrigger value="requests" className="px-6 rounded-lg">
            {t("admin.requests")} ({requests?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="reports" className="px-6 rounded-lg">
            {t("admin.reports")} ({reports?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="users" className="px-6 rounded-lg">
            {t("admin.users")} ({users?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="news" className="px-6 rounded-lg">
            News ({news?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-bold mb-4">{t("admin.requests")}</h2>
            <ul className="space-y-2">
              {requests?.map((r) => (
                <li key={r.id} className="text-sm flex items-center justify-between">
                  <span>#{r.id} — {r.type} — {r.status}</span>
                  <span className="space-x-2">
                    {r.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => updateRequest.mutate({ id: r.id, status: 'Approved' })}
                          disabled={updateRequest.isPending}
                          className="px-3 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateRequest.mutate({ id: r.id, status: 'Rejected' })}
                          disabled={updateRequest.isPending}
                          className="px-3 py-1 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {r.status === 'Approved' && !r.fileUrl && (
                      <span className="space-x-2">
                        <input
                          id={`upload-${r.id}`}
                          type="file"
                          accept="application/pdf,image/*"
                          className="hidden"
                          onChange={(e) => { setUploadFileInput(e.target.files?.[0] || null); setUploadForRequestId(r.id); }}
                        />
                        <label htmlFor={`upload-${r.id}`} className="px-3 py-1 rounded-lg bg-success/10 text-success hover:bg-success hover:text-white cursor-pointer text-xs">Select File</label>
                        <button
                          onClick={async () => {
                            if (!uploadFileInput || uploadForRequestId !== r.id) return;
                            const MAX_BYTES = 5 * 1024 * 1024; // 5MB
                            if (uploadFileInput.size > MAX_BYTES) {
                              toast({
                                title: "File too large",
                                description: "Selected file exceeds 5MB limit.",
                                variant: "destructive",
                              });
                              return;
                            }
                            try {
                              const dataUrl = await readFileAsDataUrl(uploadFileInput);
                              uploadFile.mutate({ id: r.id, fileUrl: dataUrl });
                              setUploadFileInput(null);
                              setUploadForRequestId(null);
                            } catch (err) {
                              console.error(err);
                              toast({ title: "Upload failed", description: "Could not read the file.", variant: "destructive" });
                            }
                          }}
                          disabled={uploadFile.isPending || uploadForRequestId !== r.id}
                          className="px-3 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white disabled:opacity-50 text-xs"
                        >
                          Upload & Send
                        </button>
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-bold mb-4">{t("admin.reports")}</h2>
            <ul className="space-y-2">
              {reports?.map((rep) => (
                <li key={rep.id} className="text-sm flex items-center justify-between">
                  <span>#{rep.id} — {rep.category} — {rep.status}</span>
                  <span className="space-x-2">
                    {rep.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => updateReport.mutate({ id: rep.id, status: 'In Progress' })}
                          disabled={updateReport.isPending}
                          className="px-3 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white disabled:opacity-50"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateReport.mutate({ id: rep.id, status: 'Resolved' })}
                          disabled={updateReport.isPending}
                          className="px-3 py-1 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white disabled:opacity-50"
                        >
                          Refuse
                        </button>
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-bold mb-4">{t("admin.users")}</h2>
            <ul className="space-y-2">
              {users?.map((u: User) => (
                <li key={u.id} className="text-sm flex items-center justify-between">
                  <span>{u.fullName} — {u.cin} — {u.role}</span>
                  <span className="space-x-2">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => updateUserRole.mutate({ userId: u.id, role: 'admin' })}
                        disabled={updateUserRole.isPending}
                        className="px-3 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white disabled:opacity-50"
                      >
                        Make Admin
                      </button>
                    )}
                    {u.role === 'admin' && u.cin !== 'admin' && (
                      <button
                        onClick={() => updateUserRole.mutate({ userId: u.id, role: 'citizen' })}
                        disabled={updateUserRole.isPending}
                        className="px-3 py-1 rounded-lg bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-50"
                      >
                        Remove Admin
                      </button>
                    )}
                    <button
                      onClick={() => banUser.mutate({ userId: u.id })}
                      disabled={banUser.isPending || u.cin === 'admin'}
                      className={`px-3 py-1 rounded-lg ${u.isBanned ? 'bg-success/10 text-success hover:bg-success hover:text-white' : 'bg-destructive/10 text-destructive hover:bg-destructive hover:text-white'} disabled:opacity-50`}
                    >
                      {u.isBanned ? 'Unban' : 'Ban'}
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="news">
          <div className="bg-white rounded-2xl border border-border p-6 space-y-6">
            <h2 className="font-bold mb-4">Manage City Announcements</h2>
            
            {/* News Creation Form */}
            <div className="bg-secondary/30 rounded-xl p-4 space-y-4">
              <div>
                <label className="text-sm font-semibold">Title</label>
                <input
                  type="text"
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  placeholder="Announcement title"
                  className="w-full px-4 py-2 rounded-xl bg-white border border-border focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Content</label>
                <textarea
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  placeholder="Announcement content"
                  rows={4}
                  className="w-full px-4 py-2 rounded-xl bg-white border border-border focus:border-primary outline-none resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Image (optional)</label>
                <input
                  id="news-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewsImage(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 rounded-xl bg-white border border-border"
                />
              </div>
              <button
                onClick={async () => {
                  if (!newsTitle.trim() || !newsContent.trim()) {
                    toast({ title: "Error", description: "Title and content are required", variant: "destructive" });
                    return;
                  }
                  let imageUrl: string | undefined;
                  if (newsImage) {
                    imageUrl = await new Promise<string>((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onload = () => resolve(reader.result as string);
                      reader.onerror = reject;
                      reader.readAsDataURL(newsImage);
                    });
                  }
                  createNews.mutate({ title: newsTitle, content: newsContent, imageUrl }, {
                    onSuccess: () => {
                      setNewsTitle("");
                      setNewsContent("");
                      setNewsImage(null);
                    }
                  });
                }}
                disabled={createNews.isPending}
                className="px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50"
              >
                Publish Announcement
              </button>
            </div>

            {/* News List */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Published Announcements ({news?.length || 0})</h3>
              {news && news.length > 0 ? (
                <ul className="space-y-3">
                  {news.map((item) => (
                    <li key={item.id} className="bg-gray-50 rounded-xl p-4 border border-border">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.content}</p>
                          <p className="text-xs text-muted-foreground">
                            Published: {new Date(item.publishedAt).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteNews.mutate(item.id)}
                          disabled={deleteNews.isPending}
                          className="p-2 rounded-lg hover:bg-destructive/10 text-destructive disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No announcements yet</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </LayoutShell>
  );
}
