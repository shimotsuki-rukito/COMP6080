import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorModal from '../components/ErrorModal';

describe('ErrorModal Component', () => {
  test('does not render when isOpen is false', () => {
    render(<ErrorModal isOpen={false} onClose={() => {}} />);
    const modalContent = screen.queryByText('Error Message');
    expect(modalContent).not.toBeInTheDocument();
  });

  test('renders correctly when isOpen is true', () => {
    const onClose = jest.fn();
    render(
      <ErrorModal isOpen={true} onClose={onClose}>
        <div>Error Message</div>
      </ErrorModal>
    );
    expect(screen.getByText('Error Message')).toBeInTheDocument();
    const closeButton = screen.getByText('×');
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
