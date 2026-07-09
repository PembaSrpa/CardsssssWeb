const isBrowser = typeof window !== "undefined";

export async function getItem(key: string): Promise<string | null> {
  if (!isBrowser) {
    return null;
  }
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  if (!isBrowser) {
    return;
  }
  try {
    window.localStorage.setItem(key, value);
  } catch {
    return;
  }
}

export async function removeItem(key: string): Promise<void> {
  if (!isBrowser) {
    return;
  }
  try {
    window.localStorage.removeItem(key);
  } catch {
    return;
  }
}
