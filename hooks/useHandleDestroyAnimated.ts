import { MutableRefObject, useEffect, useState } from "react";

export default function useHandleDestroyAnimated<T extends HTMLElement>(
  _ref: MutableRefObject<T | null>
) {
  const [sendSuccess, setSendSuccess] = useState(false);

  useEffect(() => {
    if (sendSuccess) {
      handleDeletion(_ref);
    }
  }, [_ref, sendSuccess]);

  function handleDeletion<T extends HTMLElement>(
    element: MutableRefObject<T | null>
  ) {
    const style = element?.current?.style;
    if (!style) return;
    setTimeout(() => {
      style.transition = "all 0.5s";
      style.transform = "translateY(-50%)";
      style.opacity = "0";
      setTimeout(() => {
        setSendSuccess(false);
      }, 600);
    }, 4000);
  }
  return {
    sendSuccess,
    setSendSuccess,
  };
}
