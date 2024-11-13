import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {TouchableHighlight} from 'react-native';
import Terms from '../src/components/Terms';
import Config from '../src/components/Config';
import {Linking} from 'react-native';

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  openURL: jest.fn(),
}));

describe('Terms Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    const {getByText} = render(<Terms />);
    expect(getByText('Term of Service')).toBeTruthy();
  });

  test('opens correct URL when pressed', async () => {
    const {getByText} = render(<Terms />);
    fireEvent.press(getByText('Term of Service'));

    expect(Linking.canOpenURL).toHaveBeenCalledWith(Config.termsOfService);
  });
});
