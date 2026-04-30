type Props = { label: string; value: string; sub?: string; positive?: boolean };

export default function StatCard({ label, value, sub, positive }: Props) {
  return (
    <div className="rounded-xl border border-[#2A2D3A] bg-[#131722] p-4">
      <p className="text-xs text-[#5B616E]">{label}</p>
      <p className="mt-1 text-xl font-bold text-[#E8ECF0]">{value}</p>
      {sub && (
        <p className={`mt-1 text-xs font-medium ${positive ? "text-[#05B169]" : "text-[#CF202F]"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}
