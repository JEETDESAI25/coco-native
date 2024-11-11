/*
 * Author: Tristan Hilbert
 * Date: 8/28/2023
 * Filename: ThirdPartyLogins.tsx
 * Desc: Login Buttons for Third Party Applications
 */

import React from 'react';
import {Alert} from 'react-native';
import {getEnumValues} from '../helpers/Enum';
import NWView from '../primitives/NWView';
import Link from './Link';
import {AuthenticationContext} from '../contexts/Authentication';
import {isError} from '../types/result';
import * as ApiEndpoint from '../constants/ApiEndpoint';
import {NavigatorContext} from '../contexts/Navigation';
import NavigatorTerms from '../constants/NavigatorTerms';
import NWText from '../primitives/NWText';
import Svg, {Path} from 'react-native-svg';

enum ThirdParty {
  Google = 1,
  Meta = 2,
  Microsoft = 3,
  Apple = 4,
}

// const ThirdPartyIcons: Record<number, JSX.Element> = {
//   [ThirdParty.Google]: (
//     <FontAwesomeIcon size={20} name="google" color="#4285F4" />
//   ),
//   [ThirdParty.Meta]: <FontAwesomeIcon size={24} name="facebook" />,
//   [ThirdParty.Microsoft]: <FontAwesomeIcon size={24} name="microsoft" />,
//   [ThirdParty.Apple]: <FontAwesomeIcon size={24} name="apple" />,
// };

interface IconButtonProps {
  party: ThirdParty;
}

function IconButton({party}: IconButtonProps): JSX.Element {
  const authentication = React.useContext(AuthenticationContext);
  const navigator = React.useContext(NavigatorContext);

  const handleCallback = async (data: any) => {
    try {
      const result = await authentication.handleGoogleCallback(data);
      if (!isError(result)) {
        navigator?.navigate(NavigatorTerms.HOME);
      } else {
        Alert.alert('Authentication Error', result.error);
      }
    } catch (err) {
      console.error('Auth error:', err);
      Alert.alert('Authentication Error', 'Failed to complete authentication');
    }
  };

  if (party === ThirdParty.Google) {
    return (
      <Link to={ApiEndpoint.googleLogin} onCallback={handleCallback}>
        <NWView
          style={{
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#747775',
            borderRadius: 4,
            padding: 6,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.2,
            shadowRadius: 1,
          }}>
          <NWView className="flex-row items-center justify-center">
            <NWView className="mr-3">
              <Svg width="18" height="18" viewBox="0 0 48 48">
                <Path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <Path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <Path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <Path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </Svg>
            </NWView>
            <NWText
              className="text-[#1f1f1f] font-medium"
              style={{
                fontSize: 14,
                letterSpacing: 0.25,
              }}>
              Continue with Google
            </NWText>
          </NWView>
        </NWView>
      </Link>
    );
  }

  return <NWView />; // Placeholder
}

export default function ThirdPartyLogins(): JSX.Element {
  return (
    <NWView className="w-[90%] py-2">
      {getEnumValues(ThirdParty).map(party => (
        <IconButton key={party} party={party} />
      ))}
    </NWView>
  );
}
