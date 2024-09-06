/**
 * Login For users to collect token and perform changes to their account
 */

import React from 'react';

import {Formik} from 'formik';

import Logo from '../components/Logo';
import ThirdPartyLogins from '../components/ThirdPartyLogins';
import NavigatorTerms from '../constants/NavigatorTerms';
import {AuthenticationContext, Credentials} from '../contexts/Authentication';
import {
  NavigatorContext,
  ScreenNavigator,
  ScreenProps,
} from '../contexts/Navigation';
import NWSafeAreaView from '../primitives/NWSafeAreaView';
import NWScrollView from '../primitives/NWScrollView';
import NWText from '../primitives/NWText';
import NWTextInput from '../primitives/NWTextInput';
import NWTouchableHighlight from '../primitives/NWTouchableHighlight';
import NWView from '../primitives/NWView';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

async function login(
  navigator: ScreenNavigator,

  authentication: AuthenticationContext,
  creds: Credentials,
): Promise<void> {
  navigator.navigate(NavigatorTerms.HOME);
}
//     try {
//         const result = await authentication.signIn(creds);
//         if (!isError(result)) {
//             navigator.navigate(NavigatorTerms.HOME);
//         }
//     } catch (err) {
//         console.warn(err);
//     }
// }

function LoginForm(): JSX.Element {
  const navigator = React.useContext(NavigatorContext);
  const authentication = React.useContext(AuthenticationContext);
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <NWView className="flex-0 flex-col items-center w-full px-8">
      <Formik
        initialValues={{email: '', password: ''} as Credentials}
        onSubmit={values => {
          if (navigator) {
            return login(navigator, authentication, values);
          }
        }}>
        {({handleChange, handleBlur, handleSubmit, values}) => (
          <NWView className="w-full">
            <NWView className="mb-4">
              <NWView className="flex-row items-center border-b-2 border-[#C678A6] pb-2">
                <MaterialIcon name="email" size={24} color="#C678A6" />
                <NWTextInput
                  className="flex-1 ml-2 text-base"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </NWView>
            </NWView>
            <NWView className="mb-6">
              <NWView className="flex-row items-center border-b-2 border-[#C678A6] pb-2">
                <MaterialIcon name="lock" size={24} color="#C678A6" />
                <NWTextInput
                  className="flex-1 ml-2 text-base"
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                />
                <NWTouchableHighlight
                  onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcon
                    name={showPassword ? 'visibility-off' : 'visibility'}
                    size={24}
                    color="#C678A6"
                  />
                </NWTouchableHighlight>
              </NWView>
            </NWView>
            <NWTouchableHighlight
              className="bg-[#A62A72] py-3 rounded-lg"
              onPress={handleSubmit as any}>
              <NWText className="text-white font-bold text-lg text-center">
                Login
              </NWText>
            </NWTouchableHighlight>
          </NWView>
        )}
      </Formik>
      <NWView className="mt-4 w-full">
        <NWTouchableHighlight
          className="bg-[#C678A6] py-3 rounded-lg"
          onPress={() => {
            navigator?.navigate(NavigatorTerms.SIGN_UP);
          }}>
          <NWText className="text-white font-bold text-lg text-center">
            Sign Up
          </NWText>
        </NWTouchableHighlight>
      </NWView>
      <NWView className="mt-6 items-center">
        <NWText className="text-[#A62A72] font-medium mb-2">
          Or login with
        </NWText>
        <ThirdPartyLogins onPress={() => {}} />
      </NWView>
    </NWView>
  );
}

export default function Login(props: ScreenProps): React.JSX.Element {
  return (
    <NWSafeAreaView>
      <NWScrollView>
        <NWView className=" py-16 ">
          <Logo />
        </NWView>
        <LoginForm {...props} />
      </NWScrollView>
    </NWSafeAreaView>
  );
}
