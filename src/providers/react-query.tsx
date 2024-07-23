'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
export function ReactQueryProvider({ children }: { children: JSX.Element }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
