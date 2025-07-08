import React from 'react';

interface PositionBreakdown {
  label: string;
  value: string | number;
}

interface InfoCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  breakdown?: PositionBreakdown[];
}

const InfoCard: React.FC<InfoCardProps> = ({ label, value, subtext, breakdown }) => {
  return (
    <div className="rounded-2xl shadow-md p-4 bg-white border border-gray-200 w-full">
      <h4 className="text-sm text-gray-500 uppercase tracking-wide">{label}</h4>
      <div className="flex justify-between items-start mt-1">
        <div>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
        {breakdown && (
          <div className="text-right text-sm space-y-1">
            {breakdown.map((item) => (
              <div key={item.label} className="text-gray-500">
                <span className="font-medium text-gray-800">{item.value}</span> {item.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoCard;
