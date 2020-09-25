/**
 * 屏幕焦点监听和事件订阅
 */

// 文档是否可见
export const isDocumentVisible = (): boolean => {
  if (
    typeof document !== 'undefined' &&
    typeof document.visibilityState !== 'undefined'
  ) {
    return document.visibilityState !== 'hidden';
  }
  return true;
};

// 当前环境是否联网
export const isOnline = (): boolean => {
  if (typeof navigator.onLine !== 'undefined') {
    return navigator.onLine;
  }
  return true;
};

const listeners: any[] = [];

function subscribe(listener: () => void) {
  listeners.push(listener);

  return () => {
    const index = listeners.indexOf(listener);
    listeners.splice(index, 1);
  };
}

let eventBinded = false;
if (typeof window !== 'undefined' && window.addEventListener && !eventBinded) {
  const revalation = () => {
    if (!isDocumentVisible() || !isOnline()) {
      return;
    }
    listeners.forEach(fn => fn());
  };

  window.addEventListener('visibilitychange', revalation, false);
  window.addEventListener('focus', revalation, false);
  eventBinded = true;
}

export default subscribe;
