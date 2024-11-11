/**
 * Link for opening phone browser outside of application
 */

import React from 'react';
import {Linking, Alert} from 'react-native';
import NWTouchableHighlight from '../primitives/NWTouchableHighlight';

interface LinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onCallback?: (data: any) => void;
}

export default function Link({
  to,
  children,
  className,
  onCallback,
}: LinkProps): JSX.Element {
  React.useEffect(() => {
    if (!onCallback) return;

    const handleInitialURL = async () => {
      try {
        const url = await Linking.getInitialURL();
        console.log('Initial URL:', url);
        if (url && url.startsWith('cocoapp://oauth/callback')) {
          handleUrl({url});
        }
      } catch (err) {
        console.error('Error getting initial URL:', err);
      }
    };

    const handleUrl = ({url}: {url: string}) => {
      console.log('Deep link received:', url);
      if (url.startsWith('cocoapp://oauth/callback')) {
        try {
          const urlObj = new URL(url);
          const data = urlObj.searchParams.get('data');
          if (data) {
            const parsedData = JSON.parse(decodeURIComponent(data));
            console.log('Parsed callback data:', parsedData);
            onCallback(parsedData);
          }
        } catch (err) {
          console.error('Failed to parse callback URL:', err);
        }
      }
    };

    handleInitialURL();
    const subscription = Linking.addEventListener('url', handleUrl);
    return () => subscription.remove();
  }, [onCallback]);

  const handlePress = async () => {
    try {
      const urlWithPlatform = `${to}${
        to.includes('?') ? '&' : '?'
      }platform=mobile`;
      const supported = await Linking.canOpenURL(urlWithPlatform);

      if (supported) {
        await Linking.openURL(urlWithPlatform);
      } else {
        Alert.alert('Error', `Cannot open URL: ${urlWithPlatform}`);
      }
    } catch (err) {
      console.error('Error opening URL:', err);
      Alert.alert('Error', 'Failed to open authentication page');
    }
  };

  return (
    <NWTouchableHighlight className={className} onPress={handlePress}>
      {children}
    </NWTouchableHighlight>
  );
}
