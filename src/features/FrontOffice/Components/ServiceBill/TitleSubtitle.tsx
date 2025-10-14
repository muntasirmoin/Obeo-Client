// components/TitleSubtitle.tsx
import React from "react";

type TitleSubtitleProps = {
  title: string;
  subtitle?: string;
};

const TitleSubtitle: React.FC<TitleSubtitleProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="text-gray-600 mt-1 text-lg">{subtitle}</p>}
    </div>
  );
};

export default TitleSubtitle;
