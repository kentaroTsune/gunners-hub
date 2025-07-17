const IMAGE_PATHS = {
  BASE_PATH: '/src/assets/img',
  DUMMY_IMAGE: '/src/assets/img/dummy.jpg',
} as const;

export const getPlayerImageUrlWithFallback = (playerId: string | null): string => {
  if (!playerId) {
    return IMAGE_PATHS.DUMMY_IMAGE;
  }
  return `${IMAGE_PATHS.BASE_PATH}/${playerId}.jpg`;
};