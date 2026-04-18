'use client';
import { useEffect } from 'react';

export function useHistoryModal(onClose: () => void) {
  useEffect(() => {
    history.pushState({ modal: true }, '');
    document.body.style.overflow = 'hidden';
    const handlePopState = () => {
      onClose();
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.body.style.overflow = '';
    };
  }, [onClose]);
}
