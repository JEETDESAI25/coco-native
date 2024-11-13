import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Text} from 'react-native';
import Link from '../src/components/Link';
import {Alert, Linking} from 'react-native';

describe('Link Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders children correctly', () => {
    const {getByText} = render(
      <Link to="https://example.com">
        <Text>Click me</Text>
      </Link>,
    );
    expect(getByText('Click me')).toBeTruthy();
  });

  test('opens URL if supported', async () => {
    const {getByTestId} = render(
      <Link to="https://example.com">
        <Text>Click me</Text>
      </Link>,
    );

    fireEvent.press(getByTestId('link-touchable'));

    await waitFor(() => {
      expect(Linking.canOpenURL).toHaveBeenCalledWith('https://example.com');
      expect(Linking.openURL).toHaveBeenCalledWith('https://example.com');
    });
  });
});
