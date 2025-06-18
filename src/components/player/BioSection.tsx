interface BioSectionProps {
  bio?: string;
}

export const BioSection = ({ bio }: BioSectionProps) => (
  <div className="p-6 mb-8">
    <h2 className="text-2xl font-bold mb-4">選手紹介</h2>
    {bio ? (
      <div className="prose max-w-none whitespace-pre-line">
        {bio}
      </div>
    ) : (
      <div className="text-gray-400 italic">
        選手紹介が登録されていません
      </div>
    )}
  </div>
);