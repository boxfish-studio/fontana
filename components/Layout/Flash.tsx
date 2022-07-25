import { StyledOcticon, Flash } from "@primer/react";
import { CheckIcon } from "@primer/octicons-react";
import { useHandleDestroyAnimated } from "hooks";
import { useEffect, useRef } from "react";
import { useSuccess } from "components/Table/Table";
const Toast: React.FC = () => {
  const flashRef = useRef<null | HTMLDivElement>(null);
  const { message, setMessage } = useSuccess();
  const [sendSuccess, setSendSuccess] = useHandleDestroyAnimated(
    flashRef,
    setMessage
  );
  useEffect(() => {
    console.log(1, message);
    if (message === "") return;
    setSendSuccess(true);
  }, [message]);
  if (sendSuccess)
    return (
      <div
        ref={flashRef}
        id="send-success"
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: "20rem",
          fontSize: "1.1rem",
          zIndex: 100,
        }}
      >
        <Flash variant="success">
          <StyledOcticon icon={CheckIcon} />
          {message}
        </Flash>
      </div>
    );
  return null;
};

export default Toast;
