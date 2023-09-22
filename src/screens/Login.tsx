/**
 * Login For users to collect token and perform changes to their account
 */

import React from 'react';
import {
    Formik,
} from 'formik';

import {
    View,
    SafeAreaView,
    Button,
    TextInput,
    GestureResponderEvent,
} from 'react-native';

import Logo from '../components/Logo';
import Terms from '../components/Terms';
import PrivacyPolicy from '../components/PrivacyPolicy';
import ThirdPartyLogins from '../components/ThirdPartyLogins';

interface LoginRequest {
    username: string,
    password: string
}

function makeLoginRequest({ username, password }: LoginRequest): void {
    // TODO
}

function LoginForm(): JSX.Element {
    return (
        <Formik
            initialValues={{ username: '', password: '' } as LoginRequest}
            onSubmit={makeLoginRequest}
        >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
                <View>
                    <TextInput
                        onChangeText={handleChange('username')}
                        onBlur={handleBlur('username')}
                        value={values.username}
                    />
                    <TextInput
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.username}
                    />
                    <Button
                        onPress={
                            handleSubmit as (values:
                                GestureResponderEvent |
                                React.FormEvent<HTMLFormElement> |
                                undefined) => void
                        }
                        title="Login"
                    />
                    <ThirdPartyLogins onPress={() => { }} />
                    <Terms />
                    <PrivacyPolicy />
                </View>
            )}
        </Formik>
    );
}

export default function Login(): JSX.Element {
    return (
        <SafeAreaView>
            <Logo />
            <LoginForm />
        </SafeAreaView>
    )
}