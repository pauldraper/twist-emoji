import { tap, switchMapTo } from 'rxjs/operators';
import { EmojiEvent } from './event';
import { storedEmojiSetting } from './storage';
import { fromEvent } from 'rxjs';

const dispatchEmojiSetting = fromEvent(document, EmojiEvent.PAGE_LOAD)
  .pipe(switchMapTo(storedEmojiSetting))
  .pipe(
    tap((emoji) => {
      const event = new CustomEvent(EmojiEvent.SETTING, {
        detail: JSON.stringify(emoji),
      });
      document.dispatchEvent(event);
    }),
  );

function loadScript(path: string) {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL(path);
  (document.head || document.documentElement).append(script);
}

loadScript('runtime.js');
loadScript('page.js');

dispatchEmojiSetting.subscribe();
