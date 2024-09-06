/**
 * Logo For Splash and Login
 */

import NWSafeAreaView from '../primitives/NWSafeAreaView';
// import {SafeAreaView} from 'react-native-safe-area-context';
import NWModal from '../primitives/NWModal';
import React from 'react';
import {Alert, Keyboard} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import NWView from '../primitives/NWView';
import NWText from '../primitives/NWText';
import NWTouchableHighlight from '../primitives/NWTouchableHighlight';
import NWScrollView from '../primitives/NWScrollView';

export interface ScreenNavigator {
  navigate: (screenName: string) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const NavigatorContext = React.createContext<ScreenNavigator | null>(
  null,
);

export interface ScreenProps {}

export interface Screen {
  component: (props: ScreenProps) => JSX.Element;
  hideDrawer?: boolean;
  hideTabs?: boolean;
}

export interface DrawerContent {
  icon: JSX.Element;
}

interface NavigationDrawerProps {
  drawerContent: Record<string, DrawerContent>;
  updateScreen: (screenName: string) => void;
  closeDrawer: () => void;
  isOut: boolean;
}

function NavigationDrawer(props: NavigationDrawerProps): JSX.Element {
  const {drawerContent, updateScreen, closeDrawer, isOut} = props;
  const [_keyboardIsVisible, updateKeyboardIsVisible] = React.useState(false);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => updateKeyboardIsVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => updateKeyboardIsVisible(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <NWModal
      isVisible={isOut}
      onBackdropPress={closeDrawer}
      onSwipeComplete={closeDrawer}
      swipeDirection={['left']}
      useNativeDriverForBackdrop
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      animationInTiming={250}
      animationOutTiming={250}
      style={{margin: 0, justifyContent: 'flex-start'}}
      propagateSwipe
      avoidKeyboard={true}
      coverScreen={true}
      hasBackdrop={true}
      backdropColor="rgba(0,0,0,0.5)"
      backdropOpacity={1}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={300}
      supportedOrientations={['portrait', 'landscape']}>
      <NWSafeAreaView
        style={{
          backgroundColor: '#A62A72FF',
          width: '80%',
          height: '100%',
        }}>
        <NWView className="flex-1 p-4">
          <NWTouchableHighlight
            className="border-2 border-[#FFFFFF] rounded-md p-1 w-[36] mb-4"
            onPress={() => {
              console.log('Close button pressed');
              closeDrawer();
            }}>
            <MaterialIcon name="close" size={24} color="white" />
          </NWTouchableHighlight>
          <NWScrollView className="flex-1">
            {Object.keys(drawerContent).map((key, index) => (
              <NWTouchableHighlight
                className="bg-[#C678A6] rounded-lg p-3 w-full my-2"
                key={index}
                onPress={() => {
                  updateScreen(key);
                  closeDrawer();
                }}>
                <NWView className="flex-row items-center">
                  {React.cloneElement(drawerContent[key].icon, {
                    color: 'white',
                  })}
                  <NWText className="ml-2 text-white text-lg">{key}</NWText>
                </NWView>
              </NWTouchableHighlight>
            ))}
          </NWScrollView>
        </NWView>
      </NWSafeAreaView>
    </NWModal>
  );
}

export interface TabContent {
  icon: JSX.Element;
}

interface NavigationTabProps {
  tabContent: Record<string, TabContent>;
  updateScreen: (screenName: string) => void;
}

function NavigationTab(props: NavigationTabProps): JSX.Element {
  const {tabContent, updateScreen} = props;
  const [keyboardIsVisible, updateKeyboardIsVisible] = React.useState(false);

  React.useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => updateKeyboardIsVisible(true),
    );
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => updateKeyboardIsVisible(false),
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);
  if (keyboardIsVisible) {
    return <></>;
  }

  return (
    <NWView
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#A62A72FF',
      }}
      className="py-2 pb-4">
      <NWView className="flex-row justify-evenly">
        {Object.keys(tabContent).map((key, index) => (
          <NWTouchableHighlight key={index} onPress={() => updateScreen(key)}>
            <NWView className="flex-col items-center min-w-[20%]">
              {tabContent[key].icon}
              <NWText className="text-sm text-white">{key}</NWText>
            </NWView>
          </NWTouchableHighlight>
        ))}
      </NWView>
    </NWView>
  );
}

export interface NavigationProps {
  initialScreen: string;
  drawerContent: Record<string, DrawerContent>;
  tabContent: Record<string, TabContent>;
  screens: Record<string, Screen>;
}

export default function Navigation(props: NavigationProps): JSX.Element {
  const {initialScreen, drawerContent, tabContent, screens} = props;

  const [currentScreen, updateCurrentScreen] = React.useState(initialScreen);
  const [isDrawerShown, updateIsDrawerShown] = React.useState(false);

  const openDrawer = React.useCallback(() => updateIsDrawerShown(true), []);
  const closeDrawer = React.useCallback(() => updateIsDrawerShown(false), []);

  const updateScreenAndCloseDrawer = React.useCallback(
    (screenName: string) => {
      closeDrawer();
      updateCurrentScreen(screenName);
    },
    [closeDrawer],
  );

  const screen: Screen = screens[currentScreen];

  if (screen === undefined) {
    Alert.alert(
      `Screen ${currentScreen} Does Not Exist! Updating to ${initialScreen}!`,
    );
    updateCurrentScreen(initialScreen);
  }

  return (
    <NavigatorContext.Provider
      value={{
        navigate: updateCurrentScreen,
        openDrawer: openDrawer,
        closeDrawer: closeDrawer,
      }}>
      <NWSafeAreaView style={{flex: 1}}>
        {!screen.hideDrawer && (
          <NavigationDrawer
            drawerContent={drawerContent}
            updateScreen={updateScreenAndCloseDrawer}
            closeDrawer={closeDrawer}
            isOut={isDrawerShown}
          />
        )}
        <NWView style={{flex: 1, paddingBottom: 60}}>
          <screen.component />
        </NWView>
        {!screen.hideTabs && (
          <NavigationTab
            tabContent={tabContent}
            updateScreen={updateCurrentScreen}
          />
        )}
      </NWSafeAreaView>
    </NavigatorContext.Provider>
  );
}
