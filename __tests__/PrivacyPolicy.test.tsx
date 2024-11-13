import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TouchableHighlight } from 'react-native';
import PrivacyPolicy from '../src/components/PrivacyPolicy';
import Config from '../src/components/Config';
import { Linking } from 'react-native';

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  openURL: jest.fn(),
}));

describe('PrivacyPolicy Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    const { getByText } = render(<PrivacyPolicy />);
    expect(getByText('Privacy Policy')).toBeTruthy();
  });

  test('opens correct URL when pressed', async () => {
    const { getByText } = render(<PrivacyPolicy />);
    fireEvent.press(getByText('Privacy Policy'));
    
    expect(Linking.canOpenURL).toHaveBeenCalledWith(Config.privacyPolicy);
  });
});