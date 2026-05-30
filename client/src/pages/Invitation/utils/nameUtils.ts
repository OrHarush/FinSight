export const getFirstName = (fullName: string): string => {
  const trimmed = fullName.trim();
  const space = trimmed.indexOf(' ');

  return space === -1 ? trimmed : trimmed.slice(0, space);
};

export const getInitials = (fullName: string): string => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return '?';
  }

  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }

  const first = parts[0][0];
  const last = parts[parts.length - 1][0];

  return `${first}${last}`.toUpperCase();
};

export const getMonogram = (text: string): string => {
  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return '?';
  }

  return trimmed[0].toUpperCase();
};
