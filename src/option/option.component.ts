import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { EmojiSetting, resolveEmojis } from '../setting';
import { Subject, merge, Observable } from 'rxjs';
import { storedEmojiSetting, saveEmojiSetting } from '../storage';
import {
  switchMap,
  map,
  first,
  tap,
  takeUntil,
  publishReplay,
  refCount,
  debounceTime,
  mapTo,
  startWith,
} from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'extension',
  styleUrls: ['./option.component.scss'],
  templateUrl: './option.component.html',
})
export class OptionComponent implements OnDestroy {
  constructor() {
    this.doSave$.pipe(takeUntil(this.destroy$)).subscribe();
  }

  readonly EmojiSetting = EmojiSetting;

  private readonly destroy$ = new Subject();

  readonly resetDefault$ = new Subject();

  readonly emojis$ = merge(
    storedEmojiSetting.pipe(first()),
    this.resetDefault$.pipe(
      mapTo(<EmojiSetting>{ type: EmojiSetting.DEFAULT }),
    ),
  ).pipe(
    map((setting) => new FormControl(emojisToText(resolveEmojis(setting)))),
    publishReplay(1),
    refCount(),
  );

  readonly setting$: Observable<EmojiSetting> = this.emojis$.pipe(
    switchMap((control) => control.valueChanges.pipe(startWith(control.value))),
    map((text) => {
      const emojis = text.replace(/\s/g, '');
      if (emojis === resolveEmojis({ type: EmojiSetting.DEFAULT }).join('')) {
        return { type: EmojiSetting.DEFAULT };
      }
      return { type: EmojiSetting.CUSTOM, emojis };
    }),
  );

  private readonly doSave$ = this.setting$.pipe(
    debounceTime(100),
    tap((setting) => {
      console.log('Saving', setting);
      saveEmojiSetting(setting);
    }),
  );

  ngOnDestroy() {
    this.destroy$.next();
  }
}

function emojisToText(emojis: string[] | undefined) {
  return emojis ? emojis.join('') : 'N/A';
}
