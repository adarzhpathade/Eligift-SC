import { useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export function useNativeHaptics() {
  const isNative = Capacitor.isNativePlatform();

  const triggerImpact = useCallback(async (style: ImpactStyle = ImpactStyle.Light) => {
    if (!isNative) return;
    try {
      await Haptics.impact({ style });
    } catch (e) {
      console.error('Haptics failed:', e);
    }
  }, [isNative]);

  const triggerSuccess = useCallback(async () => {
    if (!isNative) return;
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch (e) {
      console.error('Haptics failed:', e);
    }
  }, [isNative]);

  const triggerError = useCallback(async () => {
    if (!isNative) return;
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch (e) {
      console.error('Haptics failed:', e);
    }
  }, [isNative]);

  const triggerSelection = useCallback(async () => {
    if (!isNative) return;
    try {
      await Haptics.selectionStart();
      await Haptics.selectionChanged();
      await Haptics.selectionEnd();
    } catch (e) {
      console.error('Haptics failed:', e);
    }
  }, [isNative]);

  return {
    isNative,
    triggerImpact,
    triggerSuccess,
    triggerError,
    triggerSelection
  };
}
