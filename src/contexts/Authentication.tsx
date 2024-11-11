/**
 * Hook for accessing and managing Auth
 */

import {Buffer} from 'buffer';
import React, {createContext} from 'react';
import * as ApiEndpoint from '../constants/ApiEndpoint';
// can be used for query params
// import {fromEndpointAndParams} from '../helpers/URL';
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

//Converts Credentials object to a generic key-value record. Can be used for:
//  Query params - with fromEndpointAndParams for GET requests:
//     const params = recordFromCreds(creds);
//     const url = fromEndpointAndParams(ApiEndpoint.someEndpoint, params);
// function recordFromCreds(creds: Credentials): Record<string, string> {
//   let record: Record<string, string> = {};
//   record.email = creds.email;
//   record.password = creds.password;
//   record.name = creds.name;
//   return record;
// }

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
  handleGoogleCallback: (data: any) => Promise<Result<User>>;
}

export const AuthenticationContext = createContext<AuthenticationContext>({
  user: null,
  token: '',
  signUp: async (_args: Credentials) => error('unimplemented'),
  signIn: async (_args: Credentials) => error('unimplemented'),
  signOut: async () => false,
  fetch: async (_args: FetchArgs) => badResponse(),
  handleGoogleCallback: async () => error('unimplemented'),
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
    if (err instanceof Error) {
      console.error('Signup error:', err);
      return error(`Signup error: ${err.message}`);
    }
    return error('An unknown error occurred during signup');
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

  if (!creds.email || !creds.password) {
    return error('Email and password are required');
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

    if (
      !netResult.isOk ||
      netResult.status === 401 ||
      netResult.data?.[0] === 'could not verify'
    ) {
      console.error('Bad signin response:', netResult.status, netResult.data);
      return error('Invalid email or password');
    }

    const payload = netResult.data;
    if (!payload || typeof payload !== 'object') {
      console.error('Invalid payload:', payload);
      return error('Invalid response payload');
    }

    if (!payload.token || !payload.userid) {
      return error('Invalid response: missing required fields');
    }

    instance.token = payload.token;
    instance.user = {
      userid: payload.userid,
    };
    update(instance);

    return result({
      userid: instance.user.userid,
    } as User);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Sign-in error:', err);
      return error(`Sign-in error: ${err.message}`);
    }
    return error('An unknown error occurred during signin');
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

  const handleGoogleCallback = async (data: any): Promise<Result<User>> => {
    try {
      if (!data?.jwt || !data?.record?.userid) {
        return error('Invalid authentication data received');
      }

      instance.token = data.jwt;
      instance.user = {
        userid: data.record.userid,
      };
      update({...instance});

      return result(instance.user);
    } catch (err) {
      console.error('Google callback error:', err);
      return error('Failed to process authentication response');
    }
  };

  return (
    <AuthenticationContext.Provider
      value={{
        user: instance.user,
        token: instance.token,
        signUp: signUp.bind(null, instance, network, update),
        signIn: signIn.bind(null, instance, network, update),
        signOut: signOut.bind(null, instance, network, update),
        fetch: netFetch.bind(null, instance, network, update),
        handleGoogleCallback,
      }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
