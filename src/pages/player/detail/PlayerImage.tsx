import { usePlayerImage } from './PlayerImage_hooks';

interface PlayerImageProps {
  playerId?: string | null;
  name?: string;
}

export const PlayerImage = ({ playerId, name = '選手' }: PlayerImageProps) => {
  const { imageUrl, altText, handleImageError } = usePlayerImage({ playerId, name });

  return (
    <figure className="w-full flex justify-center mb-8">
      <img
        src={imageUrl}
        alt={altText}
        className="w-200 object-cover"
        loading="lazy"
        onError={handleImageError}
      />
    </figure>
  );
};