import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import TopBar from '../src/components/TopBar';
import Config from '../src/components/Config';

test('TopBar component renders correctly', () => {
  const mockOnButtonPress = jest.fn();
  const {getByText, getByRole} = render(
    <TopBar onButtonPress={mockOnButtonPress} />,
  );

  expect(getByText(Config.appTitle)).toBeTruthy();

  const button = getByRole('button');
  fireEvent.press(button);
  expect(mockOnButtonPress).toHaveBeenCalled();
});
