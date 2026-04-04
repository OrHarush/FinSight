export const resolveErrorKey = (message: string): string => {
  if (message.includes('Unsupported file type')) {
    return 'importWizard.upload.error.unsupported';
  }

  if (
    message.includes('No valid rows') ||
    message.includes('empty') ||
    message.includes('Could not detect')
  ) {
    return 'importWizard.upload.error.noData';
  }

  if (message.includes('parse') || message.includes('column')) {
    return 'importWizard.upload.error.parse';
  }

  return 'importWizard.upload.error.generic';
};
