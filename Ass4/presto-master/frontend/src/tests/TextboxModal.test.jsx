import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextboxModal from '../components/TextboxModal';

describe('TextboxModal Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render when isOpen is false', () => {
    render(<TextboxModal isOpen={false} onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    expect(screen.queryByText('Add Textbox')).not.toBeInTheDocument();
  });

  test('renders correctly when isOpen is true', () => {
    render(<TextboxModal isOpen={true} onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    expect(screen.getByText('Add Textbox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Width (%)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Height (%)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Text Content')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Font Size (em)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Color (HEX)')).toBeInTheDocument();
  });

  test('validates input and shows error modal on invalid submission', async () => {
    render(<TextboxModal isOpen={true} onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    await userEvent.click(screen.getByText('Add textbox'));
    expect(screen.getByText('Content cannot be empty.')).toBeInTheDocument();
  });

  test('calls onSubmit and onClose on valid submission', async () => {
    render(<TextboxModal isOpen={true} onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    await userEvent.type(screen.getByPlaceholderText('Width (%)'), '50');
    await userEvent.type(screen.getByPlaceholderText('Height (%)'), '50');
    await userEvent.type(screen.getByPlaceholderText('Text Content'), 'Hello World');
    await userEvent.type(screen.getByPlaceholderText('Font Size (em)'), '2');
    await userEvent.type(screen.getByPlaceholderText('Color (HEX)'), '#000000');
    await userEvent.click(screen.getByText('Add textbox'));
    expect(mockOnSubmit).toHaveBeenCalledWith({
      width: '50',
      height: '50',
      content: 'Hello World',
      fontSize: '2',
      color: '#000000'
    });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
