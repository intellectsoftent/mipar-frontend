import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../lib/apiClient';
import { Idol } from '../types/idol';

// Fetch all idols (products)
export function useIdols(filters?: { search?: string; category_id?: number; deity?: string; min_price?: number; max_price?: number }) {
  return useQuery({
    queryKey: ['idols', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.category_id) params.append('category_id', filters.category_id.toString());
      if (filters?.deity) params.append('deity', filters.deity);
      
      const endpoint = filters ? `/products?${params.toString()}` : '/products?limit=100';
      const res = await fetchApi<{ success: boolean; data: Idol[] }>(endpoint);
      return res.data;
    },
  });
}

// Fetch a single idol by slug
export function useIdol(slug: string) {
  return useQuery({
    queryKey: ['idol', slug],
    queryFn: async () => {
      if (!slug) return null;
      const res = await fetchApi<{ success: boolean; data: Idol }>(`/products/${slug}`);
      return res.data;
    },
    enabled: !!slug,
  });
}

// Create an idol
export function useCreateIdol() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetchApi<{ success: boolean; data: Idol }>('/admin/products', {
        method: 'POST',
        body: data,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['idols'] });
    },
  });
}

// Update an idol
export function useUpdateIdol() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: FormData }) => {
      const res = await fetchApi<{ success: boolean; data: Idol }>(`/admin/products/${id}`, {
        method: 'PUT',
        body: data,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['idols'] });
    },
  });
}

// Delete an idol
export function useDeleteIdol() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      await fetchApi(`/admin/products/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['idols'] });
    },
  });
}
