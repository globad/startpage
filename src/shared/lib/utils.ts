export const isClient = () => {
  return typeof window !== 'undefined';
};

export function isObject(value: unknown) {
  return value !== null && typeof value === 'object';
}
