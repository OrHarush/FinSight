export const isMobileDevice = (): boolean =>
  /Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const isIosDevice = (): boolean => /iphone|ipad|ipod/i.test(navigator.userAgent);

export const isRunningStandalone = (): boolean =>
  (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
