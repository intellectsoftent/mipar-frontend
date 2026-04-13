import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../lib/apiClient';
import { CartItem } from '../types/idol';

export function useCart() {
  const queryClient = useQueryClient();

  // Fetch cart
  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      try {
        const res = await fetchApi<{ success: boolean; data: { items: CartItem[]; subtotal: string; item_count: number } }>('/cart');
        return res.data;
      } catch (e) {
        return { items: [], subtotal: "0", item_count: 0 };
      }
    },
  });

  // Add to cart
  const addToCartMutation = useMutation({
    mutationFn: async ({ product_id, quantity }: { product_id: number; quantity: number }) => {
      return fetchApi('/cart', {
        method: 'POST',
        body: JSON.stringify({ product_id, quantity }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Update quantity
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ cart_id, quantity }: { cart_id: number; quantity: number }) => {
      return fetchApi(`/cart/${cart_id}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Remove item
  const removeItemMutation = useMutation({
    mutationFn: async (cart_id: number) => {
      return fetchApi(`/cart/${cart_id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Clear cart
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      return fetchApi('/cart', { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return {
    cartItems: cartQuery.data?.items || [],
    subtotal: cartQuery.data?.subtotal || "0",
    isLoading: cartQuery.isLoading,
    addToCart: addToCartMutation.mutateAsync,
    updateQuantity: updateQuantityMutation.mutateAsync,
    removeItem: removeItemMutation.mutateAsync,
    clearCart: clearCartMutation.mutateAsync,
  };
}
