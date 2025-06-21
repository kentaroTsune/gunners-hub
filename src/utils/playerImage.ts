export const getPlayerImageUrl = (playerId: string | null): string => {
  return `/src/assets/img/${playerId}.jpeg`;
};

export const getPlayerImageUrlWithFallback = (playerId: string | null): string => {
  try {
    return getPlayerImageUrl(playerId);
  } catch {
    return '/src/assets/img/dummy.jpg';
  }
};
