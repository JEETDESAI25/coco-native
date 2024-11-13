// SincePicker.test.tsx
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import SincePicker, {
  SinceOption,
  getSinceMoment,
} from '../src/components/SincePicker';

describe('SincePicker Component', () => {
  it('renders with correct initial text', () => {
    const {getByText} = render(
      <SincePicker currentSinceOption={SinceOption.Today} />,
    );
    expect(getByText('Today')).toBeTruthy();
  });

  it('opens the modal when the button is pressed', () => {
    const {getByText, queryByText} = render(
      <SincePicker currentSinceOption={SinceOption.Today} />,
    );

    // Initially, the modal is not visible
    expect(queryByText('Last Week')).toBeNull();

    // Open the modal by pressing the button
    fireEvent.press(getByText('Today'));

    // Now the modal should be visible and show options like "Last Week"
    expect(getByText('Last Week')).toBeTruthy();
  });

  it('closes the modal and updates the option when an option is selected', () => {
    const mockUpdateSinceOption = jest.fn();
    const {getByText, queryByText} = render(
      <SincePicker
        currentSinceOption={SinceOption.Today}
        updateSinceOption={mockUpdateSinceOption}
      />,
    );

    // Open the modal by pressing the button
    fireEvent.press(getByText('Today'));

    // Select "Last Month" option
    fireEvent.press(getByText('Last Month'));

    // The modal should be closed, and the updateSinceOption function should have been called
    expect(queryByText('Last Month')).toBeNull();
    expect(mockUpdateSinceOption).toHaveBeenCalledWith(SinceOption.LastMonth);
  });

  it('calls getSinceMoment correctly', () => {
    expect(getSinceMoment(SinceOption.Today)).toEqual(expect.any(Date));
    expect(getSinceMoment(SinceOption.LastYear)).toEqual(expect.any(Date));
  });
});
