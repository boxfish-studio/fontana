import { FontanaSVG } from 'components/Layout';
import { NetworkSelector, Wallet } from 'components/Layout';

const Header: React.FC = () => (
  <nav>
    <div className="d-flex flex-justify-center flex-items-center">
      <FontanaSVG width={27} />
      <h4 className="ml-3 text-bold color-white" style={{ color: 'white' }}>
        Fontana - A simple dashboard to manage Solana SPL tokens
      </h4>
    </div>
    <div className="d-flex flex-justify-center flex-items-center">
      <NetworkSelector />
      <Wallet />
    </div>
  </nav>
);

export default Header;
