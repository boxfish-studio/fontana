import { FontanaSVG } from "components/Layout";
import { NetworkSelector, Wallet } from "components/Layout";

const Header: React.FC = () => {
  return (
    <nav>
      <div className="d-flex flex-justify-center flex-items-center">
        <FontanaSVG width={27} />
        <h4 className="ml-3 text-bold color-white" style={{ color: "white" }}>
          Fontana - The Solana SPL multi-token generic faucet
        </h4>
      </div>
      <div className="d-flex flex-justify-center flex-items-center">
        <NetworkSelector />
        <Wallet />
      </div>
    </nav>
  );
};

export default Header;
