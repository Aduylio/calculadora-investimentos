interface ResultCardProps {
  title: string;
  value: string;
  description?: string;
}

export function ResultCard({ title, value, description }: ResultCardProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <p className="text-sm text-zinc-500">{title}</p>
      <p className="mt-1 text-xl font-semibold text-zinc-900">{value}</p>
      {description && (
        <p className="mt-1 text-sm text-zinc-400">{description}</p>
      )}
    </div>
  );
}
