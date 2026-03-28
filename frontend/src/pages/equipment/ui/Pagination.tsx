import { Pagination as HeroPagination } from "@heroui/react";
import type { PaginationData } from "@engineering-data-normalizer/shared";
import { useEquipmentTableQuery } from "../model/useEquipmentTableQuery";
import { getPageNumbers } from "../model/utils";

interface PaginationProps {
  pagination: PaginationData;
}

export const Pagination = ({ pagination }: PaginationProps) => {
  const { totalPages } = pagination;

  if (totalPages <= 1) return null;

  const { query, updateQuery } = useEquipmentTableQuery();

  const currentPage = query.page ?? pagination.page ?? 1;

  const handlePageChange = (newPage: number) => {
    updateQuery({
      ...query,
      page: newPage,
    });
  };

  return (
    <HeroPagination>
      <HeroPagination.Content>
        <HeroPagination.Item>
          <HeroPagination.Previous
            isDisabled={currentPage === 1}
            onPress={() => handlePageChange(currentPage - 1)}
          >
            <HeroPagination.PreviousIcon />
          </HeroPagination.Previous>
        </HeroPagination.Item>

        {getPageNumbers(currentPage, totalPages).map((p) => {
          if (typeof p === "string") {
            return (
              <HeroPagination.Item key={p}>
                <HeroPagination.Ellipsis />
              </HeroPagination.Item>
            );
          }

          return (
            <HeroPagination.Item key={p}>
              <HeroPagination.Link
                isActive={p === currentPage}
                onPress={() => handlePageChange(p)}
              >
                {p}
              </HeroPagination.Link>
            </HeroPagination.Item>
          );
        })}

        <HeroPagination.Item>
          <HeroPagination.Next
            isDisabled={currentPage === totalPages}
            onPress={() => handlePageChange(currentPage + 1)}
          >
            <HeroPagination.NextIcon />
          </HeroPagination.Next>
        </HeroPagination.Item>
      </HeroPagination.Content>
    </HeroPagination>
  );
};
