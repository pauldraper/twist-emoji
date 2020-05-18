import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmojiEvent } from './event';
import { EmojiSetting, resolveEmojis } from './setting';

const emojis$ = fromEvent(document, EmojiEvent.SETTING).pipe(
  map((event) => {
    const setting: EmojiSetting = (<CustomEvent>event).detail;
    return resolveEmojis(setting);
  }),
);

document.dispatchEvent(new CustomEvent(EmojiEvent.PAGE_LOAD));

let emojis: string[] | undefined;
emojis$.subscribe((e) => (emojis = e));

const original = Array.prototype.map;
Array.prototype.map = function (): any {
  return original.apply(
    emojis && this[0] === '👍' ? emojis : this,
    <any>arguments,
  );
};
