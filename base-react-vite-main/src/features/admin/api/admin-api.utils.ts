import type { MetaData } from '@shared/types/api.types';

/**
 * Safely normalizes GET list responses from axiosClient.
 * axiosClient returns `{ data: T[], metaData }` when metaData is present,
 * or raw `T[]` when metaData is null/omitted.
 */
export function unwrapPaginated<T>(res: unknown): { data: T[]; metaData?: MetaData } {
  if (Array.isArray(res)) {
    return { data: res as T[] };
  }
  if (res && typeof res === 'object' && Array.isArray((res as { data?: unknown }).data)) {
    return res as { data: T[]; metaData?: MetaData };
  }
  return { data: [] };
}

/**
 * Safely normalizes GET array responses from axiosClient.
 */
export function unwrapArray<T>(res: unknown): T[] {
  if (Array.isArray(res)) {
    return res as T[];
  }
  if (res && typeof res === 'object' && Array.isArray((res as { data?: unknown }).data)) {
    return (res as { data: T[] }).data;
  }
  return [];
}
