import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./use-auth";
 
export interface Request {
  id: number;
  userId: string;
  type: string;
  status: "Pending" | "Approved" | "Ready" | "Rejected";
  createdAt: string;
  fileUrl?: string; // URL of the uploaded document
  fileUploadedAt?: string;
}

export interface Report {
  id: number;
  userId: string;
  category: string;
  location: string;
  description: string;
  imageUrl: string;
  status: "Pending" | "In Progress" | "Resolved";
  createdAt: string;
}

export interface News {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  publishedAt: string;
  updatedAt: string;
}

const REQUESTS_STORAGE_KEY = "requests_data";
const REPORTS_STORAGE_KEY = "reports_data";
const NEWS_STORAGE_KEY = "news_data";

// Initialize storage with sample data if empty
function initializeStorage() {
  if (!localStorage.getItem(REQUESTS_STORAGE_KEY)) {
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(REPORTS_STORAGE_KEY)) {
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(NEWS_STORAGE_KEY)) {
    localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify([]));
  }
}

function getRequests(): Request[] {
  initializeStorage();
  return JSON.parse(localStorage.getItem(REQUESTS_STORAGE_KEY) || "[]");
}

function saveRequests(requests: Request[]) {
  localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
}

function getReports(): Report[] {
  initializeStorage();
  return JSON.parse(localStorage.getItem(REPORTS_STORAGE_KEY) || "[]");
}

function saveReports(reports: Report[]) {
  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
}

function getNews(): News[] {
  initializeStorage();
  return JSON.parse(localStorage.getItem(NEWS_STORAGE_KEY) || "[]");
}

function saveNews(news: News[]) {
  localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(news));
}



// IndexedDB helpers for storing blobs (files)
function openFilesDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("smart_baladiya_files", 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files");
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveBlobToIndexedDB(key: string, blob: Blob) {
  const db = await openFilesDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction("files", "readwrite");
    tx.objectStore("files").put(blob, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getBlobFromIndexedDB(key: string): Promise<Blob | undefined> {
  const db = await openFilesDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("files", "readonly");
    const req = tx.objectStore("files").get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function useRequests() {
  return useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      return getRequests();
    },
  });
}

export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      return getReports();
    },
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { type: string }) => {
      if (!user) throw new Error("Not authenticated");
      
      const requests = getRequests();
      const newRequest: Request = {
        id: Date.now(),
        userId: user.id,
        type: data.type,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };
      
      requests.push(newRequest);
      saveRequests(requests);
      return newRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast({
        title: "Request submitted",
        description: "Your document request has been received by the admin.",
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
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { category: string; location: string; description: string; imageUrl: string }) => {
      if (!user) throw new Error("Not authenticated");
      
      const reports = getReports();
      const newReport: Report = {
        id: Date.now(),
        userId: user.id,
        category: data.category,
        location: data.location,
        description: data.description,
        imageUrl: data.imageUrl,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };
      
      reports.push(newReport);
      saveReports(reports);
      return newReport;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
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
      const requests = getRequests();
      const request = requests.find(r => r.id === id);
      if (!request) throw new Error("Request not found");
      
      request.status = status;
      saveRequests(requests);
      return request;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast({ title: "Request status updated" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateReportStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: "Pending" | "In Progress" | "Resolved" }) => {
      const reports = getReports();
      const report = reports.find(r => r.id === id);
      if (!report) throw new Error("Report not found");
      
      report.status = status;
      saveReports(reports);
      return report;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast({ title: "Report status updated" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update report status",
        variant: "destructive",
      });
    },
  });
}

export function useUploadRequestFile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, fileUrl }: { id: number; fileUrl: string }) => {
      const requests = getRequests();
      const request = requests.find(r => r.id === id);
      if (!request) throw new Error("Request not found");

      // If the fileUrl is a data URL (large), store the binary in IndexedDB
      // and reference it with an indexeddb:// key to avoid localStorage quota issues.
      if (fileUrl.startsWith("data:")) {
        // convert data URL to Blob
        const blob = await fetch(fileUrl).then(r => r.blob());
        const key = `file_${id}`;
        await saveBlobToIndexedDB(key, blob);
        request.fileUrl = `indexeddb://${key}`;
      } else {
        request.fileUrl = fileUrl;
      }

      request.fileUploadedAt = new Date().toISOString();
      request.status = "Ready";
      saveRequests(requests);
      return request;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast({
        title: "File uploaded",
        description: "The document has been uploaded and sent to the client.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    },
  });
}

export function useNews() {
  return useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      return getNews();
    },
  });
}

export function useCreateNews() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { title: string; content: string; imageUrl?: string }) => {
      const news = getNews();
      const newNews: News = {
        id: Date.now(),
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      news.push(newNews);
      saveNews(news);
      return newNews;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast({
        title: "News published",
        description: "Your announcement has been published.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to publish news.",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteNews() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const news = getNews();
      const filtered = news.filter(n => n.id !== id);
      saveNews(filtered);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast({
        title: "News deleted",
        description: "The announcement has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete news.",
        variant: "destructive",
      });
    },
  });
}

import { useToast } from "./use-toast";
