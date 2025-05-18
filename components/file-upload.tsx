import { useState, useRef } from 'react';
import { useI18n } from '@/lib/i18n-context';

interface FileUploadProps {
  onUpload: (file: File) => void;
  maxSize?: number;
  accept?: string;
}

export function FileUpload({ onUpload, maxSize = 5 * 1024 * 1024, accept }: FileUploadProps) {
  const { t } = useI18n();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setError(null);

    if (file.size > maxSize) {
      setError(t('file.tooLarge'));
      return;
    }

    if (accept && !file.name.match(new RegExp(accept.replace('.', '\\.') + '$'))) {
      setError(t('file.invalidType'));
      return;
    }

    onUpload(file);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="w-full">
      <div
        data-testid="upload-area"
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-500 dark:border-blue-400'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        tabIndex={0}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept={accept}
          aria-label={t('file.upload')}
        />
        <p className="text-lg font-medium">{t('file.clickToUpload')}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('file.orDragDrop')}</p>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
} 