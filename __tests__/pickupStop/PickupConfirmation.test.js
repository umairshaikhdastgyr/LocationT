import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ReactWarning } from '../../src/components/molecules/modals/ReactWarning';

// Mocking dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('ReactWarning', () => {
  it('renders correctly and shows when isVisible is true', () => {
    const isVisible = true;
    const title = 'Test Title';
    const description = 'Test Description';
    const confirmButtonOnPress = jest.fn();
    const cancelButtonOnPress = jest.fn();
    const confirmButtonLabel = 'Confirm';
    
    const { getByText } = render(
      <ReactWarning
        isVisible={isVisible}
        title={title}
        description={description}
        confirmButtonOnPress={confirmButtonOnPress}
        cancelButtonOnPress={cancelButtonOnPress}
        confirmButton={confirmButtonLabel}
      />
    );

    expect(getByText(title)).toBeTruthy();
    expect(getByText(description)).toBeTruthy();
    expect(getByText(confirmButtonLabel)).toBeTruthy();
  });

  it('hides when isVisible is false', () => {
    const isVisible = false;
    const title = 'Test Title';
    const description = 'Test Description';
    const confirmButtonOnPress = jest.fn();
    const cancelButtonOnPress = jest.fn();
    const confirmButtonLabel = 'Confirm';

    const { queryByText } = render(
      <ReactWarning
        isVisible={isVisible}
        title={title}
        description={description}
        confirmButtonOnPress={confirmButtonOnPress}
        cancelButtonOnPress={cancelButtonOnPress}
        confirmButton={confirmButtonLabel}
      />
    );

    expect(queryByText(title)).toBeNull();
    expect(queryByText(description)).toBeNull();
    expect(queryByText(confirmButtonLabel)).toBeNull();
  });

  it('calls confirmButtonOnPress when Confirm button is pressed', () => {
    const isVisible = true;
    const confirmButtonOnPress = jest.fn();

    const { getByText } = render(
      <ReactWarning
        isVisible={isVisible}
        title="Test Title"
        description="Test Description"
        confirmButtonOnPress={confirmButtonOnPress}
        cancelButtonOnPress={jest.fn()}
        confirmButton="Confirm"
      />
    );

    fireEvent.press(getByText('Confirm'));
    expect(confirmButtonOnPress).toHaveBeenCalled();
  });
});