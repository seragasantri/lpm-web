import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPublicSettings } from '../lib/api';

interface SiteSettingsContextType {
  settings: Record<string, string> | undefined;
  isLoading: boolean;
  refetch: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: undefined,
  isLoading: true,
  refetch: () => {},
});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: settings, isLoading, refetch } = useQuery({
    queryKey: ['site-settings'],
    queryFn: getPublicSettings,
    staleTime: 1000 * 30, // 30 seconds only for faster updates
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Update favicon dynamically
  useEffect(() => {
    if (settings?.favicon_url) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/svg+xml';
        document.head.appendChild(link);
      }
      link.href = settings.favicon_url;
    }
  }, [settings?.favicon_url]);

  return (
    <SiteSettingsContext.Provider value={{ settings, isLoading, refetch }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

// Hook to refresh settings after update
export function useRefreshSettings() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['site-settings'] });
  };
}
