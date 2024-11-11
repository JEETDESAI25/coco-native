/**
 * SignUp For users to collect token and create an account
 */

import React, {useState} from 'react';
import {Alert} from 'react-native';
import {Formik} from 'formik';
import {isError, getData} from '../types/result';
import Logo from '../components/Logo';
import ThirdPartyLogins from '../components/ThirdPartyLogins';
import Terms from '../components/Terms';
import PrivacyPolicy from '../components/PrivacyPolicy';
import NavigatorTerms from '../constants/NavigatorTerms';
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
import {AuthenticationContext, Credentials} from '../contexts/Authentication';

async function signUpUser(
  authentication: AuthenticationContext,
  navigator: ScreenNavigator | null,
  values: Credentials,
  setError: (msg: string) => void,
  setSuccessMessage: (msg: string) => void,
) {
  try {
    const result = await authentication.signUp(values);
    if (!isError(result)) {
      const user = getData(result);
      console.log('Sign-up successful:', user);
      setSuccessMessage(
        'Registration successful! Please check your email for confirmation.',
      );
      navigator?.navigate(NavigatorTerms.HOME); // Navigate to Home after successful sign-up
    } else {
      console.error('Sign-up failed:', result.error);
      setError(result.error);
      Alert.alert('Sign-up Failed', result.error);
    }
  } catch (err) {
    console.error('Sign-up error:', err);
    setError('An unexpected error occurred. Please try again.');
    Alert.alert(
      'Sign-up Error',
      'An unexpected error occurred. Please try again.',
    );
  }
}

function SignUpForm(): JSX.Element {
  const navigator = React.useContext(NavigatorContext);
  const authentication = React.useContext(AuthenticationContext);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Function for validating form input
  const validateForm = (values: Credentials & {passwordConfirm: string}) => {
    if (!values.email.includes('@')) {
      return 'Invalid email format';
    }
    if (values.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (values.password !== values.passwordConfirm) {
      return 'Passwords do not match';
    }
    return null;
  };

  return (
    <NWView className="flex-0 flex-col items-center w-full px-8">
      {error && (
        <NWText className="text-red-600 font-bold text-lg text-center mb-4">
          {error}
        </NWText>
      )}
      {successMessage && (
        <NWText className="text-green-600 font-bold text-lg text-center mb-4">
          {successMessage}
        </NWText>
      )}
      <Formik
        initialValues={{
          email: '',
          name: '',
          password: '',
          passwordConfirm: '',
        }}
        onSubmit={(values, {resetForm}) => {
          setError(null);
          setSuccessMessage(null);

          const validationError = validateForm(values);
          if (validationError) {
            setError(validationError);
            return;
          }

          if (navigator && authentication) {
            signUpUser(
              authentication,
              navigator,
              values,
              setError,
              setSuccessMessage,
            );
            resetForm();
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
            <NWView className="mb-4">
              <NWView className="flex-row items-center border-b-2 border-[#C678A6] pb-2">
                <MaterialIcon name="person" size={24} color="#C678A6" />
                <NWTextInput
                  className="flex-1 ml-2 text-base"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  placeholder="Name"
                  placeholderTextColor="#999"
                />
              </NWView>
            </NWView>
            <NWView className="mb-4">
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
            <NWView className="mb-6">
              <NWView className="flex-row items-center border-b-2 border-[#C678A6] pb-2">
                <MaterialIcon name="lock" size={24} color="#C678A6" />
                <NWTextInput
                  className="flex-1 ml-2 text-base"
                  onChangeText={handleChange('passwordConfirm')}
                  onBlur={handleBlur('passwordConfirm')}
                  value={values.passwordConfirm}
                  placeholder="Confirm Password"
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
                Sign Up
              </NWText>
            </NWTouchableHighlight>
          </NWView>
        )}
      </Formik>
      <NWView className="mt-4 w-full">
        <NWTouchableHighlight
          className="bg-[#C678A6] py-3 rounded-lg"
          onPress={() => {
            navigator?.navigate(NavigatorTerms.LOGIN);
          }}>
          <NWText className="text-white font-bold text-lg text-center">
            Back To Login
          </NWText>
        </NWTouchableHighlight>
      </NWView>
      <NWView className="mt-6 items-center">
        <NWText className="text-[#A62A72] font-medium mb-2">OR</NWText>
        <ThirdPartyLogins />
        <Terms />
        <PrivacyPolicy />
      </NWView>
    </NWView>
  );
}

export default function SignUp(props: ScreenProps): JSX.Element {
  return (
    <NWSafeAreaView>
      <NWScrollView>
        <NWView className="py-16">
          <Logo />
        </NWView>
        <SignUpForm {...props} />
      </NWScrollView>
    </NWSafeAreaView>
  );
}
