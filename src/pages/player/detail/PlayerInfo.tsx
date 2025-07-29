interface PlayerInfoProps {
  name?: string;
  position?: string;
  nationality?: string;
}

export const PlayerInfo = ({ name, position, nationality }: PlayerInfoProps) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold mb-2">{name}</h1>
    <div className="flex gap-4 text-gray-600">
      <span>{position}</span>
      <span>{nationality}</span>
    </div>
  </div>
)