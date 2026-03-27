import { Spinner } from "@heroui/react";
import { useCategories } from "@/entities/category";
import { AppLink } from "@/shared/ui";

export const CategorySelection = () => {
  const { data: categories, isPending } = useCategories();

  if (isPending) return <Spinner />;

  return (
    <div>
      <ul className="flex flex-wrap gap-2">
        {categories?.map((category) => (
          <li key={category.id}>
            <AppLink
              to={{
                pathname: "/equipment",
                search: `?categoryId=${category.id}`,
              }}
              className="group p-4 border rounded-xl hover:shadow-lg transition-all"
            >
              <div className="text-lg font-bold group-hover:text-primary">
                {category.name}
              </div>
            </AppLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
