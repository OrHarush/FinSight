export const resolveErrorKey = (message: string): string => {
  if (message.includes('Unsupported file type')) {
    return 'importWizard.upload.error.unsupported';
  }

  if (message.includes('mixes formats')) {
    return 'importWizard.upload.error.mixedFormats';
  }

  if (message.includes('Could not detect') || message.includes('Supported formats')) {
    return 'importWizard.upload.error.unsupportedFormat';
  }

  if (message.includes('No valid rows') || message.includes('empty')) {
    return 'importWizard.upload.error.noData';
  }

  if (message.includes('parse') || message.includes('column')) {
    return 'importWizard.upload.error.parse';
  }

  return 'importWizard.upload.error.generic';
};
