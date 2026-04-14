import type { BaseReferenceEntity } from "./types";

export async function resolveEntityId<T extends BaseReferenceEntity>(
  id: string,
  name: string,
  existingList: T[],
  createFn: (data: { name: string }) => Promise<T>,
) {
  if (id) return id;

  const trimmedName = name.trim();

  if (!trimmedName) {
    return undefined;
  }

  const existing = existingList.find(
    (item) => item.name.toLowerCase() === trimmedName.toLowerCase(),
  );

  if (existing) {
    return existing.id;
  }

  const newItem = await createFn({ name: trimmedName });
  return newItem.id;
}
