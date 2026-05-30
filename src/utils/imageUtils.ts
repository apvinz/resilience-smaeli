/**
 * Converts a file object into a base64 encoded string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to Base64 string'));
      }
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * Checks if a string is a base64 image data URL
 */
export function isBase64Image(str: any): boolean {
  if (typeof str !== 'string') return false;
  return str.startsWith('data:image/');
}
