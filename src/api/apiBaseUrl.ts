export const getApiBaseUrl = (): string => {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (!base?.trim()) {
    throw new Error('VITE_API_BASE_URL が設定されていません');
  }
  return base.replace(/\/$/, '');
};
