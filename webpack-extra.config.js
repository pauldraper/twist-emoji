module.exports = config => {
  config.entry.content = ['src/content.ts'];
  config.entry.page = ['src/page.ts'];
  config.output.library = 'twistEmoji';
};
