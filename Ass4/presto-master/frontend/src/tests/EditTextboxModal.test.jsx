import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditTextboxModal from '../components/EditTextboxModal';

describe('EditTextboxModal Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();
  const initialProps = {
    isOpen: true,
    textboxProps: {
      content: 'Initial content',
      fontSize: '12',
      fontFamily: 'Arial',
      color: '#000000'
    },
    onSubmit: mockOnSubmit,
    onClose: mockOnClose
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render when isOpen is false', () => {
    render(<EditTextboxModal {...initialProps} isOpen={false} />);
    expect(screen.queryByText('Edit Textbox')).not.toBeInTheDocument();
  });

  test('renders correctly when isOpen is true', () => {
    render(<EditTextboxModal {...initialProps} />);
    expect(screen.getByText('Edit Textbox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Text Content').value).toBe('Initial content');
    expect(screen.getByPlaceholderText('Font Size (em)').value).toBe('12');
    expect(screen.getByDisplayValue('Arial')).toBeVisible();
    expect(screen.getByPlaceholderText('Color (HEX)').value).toBe('#000000');
  });

  test('shows error modal when content is empty and save is attempted', async () => {
    render(<EditTextboxModal {...initialProps} />);
    await userEvent.clear(screen.getByPlaceholderText('Text Content'));
    await userEvent.click(screen.getByText('Save Changes'));
    expect(screen.getByText('Content cannot be empty.')).toBeInTheDocument();
  });

  test('calls onSubmit and onClose when valid data is submitted', async () => {
    render(<EditTextboxModal {...initialProps} />);
    await userEvent.type(screen.getByPlaceholderText('Text Content'), 'Updated content');
    await userEvent.click(screen.getByText('Save Changes'));
    expect(mockOnSubmit).toHaveBeenCalledWith({
      content: 'Initial contentUpdated content',
      fontSize: '12',
      fontFamily: 'Arial',
      color: '#000000'
    });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
