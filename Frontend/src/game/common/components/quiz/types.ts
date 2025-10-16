export type WithCustomAttributes<T> = T & {
  [key: string]: any;
};