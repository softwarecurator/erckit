import {
	InjectedConnector,
	configureChains,
	createConfig,
	getAccount,
	watchAccount,
	watchNetwork,
	disconnect,
	type GetAccountResult,
	type ChainProviderFn,
	type GetNetworkResult,
	Connector
} from '@wagmi/core';
import { mainnet, polygon, optimism, arbitrum, type Chain } from '@wagmi/core/chains';
import { get, writable } from 'svelte/store';
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect';
import { alchemyProvider } from '@wagmi/core/providers/alchemy';
import { infuraProvider } from '@wagmi/core/providers/infura';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';
import { publicProvider } from '@wagmi/core/providers/public';
import { CoinbaseWalletConnector } from '@wagmi/core/connectors/coinbaseWallet';
import { Web3Modal } from '@web3modal/html';
import { EthereumClient } from '@web3modal/ethereum';

export const isErckitSetup = writable<boolean>(false);
export const configuredConnectors = writable<Connector[]>([]);
export const web3Modal = writable<Web3Modal>();

type DefaultConnectorsProps = {
	chains?: Chain[];
	app: {
		name: string;
		icon?: string;
		description?: string;
		url?: string;
	};
	walletConnectProjectId: string;
	alchemyId: string;
};

type DefaultConfigProps = {
	appName: string;
	appIcon?: string;
	appDescription?: string;
	appUrl?: string;
	autoConnect?: boolean;
	alchemyId: string;
	infuraId?: string;
	chains?: Chain[];
	connectors?: any;
	publicClient?: any;
	webSocketPublicClient?: any;
	enableWebSocketPublicClient?: boolean;
	stallTimeout?: number;
	walletConnectProjectId: string;
};

const defaultChains = [mainnet, polygon, optimism, arbitrum];

const getDefaultConnectors = ({
	chains,
	app,
	walletConnectProjectId,
	alchemyId
}: DefaultConnectorsProps) => {
	const hasAllAppData = app.name && app.icon && app.description && app.url;
	let defaultConnectors: any[] = [];
	defaultConnectors = [
		...defaultConnectors,
		new CoinbaseWalletConnector({
			chains,
			options: {
				appName: app.name,
				headlessMode: true,
				jsonRpcUrl: `https://eth-mainnet.alchemyapi.io/v2/${alchemyId}`
			}
		}),
		new WalletConnectConnector({
			chains,
			options: {
				showQrModal: false,
				projectId: walletConnectProjectId,
				metadata: hasAllAppData
					? {
							name: app.name,
							description: app.description!,
							url: app.url!,
							icons: [app.icon!]
					  }
					: undefined
			}
		}),
		new InjectedConnector({
			chains,
			options: {
				name: (detectedName) =>
					`Injected (${typeof detectedName === 'string' ? detectedName : detectedName.join(', ')})`
			}
		})
	];

	configuredConnectors.set(defaultConnectors);
	return defaultConnectors;
};

export const defaultConfig = ({
	autoConnect = true,
	appName = 'Erc.Kit',
	appIcon,
	appDescription,
	appUrl,
	chains = defaultChains,
	alchemyId,
	infuraId,
	connectors,
	publicClient,
	stallTimeout,
	walletConnectProjectId
}: DefaultConfigProps) => {
	const providers = [];
	if (alchemyId) {
		providers.push(alchemyProvider({ apiKey: alchemyId }));
	}
	if (infuraId) {
		providers.push(infuraProvider({ apiKey: infuraId }));
	}
	providers.push(
		jsonRpcProvider({
			rpc: (c) => {
				return { http: c.rpcUrls.default.http[0] };
			}
		})
	);

	providers.push(publicProvider());
	const {
		publicClient: configuredPublicClient,
		chains: configuredChains,
		webSocketPublicClient: configuredWebSocketPublicClient
	} = configureChains(chains, providers);

	if (connectors) configuredConnectors.set(connectors);

	const ercClient = createConfig({
		autoConnect,
		publicClient: publicClient ?? configuredPublicClient,
		webSocketPublicClient: configuredWebSocketPublicClient,
		connectors:
			connectors ??
			getDefaultConnectors({
				chains: configuredChains,
				app: {
					name: appName,
					icon: appIcon,
					description: appDescription,
					url: appUrl
				},
				walletConnectProjectId,
				alchemyId
			})
	});

	const ethereumClient = new EthereumClient(ercClient, configuredChains);
	const modal = new Web3Modal({ projectId: walletConnectProjectId }, ethereumClient);

	web3Modal.set(modal);
	isErckitSetup.set(true);
	return { init };
};

const init = async () => {
	setupListeners();
	try {
		const account = await waitForConnection();
		console.log(account);
	} catch (error) {
		console.log(error);
	}
};

const setupListeners = () => {
	watchAccount(handleAccountChange);
	watchNetwork(handleNetworkChange);
};

const handleAccountChange = (account: GetAccountResult) => {
	console.log(account);
};

const handleNetworkChange = (data: GetNetworkResult) => {
	console.log(data);
};

const waitForConnection = (): Promise<GetAccountResult> =>
	new Promise((resolve, reject) => {
		const attemptToGetAccount = () => {
			const account = getAccount();
			if (account.isDisconnected) reject('account is disconnected');
			if (account.isConnecting) {
				setTimeout(attemptToGetAccount, 250);
			} else {
				resolve(account);
			}
		};

		attemptToGetAccount();
	});
