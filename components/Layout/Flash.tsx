import { StyledOcticon, Flash } from "@primer/react";
import { CheckIcon } from "@primer/octicons-react";
import { useHandleDestroyAnimated } from "hooks";
import { useEffect, useRef } from "react";
import { useSuccess, useConnection } from "contexts";

const Toast: React.FC = () => {
  const flashRef = useRef<null | HTMLDivElement>(null);
  const { message, mint, setMessage } = useSuccess();
  const { url } = useConnection();
  const [sendSuccess, setSendSuccess] = useHandleDestroyAnimated(
    flashRef,
    setMessage
  );

  useEffect(() => {
    if (message === "") return;
    setSendSuccess(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  const queryParam = url?.includes("devnet") ? "?cluster=devnet-solana" : "";

  if (sendSuccess)
    return (
      <div ref={flashRef} id="send-success">
        <Flash
          variant="success"
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <span>
            <StyledOcticon icon={CheckIcon} />
            <strong>{message}</strong>
          </span>
          {mint && (
            <a
              style={{ textDecoration: "underline", color: "#423939" }}
              href={`https://solana.fm/address/${mint}${queryParam}`}
            >
              <i>View token</i>
            </a>
          )}
        </Flash>
      </div>
    );
  return null;
};

export default Toast;
