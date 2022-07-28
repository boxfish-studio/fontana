import { FC, useEffect, useRef } from 'react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { clusterApiUrl, Connection } from '@solana/web3.js'
import { Network, useConnection } from 'contexts'

const RPC_API_DEVNET = process.env.NEXT_PUBLIC_RPC_API_DEVNET || clusterApiUrl('devnet')
const RPC_API_MAINNET = process.env.NEXT_PUBLIC_RPC_API_MAINNET || clusterApiUrl('mainnet-beta')

function getUrl(network: Network): string {
    switch (network) {
        case 'Devnet':
            return RPC_API_DEVNET
        case 'Mainnet':
            return RPC_API_MAINNET
        default:
            throw new Error(`Unknown network: ${network}`)
    }
}

const NetworkSelector: FC = () => {
    const { setConnection, network, setNetwork, setUrl } = useConnection()
    const detailsRef = useRef<HTMLDetailsElement>(null)
    function hideUl() {
        detailsRef.current!.removeAttribute('open')
    }

    useEffect(() => {
        const _network = window.localStorage.getItem('network-fontana') as Network | null
        if (_network === 'Devnet' || _network === 'Mainnet' || _network === 'Testnet') {
            setNetwork(_network)
            setConnection(new Connection(getUrl(_network)))
            setUrl(getUrl(_network))
            window.localStorage.setItem('network-fontana', _network)
        }
        if (!_network) {
            setNetwork('Devnet')
            setConnection(new Connection(getUrl('Devnet')))
            setUrl(getUrl('Devnet'))
            window.localStorage.setItem('network-fontana', 'Devnet')
        }
    }, [])
    function changeNetwork(_network: Network) {
        setNetwork(_network)
            setConnection(new Connection(getUrl(_network)))
            setUrl(getUrl(_network))
        hideUl()
        window.localStorage.setItem('network-fontana', _network)
    }

    return (
        <div>
            <details
                id='details'
                className='dropdown details-reset details-overlay d-inline-block cursor-pointer'
                ref={detailsRef}
            >
                <summary className='btn' aria-haspopup='true'>
                    {network || 'Select Network'}
                    <span className='dropdown-caret'></span>
                </summary>
                {
                    <ul id='ul' className='dropdown-menu dropdown-menu-se  mt-2'>
                        {Object.keys(WalletAdapterNetwork)
                            .filter((e) => e !== 'Testnet')
                            .map((_network) => (
                                <li
                                    className='dropdown-item'
                                    key={_network}
                                    onClick={() => changeNetwork(_network as Network)}
                                >
                                    {_network}
                                </li>
                            ))}
                    </ul>
                }
            </details>
        </div>
    )
}

export default NetworkSelector