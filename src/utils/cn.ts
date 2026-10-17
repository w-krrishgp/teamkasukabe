/**
 * Flexible class names helper
 * Handles strings, booleans, undefined, null, numbers, arrays, and object records.
 */
export type ClassValue = unknown;

export function cn(...inputs: unknown[]): string {
  const classes: string[] = [];

  const process = (val: unknown) => {
    if (!val) return;

    if (typeof val === 'string' || typeof val === 'number') {
      classes.push(String(val));
    } else if (Array.isArray(val)) {
      val.forEach(process);
    } else if (typeof val === 'object') {
      for (const [key, enabled] of Object.entries(val as Record<string, unknown>)) {
        if (enabled) {
          classes.push(key);
        }
      }
    }
  };

  inputs.forEach(process);

  return classes.join(' ').trim();
}
