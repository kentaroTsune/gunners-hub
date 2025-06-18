interface PlayerImageProps {
  imageUrl?: string;
  name: string;
}

export const PlayerImage = ({ imageUrl, name }: PlayerImageProps) => (
  <div className="w-full flex justify-center mb-8">
    {imageUrl ? (
      <img
        src={imageUrl}
        alt={name}
        className="w-200 object-cover"
      />
    ) : (
      <div className="w-full h-50 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">No Image</span>
      </div>
    )}
  </div>
)