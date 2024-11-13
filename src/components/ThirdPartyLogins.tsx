/*
 * Author: Tristan Hilbert
 * Date: 8/28/2023
 * Filename: ThirdPartyLogins.tsx
 * Desc: Login Buttons for Third Party Applications
 */

import React from 'react';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';

import {getEnumValues} from '../helpers/Enum';
import NWView from '../primitives/NWView';
import NWTouchableHighlight from '../primitives/NWTouchableHighlight';
import {NavigatorContext} from '../contexts/Navigation';
import NavigatorTerms from '../constants/NavigatorTerms';

enum ThirdParty {
  Google = 1,
  Meta = 2,
  Microsoft = 3,
  Apple = 4,
}

interface IconButtonProps {
  party: number;
}

const ThirdPartyIcons: Record<number, JSX.Element> = {
  [ThirdParty.Google]: <FontAwesomeIcon size={24} name="google" />,
  [ThirdParty.Meta]: <FontAwesomeIcon size={24} name="facebook" />,
  [ThirdParty.Microsoft]: <FontAwesomeIcon size={24} name="microsoft" />,
  [ThirdParty.Apple]: <FontAwesomeIcon size={24} name="apple" />,
};

function IconButton(props: IconButtonProps): JSX.Element {
  const navigator = React.useContext(NavigatorContext);

  const {party} = props;

  return (
    <NWTouchableHighlight
      testID="login-button"
      className="bg-[#A62A72FF] rounded-lg py-2 px-3"
      onPress={() => {
        navigator?.navigate(NavigatorTerms.DUO);
      }}>
      {ThirdPartyIcons[party as number]}
    </NWTouchableHighlight>
  );
}

export default function ThirdPartyLogins(): JSX.Element {
  return (
    <NWView className=" flex-0 flex-row items-center justify-between w-[60%] py-2 pr-1 ">
      {getEnumValues(ThirdParty).map((thirdParty, index) => (
        <IconButton key={index} party={thirdParty} />
      ))}
    </NWView>
  );
}
