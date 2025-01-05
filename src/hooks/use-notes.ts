/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useNotes() {
  const queryClient = useQueryClient();

  const { data: notes, isLoading } = useQuery<any[]>({
    queryKey: ["/api/notes"],
    staleTime: Infinity,
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/notes/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast("Note uploaded successfully", { type: "success" });
    },
    onError: () => {
      toast("Something went wrong", { type: "error" });
    },
  });

  return {
    notes,
    isLoading,
    upload: uploadMutation.mutateAsync,
  };
}
