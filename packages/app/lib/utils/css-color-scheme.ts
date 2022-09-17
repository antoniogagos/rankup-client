export function setColorScheme() {
  let theme = 'light';
  if (localStorage.getItem('theme')) {
    theme = localStorage.getItem('theme') ?? 'light';
  } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    theme = 'dark';
  }
  if (theme === 'dark') {
    document.documentElement.dataset.colorMode = 'dark';
  } else {
    removeColorScheme();
  }
}

export function removeColorScheme() {
  delete document.documentElement.dataset.colorMode;
}
