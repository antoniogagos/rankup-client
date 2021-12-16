export function setColorScheme() {
  let theme = 'light';
  if (localStorage.getItem('theme')) {
    theme = localStorage.getItem('theme');
  } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    theme = 'dark';
  }
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-color-mode', 'dark');
  } else {
    removeColorScheme();
  }
}

export function removeColorScheme() {
  document.documentElement.removeAttribute('data-color-mode');
}
