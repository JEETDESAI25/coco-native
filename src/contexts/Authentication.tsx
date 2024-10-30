/**
 * Hook for accessing and managing Auth
 */

import {Buffer} from 'buffer';
import React from 'react';
import * as ApiEndpoint from '../constants/ApiEndpoint';
import {fromEndpointAndParams} from '../helpers/URL';
import {error, Result, result} from '../types/result';
import {
  badResponse,
  FetchArgs,
  FetchResponse,
  FetchSignature,
  NetworkContext,
} from './Network';

export interface User {
  userid: string;
}

export interface Credentials {
  email: string;
  password: string;
  name: string;
}

function recordFromCreds(creds: Credentials): Record<string, string> {
  let result: Record<string, string> = {};
  result.email = creds.email;
  result.password = creds.password;
  result.name = creds.name;
  return result;
}

interface AuthenticationState {
  user: User | null;
  token: string;
}

type AuthUpdate = (newState: AuthenticationState) => void;

export interface AuthenticationContext extends AuthenticationState {
  signUp: (args: Credentials) => Promise<Result<User>>;
  signIn: (args: Credentials) => Promise<Result<User>>;
  signOut: () => Promise<boolean>;
  fetch: FetchSignature;
}

export const AuthenticationContext = React.createContext({
  user: null,
  token: '',
  signUp: async (_args: Credentials) => error('unimplemented'),
  signIn: async (_args: Credentials) => error('unimplemented'),
  signOut: async () => false,
  fetch: async (_args: FetchArgs) => badResponse(),
} as AuthenticationContext);

async function signUp(
  instance: AuthenticationState,
  network: NetworkContext,
  update: AuthUpdate,
  creds: Credentials,
): Promise<Result<User>> {
  if (instance.token !== '') {
    throw Error('cannot signup when signed in');
  }

  try {
    const netResult: FetchResponse = await netFetch(instance, network, update, {
      resource: ApiEndpoint.register,
      options: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: creds.email,
          password: creds.password,
          name: creds.name,
        }),
        cache: 'no-cache',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
      },
    });

    if (!netResult.isOk) {
      if (netResult.status === 409) {
        return error('An account with this email already exists');
      }
      if (netResult.data?.error) {
        return error(netResult.data.error);
      }
      return error('Registration failed. Please try again.');
    }

    const payload = netResult.data;
    instance.token = payload?.jwt || '';
    instance.user = payload?.record || {};
    update(instance);

    return result(instance.user as User);
  } catch (err) {
    console.error('Signup error:', err);
    return error(`Signup error: ${err.message}`);
  }
}

async function signIn(
  instance: AuthenticationState,
  network: NetworkContext,
  update: AuthUpdate,
  creds: Credentials,
): Promise<Result<User>> {
  if (instance.token !== '') {
    throw Error('cannot signin when signed in. Log out first!');
  }

  const auth = Buffer.from(creds.email + ':' + creds.password).toString(
    'base64',
  );

  try {
    const netResult: FetchResponse = await netFetch(instance, network, update, {
      resource: ApiEndpoint.login,
      options: {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          Authorization: 'Basic ' + auth,
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
      },
    });

    console.log('Sign-in response:', netResult); // Log the entire response

    if (!netResult.isOk) {
      console.error('Bad signin response:', netResult.status, netResult.data);
      return error(`Bad signin response: ${netResult.status}`);
    }

    const payload = netResult.data;
    if (!payload || typeof payload !== 'object') {
      console.error('Invalid payload:', payload);
      return error('Invalid response payload');
    }

    instance.token = payload.token || '';
    instance.user = {
      userid: payload.userid || '',
    };
    update(instance);

    return result({
      userid: instance.user.userid,
    } as User);
  } catch (err) {
    console.error('Sign-in error:', err);
    return error(`Sign-in error: ${err.message}`);
  }
}

async function signOut(
  instance: AuthenticationState,
  network: NetworkContext,
  update: AuthUpdate,
): Promise<boolean> {
  if (instance.token === '') {
    throw Error('already signed out');
  }

  instance.token = '';
  instance.user = null;
  update(instance);
  return true;
}

async function netFetch(
  instance: AuthenticationState,
  network: NetworkContext,
  update: AuthUpdate,
  args: FetchArgs,
): Promise<FetchResponse> {
  if (instance.token === '') {
    return await network.fetch(args);
  }

  const defaultedOptions = args?.options || ({} as RequestInit);
  defaultedOptions.headers = defaultedOptions.headers || ({} as HeadersInit);
  (
    defaultedOptions.headers as Record<string, string>
  ).Authorization = `Bearer ${instance.token}`;
  return await network.fetch({
    resource: args.resource,
    options: defaultedOptions,
  });
}

export interface AuthenticationProviderProps {
  children: JSX.Element;
}

export default function AuthenticationProvider(
  props: AuthenticationProviderProps,
) {
  const children = props?.children;
  const network = React.useContext(NetworkContext);
  const [instance, update] = React.useState({
    user: null,
    token: '',
  } as AuthenticationState);

  return (
    <AuthenticationContext.Provider
      value={{
        user: instance.user,
        token: instance.token,
        signUp: signUp.bind(null, instance, network, update),
        signIn: signIn.bind(null, instance, network, update),
        signOut: signOut.bind(null, instance, network, update),
        fetch: netFetch.bind(null, instance, network, update),
      }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
