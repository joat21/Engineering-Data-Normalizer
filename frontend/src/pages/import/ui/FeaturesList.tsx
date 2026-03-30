interface FeaturesListProps {
  features: string[];
}

export const FeaturesList = ({ features }: FeaturesListProps) => {
  return (
    <ul className="text-base text-default-foreground/60 list-disc pl-5 space-y-1">
      {features.map((feature, i) => (
        <li key={i}>{feature}</li>
      ))}
    </ul>
  );
};
