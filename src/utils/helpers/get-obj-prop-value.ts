export function getObjectPropertyValue(path: string, obj: Record<string, any>): any {
  const properties = path.split('.');
  return properties.reduce((previousValue, currentValue) => {
    if (previousValue && typeof previousValue === 'object') {
      return previousValue[currentValue];
    }
    return undefined;
  }, obj);
}
