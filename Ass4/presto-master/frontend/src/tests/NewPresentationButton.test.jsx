import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import NewPresentationButton from '../components/NewPresentationButton';

describe('NewPresentationButton', () => {
  it('renders correctly', () => {
    render(<NewPresentationButton />);
    const button = screen.getByRole('button', { name: /new presentation/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick prop when clicked', () => {
    const handleClick = jest.fn();
    render(<NewPresentationButton onClick={handleClick} />);
    const button = screen.getByRole('button', { name: /new presentation/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
