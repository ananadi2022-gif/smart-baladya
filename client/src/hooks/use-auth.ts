import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

interface User {
  id: string;
  cin: string;
  fullName: string;
  role: "admin" | "citizen";
}

const STORAGE_KEY = "auth_user";

// Mock credentials
const VALID_CREDENTIALS = {
  client: { password: "client", role: "citizen" as const },
  admin: { password: "admin", role: "admin" as const },
};

export function useAuth() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [isLoadingState, setIsLoadingState] = useState(true);

  // Load user from localStorage on mount
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth_user"],
    queryFn: async () => {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 300));
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as User) : null;
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { cin: string; password: string }) => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const cin = credentials.cin.toLowerCase();
      const validCred = VALID_CREDENTIALS[cin as keyof typeof VALID_CREDENTIALS];

      if (!validCred || validCred.password !== credentials.password) {
        throw new Error("Invalid credentials. Try 'client/client' or 'admin/admin'");
      }

      const user: User = {
        id: `user_${cin}`,
        cin: credentials.cin,
        fullName: cin === "client" ? "Client User" : "Administrator",
        role: validCred.role,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return user;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["auth_user"], data);
      toast({
        title: "Welcome back",
        description: `Logged in as ${data.fullName}`,
      });
      setLocation(data.role === "admin" ? "/admin" : "/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      throw new Error("Registration is disabled. Use login instead.");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      localStorage.removeItem(STORAGE_KEY);
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth_user"], null);
      setLocation("/");
      toast({
        title: "Logged out",
        description: "See you next time!",
      });
    },
  });

  return {
    user,
    isLoading,
    login: loginMutation,
    register: registerMutation,
    logout: logoutMutation,
  };
}
