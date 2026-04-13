import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../lib/apiClient';
import { Order } from '../types/idol';

interface AdminOrder {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total_amount: number;
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  shipping_name: string;
  shipping_phone: string;
  shipping_address_line1: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  shipping_country: string;
  notes?: string;
  created_at: string;
  user?: { id: number; name: string; email: string };
  items?: {
    id: number;
    product_name: string;
    product_image?: string;
    product_sku?: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[];
}

interface DashboardStats {
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  total_customers: number;
}

// ─── Customer hooks ──────────────────────────────────────────────

export function useOrders() {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ['user-orders'],
    queryFn: async () => {
      try {
        const res = await fetchApi<{ success: boolean; data: Order[] }>('/orders?limit=50');
        return res.data || [];
      } catch (e) {
        return [];
      }
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: Record<string, any>) => {
      return fetchApi('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return {
    orders: ordersQuery.data || [],
    isLoading: ordersQuery.isLoading,
    createOrder: createOrderMutation.mutateAsync,
  };
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason?: string }) => {
      return fetchApi(`/orders/${id}/cancel`, {
        method: 'PUT',
        body: JSON.stringify({ reason: reason || 'Cancelled by customer' }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
    },
  });
}

// ─── Admin hooks ──────────────────────────────────────────────────

export function useAdminOrders(filters?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ['admin-orders', filters],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: '100' });
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      const res = await fetchApi<{ success: boolean; data: AdminOrder[] }>(
        `/admin/orders?${params.toString()}`
      );
      return res.data || [];
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return fetchApi(`/admin/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await fetchApi<{ success: boolean; data: DashboardStats }>(
        '/admin/dashboard/stats'
      );
      return res.data;
    },
  });
}
