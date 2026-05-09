/**
 * Resizes and compresses an image base64 string to stay within payload limits.
 * Default target size is ~1MB to safely stay under Vercel's 4.5MB wall.
 */
export async function resizeImage(base64Str: string, maxWidth = 1200, maxHeight = 1200, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Export as compressed JPEG
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
    img.onerror = (err) => reject(err);
  });
}

/**
 * Strips the data:image/xxx;base64, prefix from a base64 string.
 */
export function stripBase64Prefix(base64Str: string): string {
  return base64Str.replace(/^data:image\/\w+;base64,/, '');
}
