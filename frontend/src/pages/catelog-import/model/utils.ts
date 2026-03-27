import * as XLSX from "xlsx";
import type { SelectionRange } from "./types";

export const getWorkbook = (file: File): Promise<XLSX.WorkBook> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result;
      try {
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        resolve(workbook);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const parseSheet = (wb: XLSX.WorkBook, sheetName: string): any[][] => {
  const ws = wb.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

  const maxCols = Math.max(...jsonData.map((row) => row.length), 0);
  return jsonData.map((row) =>
    Array.from({ length: maxCols }, (_, i) => row[i] ?? ""),
  );
};

export const extractTableData = (
  data: any[][],
  headerRange: SelectionRange,
  bodyRange: SelectionRange,
) => {
  const rawHeader = getSubMatrix(data, headerRange);
  const rawBody = getSubMatrix(data, bodyRange);

  const headers: string[] = rawHeader[0].map((_, colIndex) => {
    return rawHeader
      .map((row) => String(row[colIndex] || "").trim())
      .filter(Boolean)
      .join(" ");
  });

  const body: string[][] = rawBody.map((row) =>
    row.map((cell) => String(cell ?? "").trim()),
  );

  return { headers, body };
};

export const getCellClass = (
  r: number,
  c: number,
  tempRange: SelectionRange | null,
  headerRange: SelectionRange | null,
  bodyRange: SelectionRange | null,
) => {
  if (isInRange(r, c, tempRange)) return "bg-primary-200 border-primary-400";

  if (isInRange(r, c, headerRange))
    return "bg-blue-200 border-blue-500 opacity-80";

  if (isInRange(r, c, bodyRange))
    return "bg-emerald-200 border-emerald-500 opacity-80";

  return "bg-white border-gray-200";
};

const getSubMatrix = (matrix: any[][], range: SelectionRange) => {
  if (!range) return [];

  const rStart = Math.min(range.start.r, range.end.r);
  const rEnd = Math.max(range.start.r, range.end.r);
  const cStart = Math.min(range.start.c, range.end.c);
  const cEnd = Math.max(range.start.c, range.end.c);

  return matrix
    .slice(rStart, rEnd + 1)
    .map((row) => row.slice(cStart, cEnd + 1));
};

const isInRange = (r: number, c: number, range: SelectionRange | null) => {
  if (!range) return false;
  const minR = Math.min(range.start.r, range.end.r);
  const maxR = Math.max(range.start.r, range.end.r);
  const minC = Math.min(range.start.c, range.end.c);
  const maxC = Math.max(range.start.c, range.end.c);
  return r >= minR && r <= maxR && c >= minC && c <= maxC;
};

interface BaseReferenceEntity {
  id: string;
  name: string;
}

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
