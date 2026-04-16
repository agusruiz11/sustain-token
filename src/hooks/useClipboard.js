import { useCallback, useRef } from 'react';

export function useClipboard() {
  const timers = useRef({});

  const copyChip = useCallback((btn, value) => {
    navigator.clipboard.writeText(value).then(() => {
      const orig = btn.textContent;
      const origColor = btn.style.color;
      btn.textContent = '✓';
      btn.style.color = 'var(--green-600)';

      if (timers.current[value]) clearTimeout(timers.current[value]);

      timers.current[value] = setTimeout(() => {
        btn.textContent = orig;
        btn.style.color = origColor;
      }, 1500);
    }).catch(() => {});
  }, []);

  return { copyChip };
}
