import { useSearchParams } from "react-router";
import { CategorySelection } from "./CategorySelection";
import { EquipmentBrowse } from "./EquipmentBrowse";

export const EquipmentPage = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  if (!categoryId) {
    return <CategorySelection />;
  }

  return <EquipmentBrowse categoryId={categoryId} />;
};
