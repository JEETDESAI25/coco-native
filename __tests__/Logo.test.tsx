import React from 'react';
import {render} from '@testing-library/react-native';
import Logo from '../src/components/Logo';

describe('Logo Component', () => {
  test('renders correctly', () => {
    const {getByTestId} = render(<Logo />);
    const logoImage = getByTestId('logo-image');
    expect(logoImage).toBeTruthy();
  });
});
