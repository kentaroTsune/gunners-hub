interface StatCardProps {
  title: string;
  value: number | string;
}

export const StatCard = ({ title, value }: StatCardProps) => {
  return (
    <div className="p-4 text-center bg-white">
      <div className="text-gray-500 text-sm mb-1">{title}</div>
      <div className="text-2xl font-bold text-primary-600">{value}</div>
    </div>
  );
}