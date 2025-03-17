export const isDataEmpty = (value?: any): boolean => {
  if (!value || value === '' || value === 0) return true;
  if (Array.isArray(value)) {
    return value.length === 0;
  } else if (typeof value === 'object' && value !== null) {
    return Object.keys(value).length === 0;
  }
  return false;
};

export const isPrimitive = (value: any): boolean => {
  return (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean');
};

export const isSimpleKeyValue = (data: any): boolean => {
  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    return Object.values(data).every(isPrimitive);
  }
  return false;
};