export function useSetLocalStorage<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function useDeleteLocalStorage(key: string) {
  localStorage.removeItem(key);
}

export function useGetLocalStorage(key: string) {
  const value = window.localStorage.getItem(key);
  return JSON.parse(value!);
}
