import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import axios from 'axios';
import useSWR from 'swr/immutable';
import { URLsResponse } from './UrlsResponse';

// Create a function that truncates a string into a specified length
// and adds ellipses in the middle of the string if it's longer than the specified length
const truncate = (str: string, length: number) => {
  if (str.length <= length) return str;
  return (
    str.substring(0, length / 2) +
    '...' +
    str.substring(str.length - length / 2)
  );
};

export const GetLink = () => {
  return (
    <div
      className="flex items-center bg-purple-900 bg-center bg-cover bg-no-repeat min-h-screen"
      style={{
        backgroundImage:
          'linear-gradient(to top, #0e001e, #1d1242, #311c68, #482491, #632bbb)',
      }}
    >
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          <img
            className="text-center mx-auto h-15 mb-5"
            src="/logo_web3.svg"
            alt="Logo"
          />
          <span className="block">Gracias, Web3CR!</span>
          <span className="block">Construyamos un excelente 2022!</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-purple-200">
          Para obtener tus enlaces con el fin de redimir tus NFTS, debes
          conectar el wallet provisto en el formulario del tercer cuatrimestre
          de 2021; de manera alternativa puedes ver los enlaces de
          distribución&nbsp;
          <a
            className="font-semibold text-purple-200 hover:text-purple-400 transition duration-150 ease-in-out"
            href={URLS_URL}
            download
          >
            aquí
          </a>
          .
        </p>
        <div className="mt-8 flex items-center justify-center">
          <WalletMultiButton />
        </div>
        <LinkResult />
      </div>
    </div>
  );
};

const URLS_URL = '/mainnet-beta-urls.json';

const LinkResult = () => {
  const { connecting, connected, publicKey } = useWallet();
  const { data, error } = useSWR(URLS_URL, (key) =>
    axios.get<URLsResponse[]>(key).then((res) => res.data),
  );
  const isLoadingSwr = !data && !error;

  if (connecting || isLoadingSwr) {
    return <p className="mt-4 text-lg leading-6 text-purple-200">Loading...</p>;
  }

  if (!connected) {
    return (
      <p className="mt-4 text-lg leading-6 text-purple-200">
        Por favor conecta tu wallet de Solana.
      </p>
    );
  }

  const matchingUrls = data?.filter(
    (url) => url.handle === publicKey?.toString(),
  );

  return (
    <div className="justify-center flex">
      <div className="mt-4 flex items-center justify-center">
        {matchingUrls?.length ? (
          <div>
            <p className="text-purple-100 text-lg font-bold">
              Tienes {matchingUrls.length} enlace
              {matchingUrls.length > 1 ? 's' : ''} para reclamar!
            </p>
            {matchingUrls.map((matchingUrl) => (
              <p className="text-purple-200">
                <a
                  className="font-semibold text-purple-200 hover:text-purple-400 transition duration-150 ease-in-out"
                  href={matchingUrl.url.replace('gumdrop', 'metaplex')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {truncate(matchingUrl.url.replace('gumdrop', 'metaplex'), 25)}
                </a>
              </p>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-lg leading-6 text-purple-200">
            Lo sentimos, pero parece que no tienes ningún enlace de NFT para
            redimir. si crees que esto es un error por favor revisa la
            distribución&nbsp;
            <a
              className="font-semibold text-purple-200 hover:text-purple-400 transition duration-150 ease-in-out"
              href={URLS_URL}
              download
            >
              aquí
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
};
