import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export interface User {
  id: string;
  cin: string;
  fullName: string;
  role: "admin" | "citizen";
  isBanned: boolean;
}

const USERS_STORAGE_KEY = "app_users";

export function useUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize with demo users
  const initializeUsers = () => {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (!stored) {
      const demoUsers: User[] = [
        {
          id: "user_client",
          cin: "client",
          fullName: "Client User",
          role: "citizen",
          isBanned: false,
        },
        {
          id: "user_admin",
          cin: "admin",
          fullName: "Administrator",
          role: "admin",
          isBanned: false,
        },
      ];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(demoUsers));
      return demoUsers;
    }
    return JSON.parse(stored);
  };

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return initializeUsers();
    },
    retry: false,
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: "admin" | "citizen" }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const allUsers = initializeUsers();
      const userIndex = allUsers.findIndex((u: User) => u.id === userId);

      if (userIndex === -1) {
        throw new Error("User not found");
      }

      allUsers[userIndex].role = role;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(allUsers));
      return allUsers[userIndex];
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["users"], (old: User[] | undefined) => {
        if (!old) return [user];
        return old.map((u) => (u.id === user.id ? user : u));
      });
      toast({
        title: "Role Updated",
        description: `${user.fullName} is now a ${user.role}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update role",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const banUserMutation = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const allUsers = initializeUsers();
      const userIndex = allUsers.findIndex((u: User) => u.id === userId);

      if (userIndex === -1) {
        throw new Error("User not found");
      }

      allUsers[userIndex].isBanned = !allUsers[userIndex].isBanned;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(allUsers));
      return allUsers[userIndex];
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["users"], (old: User[] | undefined) => {
        if (!old) return [user];
        return old.map((u) => (u.id === user.id ? user : u));
      });
      toast({
        title: user.isBanned ? "User Banned" : "User Unbanned",
        description: `${user.fullName} has been ${user.isBanned ? "banned" : "unbanned"}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    users: users || [],
    isLoading,
    updateUserRole: updateUserRoleMutation,
    banUser: banUserMutation,
  };
}
