import { Observable, from } from 'rxjs';

export function chromeEvent<T extends unknown[]>(
  event: chrome.events.Event<(...event: T) => void>,
  ...args: any[]
): Observable<T> {
  return new Observable((subscriber) => {
    const listener = (...event: T) => subscriber.next(event);
    (<any>event.addListener)(listener, ...args);
    return () => event.removeListener(listener);
  });
}

export function storageGet(
  area: chrome.storage.StorageArea,
  keys: string | string[] | Object | null,
): Promise<any> {
  return new Promise((resolve) => area.get(keys, resolve));
}

export function storageSet(
  area: chrome.storage.StorageArea,
  value: Object,
): Promise<void> {
  return new Promise((resolve) => area.set(value, resolve));
}
