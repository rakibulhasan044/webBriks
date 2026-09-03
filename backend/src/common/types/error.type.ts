export interface CustomDatabaseError extends Error {
  original?: { message?: string };
  parent?: { message?: string };
  sql?: string;
  fields?: Record<string, unknown>;
}
