import { merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmojiSetting } from './setting';
import { chromeEvent, storageGet, storageSet } from './chrome';
import { filter } from 'rxjs/operators';

export const storedEmojiSetting: Observable<EmojiSetting> = merge(
  storageGet(chrome.storage.sync, {
    emoji: { type: EmojiSetting.DEFAULT },
  }).then((obj) => obj.emoji),
  chromeEvent(chrome.storage.onChanged).pipe(
    map(([value]) => value.emoji && value.emoji.newValue),
    filter(Boolean),
  ),
);

export function saveEmojiSetting(value: EmojiSetting) {
  return storageSet(chrome.storage.sync, { emoji: value });
}
