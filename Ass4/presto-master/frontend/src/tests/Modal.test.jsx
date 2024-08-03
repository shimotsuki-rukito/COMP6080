import React from 'react';
import { render, screen } from '@testing-library/react';
import Modal from '../components/Modal';

const mockProps = {
  ismodalopen: false,
  closeModal: jest.fn(),
  PresentationName: '',
  setPresentationName: jest.fn(),
  createPresentation: jest.fn(),
  Description: '',
  setDescription: jest.fn(),
  Thumbnail: '',
  setThumbnail: jest.fn()
};

describe('Modal Component', () => {
  test('renders correctly when open', () => {
    const updatedProps = { ...mockProps, ismodalopen: true };
    render(<Modal {...updatedProps} />);
    expect(screen.getByText('Create New Presentation')).toBeInTheDocument();
    expect(screen.getByText('×')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Presentation Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
  });
});

