import { createContext, useContext } from "react";
import { PrivyClient, SiweSession } from "@privy-io/privy-browser";
import {
  NEXT_PUBLIC_PRIVY_API_HOST,
  NEXT_PUBLIC_PRIVY_API_KEY,
  NEXT_PUBLIC_PRIVY_KMS_HOST,
} from "../../config";

export function isMetaMaskEnabled() {
  return !!(
    typeof window !== "undefined" &&
    window.ethereum &&
    window.ethereum.isMetaMask
  );
}

// When next.js is rendering on the server, there is no
// window.ethereum. This is a mock for that object in Node.
const NodeMockProvider = {
  request(arg: {
    method: string;
    params?: [address: string, message: string];
  }) {
    switch (arg.method) {
      case "personal_sign":
        return "";
      case "eth_accounts":
        return [];
      case "eth_requestAccounts":
        return [];
      case "eth_chainId":
        return "0x1";
      default:
        throw new Error("unrecognized ethereum method");
    }
  },
};

/**
 * The session object wraps the Privy SiweSession object
 * to provide synchronous helpers which makes checking
 * session state much easier.  *
 *
 * It also exposes an instance of the Privy client,
 * auth'd with the SiweSession. This way, the session state
 * and privy client are bundled together in a react hook.
 */
class Session {
  private siwe: SiweSession;
  private _address: string | null;

  privy: PrivyClient;

  constructor(provider: any) {
    this.siwe = new SiweSession(NEXT_PUBLIC_PRIVY_API_KEY, provider, {
      baseURL: NEXT_PUBLIC_PRIVY_API_HOST,
    });

    this.privy = new PrivyClient({
      apiURL: NEXT_PUBLIC_PRIVY_API_HOST,
      kmsURL: NEXT_PUBLIC_PRIVY_KMS_HOST,
      session: this.siwe,
    });

    this._address = null;
  }

  /**
   * A cached reference to the user's connected wallet address.
   */
  get address() {
    if (this._address === null) {
      throw new Error("Attempt to reference address when null");
    }

    return this._address;
  }

  /**
   * Whether or not the user is currently authenticated.
   */
  get authenticated() {
    return this._address !== null;
  }

  /**
   * Initialize the session. Privy's SiweSession object will
   * store session state in localStorage for smooth reuse.
   */
  async initialize() {
    const authenticated = await this.siwe.isAuthenticated();

    if (!authenticated) {
      return;
    }

    this._address = await this.siwe.address();
  }

  /**
   * Authenticates the user with Privy. This does two things:
   *
   *     1. Connects the user's wallet (if it isn't already connected).
   *     2. Performs Sign-In With Ethereum (EIP-4361) against the Privy
   *        API to authenticate the user with Privy. The result of this
   *        operation is an access token granting the user access to Privy.
   *        The access token is cached in localStorage so that the user
   *        does NOT have to repeatedly sign a message and authenticate
   *        while the access token remains active.
   *
   * Once authenticated, it caches the authenticated wallet address on
   * this object for ease of checking whether the session is authenticated
   * and who is the authenticated subject.
   */
  async authenticate() {
    await this.siwe.authenticate();
    this._address = await this.siwe.address();
  }

  /**
   * Destroys the session. Can be used for "sign out"
   * functionality.
   */
  async destroy() {
    await this.siwe.destroy();
    this._address = null;
  }
}

const SessionContext = createContext<Session>(
  new Session(isMetaMaskEnabled() ? window.ethereum : NodeMockProvider)
);

/**
 * A React hook for ease of working with the session in React components.
 */
export function usePrivySession() {
  return useContext(SessionContext);
}
