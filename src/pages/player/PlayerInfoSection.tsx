interface PlayerInfoSectionProps {
  name?: string;
  position?: string;
  nationality?: string;
}

export const PlayerInfoSection = ({ name, position, nationality }: PlayerInfoSectionProps) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold mb-2">{name}</h1>
    <div className="flex gap-4 text-gray-600">
      <span>{position}</span>
      <span>{nationality}</span>
    </div>
  </div>
)