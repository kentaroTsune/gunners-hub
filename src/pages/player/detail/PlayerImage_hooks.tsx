import { useMemo } from 'react';
import { getPlayerImageUrlWithFallback } from '../../../utils/playerImage';
import { createPlayerImageAltText, createPlayerImageErrorHandler, DUMMY_IMAGE } from './PlayerImage_utils';

interface UsePlayerImageProps {
  playerId?: string | null;
  name?: string;
}

export const usePlayerImage = ({ playerId, name }: UsePlayerImageProps) => {
  const imageUrl = useMemo(() =>
    playerId ? getPlayerImageUrlWithFallback(playerId) : DUMMY_IMAGE,
    [playerId]
  );

  const altText = useMemo(() =>
    createPlayerImageAltText(playerId, name),
    [playerId, name]
  );

  const handleImageError = useMemo(() =>
    createPlayerImageErrorHandler(),
    []
  );

  return {
    imageUrl,
    altText,
    handleImageError
  };
};