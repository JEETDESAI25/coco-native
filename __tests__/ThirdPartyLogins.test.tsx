// ThirdPartyLogins.test.tsx
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import ThirdPartyLogins from '../src/components/ThirdPartyLogins';
import {NavigatorContext} from '../src/contexts/Navigation';
import NavigatorTerms from '../src/constants/NavigatorTerms';

// Mock Navigator Context
const mockNavigate = jest.fn();

describe('ThirdPartyLogins Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderWithNavigator = (ui: JSX.Element) => {
    return render(
      <NavigatorContext.Provider
        value={{
          navigate: mockNavigate,
          openDrawer: jest.fn(),
          closeDrawer: jest.fn(),
        }}>
        {ui}
      </NavigatorContext.Provider>,
    );
  };

  it('renders all third-party login buttons', () => {
    const {getAllByTestId} = renderWithNavigator(<ThirdPartyLogins />);
    const buttons = getAllByTestId('login-button');
    expect(buttons).toHaveLength(4); // Google, Meta, Microsoft, Apple
  });

  it('navigates to DUO on icon press', () => {
    const {getAllByTestId} = renderWithNavigator(<ThirdPartyLogins />);
    const buttons = getAllByTestId('login-button');
    fireEvent.press(buttons[0]); // Press first button (Google)
    expect(mockNavigate).toHaveBeenCalledWith(NavigatorTerms.DUO);
  });
});
