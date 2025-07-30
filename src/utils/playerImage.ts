import { IMAGE_PATHS } from '../constants/ui';

export const getPlayerImageUrlWithFallback = (playerId: string | null): string => {
  if (!playerId) {
    return IMAGE_PATHS.DUMMY_IMAGE;
  }
  return `${IMAGE_PATHS.BASE_PATH}/${playerId}.jpg`;
};