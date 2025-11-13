/**
 * Central export file for all TypeScript types
 */

// Re-export all database types
export * from './database.types';

// Common utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// Utility type for making all properties optional except specified ones
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// Utility type for making specific properties required
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Utility type for making specific properties optional
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Generic ID type
export type ID = string;

// Generic timestamp type
export type Timestamp = string;

// Generic JSON type
export type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

// Form field error type
export interface FieldError {
  field: string;
  message: string;
}

// Validation result type
export interface ValidationResult {
  valid: boolean;
  errors: FieldError[];
}

// Sort order type
export type SortOrder = 'asc' | 'desc';

// Pagination params type
export interface PaginationParams {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: SortOrder;
}

// Generic async state type
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Generic form state type
export interface FormState<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}
