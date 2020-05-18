export type EmojiSetting =
  | { type: typeof EmojiSetting.DEFAULT }
  | {
      type: typeof EmojiSetting.CUSTOM;
      emojis: string[];
    };

export namespace EmojiSetting {
  export const CUSTOM = 'custom';
  export const DEFAULT = 'default';
}

export function resolveEmojis(setting: EmojiSetting): string[] {
  switch (setting.type) {
    case EmojiSetting.CUSTOM:
      return [...setting.emojis];
    case EmojiSetting.DEFAULT:
      return [...EXTENDED_EMOJIS];
  }
}

const EXTENDED_EMOJIS: ReadonlyArray<string> = [
  // DM
  '👍',
  '😂',
  '😊',
  '😃',
  '😅',
  '🤔',
  '🎉',
  '👏',
  '😉',
  '❤️',
  '💯',
  '😁',
  '😄',
  '🙂',
  '😍',
  '👌',
  '🙌',
  '😀',
  '🙏',
  '😬',
  '🙈',
  '👀',
  '💪',
  '😎',
  '😱',
  '🤗',
  '✅',
  '😘',
  '😜',
  '👋',
  '🤣',
  '😳',
  '🚀',
  '😭',
  '😻',
  '🔥',
  '✔️',
  '🙃',
  '🎂',
  '😆',
  '😕',
  '🙄',
  '⭐',
  '👊',
  '😇',
  '🤓',
  '👇',
  '😢',
  '😝',
  '💆‍♀️',
  // other reactions
  '😡',
  '👎',
  // added
  '😐',
  '🙋',
  '🐛',
  '🔥',
  '🍀',
  '🎁',
  '☠️',
  '🤯',
  '❌',
  '🇺🇸',
  '👌',
  '💡',
  '✈️',
  '🔫',
  '🤦',
  '🤷',
  '🤮',
  '📈',
  '🏃',
  '💤',
  '😇',
  '👻',
  '💥',
  '🍕',
  '🐴',
  '❓',
  '❗',
  '🐸',
];
