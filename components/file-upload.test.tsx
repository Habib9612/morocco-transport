import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { FileUpload } from './file-upload';
import { I18nProvider } from '@/lib/i18n-context';

function renderWithI18n(component: React.ReactNode) {
  return render(<I18nProvider>{component}</I18nProvider>);
}

describe('FileUpload', () => {
  it('renders upload area with correct text', () => {
    renderWithI18n(<FileUpload onUpload={jest.fn()} />);
    expect(screen.getByText('file.clickToUpload')).toBeInTheDocument();
    expect(screen.getByText('file.orDragDrop')).toBeInTheDocument();
  });

  it('handles file selection via click', () => {
    const onUpload = jest.fn();
    renderWithI18n(<FileUpload onUpload={onUpload} />);
    
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('file.upload');
    
    fireEvent.change(input, { target: { files: [file] } });
    expect(onUpload).toHaveBeenCalledWith(file);
  });

  it('validates file size', () => {
    const onUpload = jest.fn();
    renderWithI18n(<FileUpload onUpload={onUpload} maxSize={1024} />);
    
    const file = new File(['x'.repeat(2048)], 'large.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('file.upload');
    
    fireEvent.change(input, { target: { files: [file] } });
    expect(onUpload).not.toHaveBeenCalled();
    expect(screen.getByText('file.tooLarge')).toBeInTheDocument();
  });

  it('validates file type', () => {
    const onUpload = jest.fn();
    renderWithI18n(<FileUpload onUpload={onUpload} accept=".pdf" />);
    
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('file.upload');
    
    fireEvent.change(input, { target: { files: [file] } });
    expect(onUpload).not.toHaveBeenCalled();
    expect(screen.getByText('file.invalidType')).toBeInTheDocument();
  });

  it('shows drag state when dragging over', () => {
    renderWithI18n(<FileUpload onUpload={jest.fn()} />);
    const dropZone = screen.getByTestId('upload-area');
    
    fireEvent.dragEnter(dropZone);
    expect(dropZone).toHaveClass('border-blue-500');
    
    fireEvent.dragLeave(dropZone);
    expect(dropZone).not.toHaveClass('border-blue-500');
  });

  it('handles file drop', () => {
    const onUpload = jest.fn();
    renderWithI18n(<FileUpload onUpload={onUpload} />);
    
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const dropZone = screen.getByTestId('upload-area');
    
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file]
      }
    });
    expect(onUpload).toHaveBeenCalledWith(file);
  });

  it('has no accessibility violations', async () => {
    const { container } = renderWithI18n(<FileUpload onUpload={jest.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
}); 