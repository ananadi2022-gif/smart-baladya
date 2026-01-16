import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertRequest, type InsertReport } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useRequests() {
  return useQuery({
    queryKey: [api.requests.list.path],
    queryFn: async () => {
      const res = await fetch(api.requests.list.path);
      if (!res.ok) throw new Error("Failed to fetch requests");
      return api.requests.list.responses[200].parse(await res.json());
    },
  });
}

export function useReports() {
  return useQuery({
    queryKey: [api.reports.list.path],
    queryFn: async () => {
      const res = await fetch(api.reports.list.path);
      if (!res.ok) throw new Error("Failed to fetch reports");
      return api.reports.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertRequest) => {
      const res = await fetch(api.requests.create.path, {
        method: api.requests.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create request");
      return api.requests.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.requests.list.path] });
      toast({
        title: "Request submitted",
        description: "Your document request has been received.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not submit request. Please try again.",
        variant: "destructive",
      });
    },
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertReport) => {
      const res = await fetch(api.reports.create.path, {
        method: api.reports.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit report");
      return api.reports.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.reports.list.path] });
      toast({
        title: "Report submitted",
        description: "Thank you for helping improve our city.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not submit report. Please try again.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: "Pending" | "Approved" | "Ready" | "Rejected" }) => {
      const url = buildUrl(api.requests.updateStatus.path, { id });
      const res = await fetch(url, {
        method: api.requests.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return api.requests.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.requests.list.path] });
      toast({ title: "Status updated" });
    },
  });
}

export function useUpdateReportStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: "Pending" | "In Progress" | "Resolved" }) => {
      const url = buildUrl(api.reports.updateStatus.path, { id });
      const res = await fetch(url, {
        method: api.reports.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return api.reports.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.reports.list.path] });
      toast({ title: "Report status updated" });
    },
  });
}
