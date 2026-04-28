import type { DashboardSummary } from "@engineering-data-normalizer/shared";
import { Section } from "./Section";

type TopCategoriesProps = Partial<Pick<DashboardSummary, "topCategories">>;

export const TopCategories = ({ topCategories }: TopCategoriesProps) => {
  return (
    <Section title="Популярные категории">
      <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="space-y-6">
          {topCategories?.map((category, index) => {
            const width = (category.count / topCategories[0].count) * 100;

            return (
              <div key={category.id}>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-xl">
                    <span className="font-bold text-gray-400 mr-2">
                      #{index + 1}
                    </span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <span className="text-xl text-gray-500">
                    {category.count} шт.
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
};
