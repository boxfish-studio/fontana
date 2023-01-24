import { MutableRefObject, useEffect, useState } from 'react';

const styles = Object.freeze({
  opacity: '0',
  transform: 'translateY(-50%)',
  transition: 'all 0.5s',
});

export default function useHandleDestroyAnimated<T extends HTMLElement>(
  ref: MutableRefObject<T | null>,
  setMessage: (message: string) => void
): [boolean, (_: boolean) => void] {
  const [sendSuccess, setSendSuccess] = useState(false);

  useEffect(() => {
    if (sendSuccess) {
      handleDeletion(ref);
    }
  }, [ref, sendSuccess]);

  function handleDeletion<T extends HTMLElement>(
    element: MutableRefObject<T | null>
  ) {
    const style = element?.current?.style;
    if (!style) return;
    setTimeout(() => {
      style.transition = styles.transition;
      style.transform = styles.transform;
      style.opacity = styles.opacity;
      setTimeout(() => {
        setSendSuccess(false);
        setMessage('');
      }, 600);
    }, 4000);
  }
  return [sendSuccess, setSendSuccess];
}
