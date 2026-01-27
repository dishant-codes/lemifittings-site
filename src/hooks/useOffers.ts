import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Offer } from "@/types/database";

export function useOffers() {
  return useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data as Offer[];
    },
  });
}

export function useAllOffers() {
  return useQuery({
    queryKey: ["all-offers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data as Offer[];
    },
  });
}

export function useCreateOffer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (offer: Omit<Offer, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("offers")
        .insert(offer)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["all-offers"] });
    },
  });
}

export function useUpdateOffer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...offer }: Partial<Offer> & { id: string }) => {
      const { data, error } = await supabase
        .from("offers")
        .update(offer)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["all-offers"] });
    },
  });
}

export function useDeleteOffer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("offers")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["all-offers"] });
    },
  });
}
