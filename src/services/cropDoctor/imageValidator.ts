import { ImageValidationResult } from './types';

export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MIN_FILE_SIZE_BYTES = 2 * 1024; // 2 KB minimum to catch empty/broken files

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Validates a leaf photo File before passing it to the diagnosis pipeline.
 */
export function validateImageFile(file: File): ImageValidationResult {
  if (!file) {
    return {
      isValid: false,
      errorCode: 'EMPTY_FILE',
      errorMessage: 'No image file was provided for scanning.',
      errorMessageHi: 'जांच के लिए कोई फोटो फाइल प्रदान नहीं की गई।',
    };
  }

  const fileDetails = {
    name: file.name || 'captured_leaf.jpg',
    sizeBytes: file.size,
    sizeFormatted: formatBytes(file.size),
    mimeType: file.type || 'unknown',
  };

  // 1. Check file size minimum
  if (file.size < MIN_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      errorCode: 'FILE_TOO_SMALL',
      errorMessage: `The uploaded image is too small (${fileDetails.sizeFormatted}) or damaged. Please provide a clear leaf photo above 2 KB.`,
      errorMessageHi: `अपलोड की गई फोटो बहुत छोटी (${fileDetails.sizeFormatted}) या खराब है। कृपया 2 KB से अधिक स्पष्ट पत्ती की फोटो लें।`,
      fileDetails,
    };
  }

  // 2. Check file size maximum
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      errorCode: 'FILE_TOO_LARGE',
      errorMessage: `Image size (${fileDetails.sizeFormatted}) exceeds the 10 MB maximum limit. Please compress or take a new photo.`,
      errorMessageHi: `फोटो का आकार (${fileDetails.sizeFormatted}) 10 MB की सीमा से अधिक है। कृपया फोटो का आकार छोटा करें या नई फोटो लें।`,
      fileDetails,
    };
  }

  // 3. Check MIME type
  const normalizedMime = file.type.toLowerCase();
  const isAllowedMime = ALLOWED_MIME_TYPES.includes(normalizedMime);

  // If MIME is missing or generic octet-stream, check extension fallback
  if (!isAllowedMime) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const isAllowedExt = extension && ['jpg', 'jpeg', 'png', 'webp'].includes(extension);

    if (!isAllowedExt) {
      return {
        isValid: false,
        errorCode: 'INVALID_FORMAT',
        errorMessage: `Unsupported file format (${file.type || 'unknown'}). Please upload JPEG, PNG, or WebP images only.`,
        errorMessageHi: `अमान्य फाइल प्रारूप (${file.type || 'अज्ञात'})। कृपया केवल JPEG, PNG या WebP फोटो अपलोड करें।`,
        fileDetails,
      };
    }
  }

  return {
    isValid: true,
    fileDetails,
  };
}

/**
 * Validates a base64 or Data URL image string
 */
export function validateImageDataUrl(dataUrl: string): ImageValidationResult {
  if (!dataUrl || typeof dataUrl !== 'string') {
    return {
      isValid: false,
      errorCode: 'EMPTY_FILE',
      errorMessage: 'Image data is empty.',
      errorMessageHi: 'फोटो डेटा खाली है।',
    };
  }

  if (dataUrl.startsWith('data:')) {
    const matches = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
    if (!matches) {
      return {
        isValid: false,
        errorCode: 'CORRUPTED_IMAGE',
        errorMessage: 'Image data URL format is corrupted or malformed.',
        errorMessageHi: 'फोटो डेटा दूषित या विकृत है।',
      };
    }

    const mimeType = matches[1].toLowerCase();
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return {
        isValid: false,
        errorCode: 'INVALID_FORMAT',
        errorMessage: `Unsupported MIME type: ${mimeType}. Please use JPEG, PNG, or WebP.`,
        errorMessageHi: `अमान्य प्रारूप: ${mimeType}। कृपया JPEG, PNG या WebP का उपयोग करें।`,
      };
    }

    // Estimate byte length from base64 string
    const base64Data = dataUrl.slice(matches[0].length);
    const estimatedBytes = Math.round((base64Data.length * 3) / 4);

    if (estimatedBytes < MIN_FILE_SIZE_BYTES) {
      return {
        isValid: false,
        errorCode: 'FILE_TOO_SMALL',
        errorMessage: 'The image payload is empty or too small to contain a readable leaf.',
        errorMessageHi: 'फोटो बहुत छोटी या अपठनीय है।',
      };
    }

    if (estimatedBytes > MAX_FILE_SIZE_BYTES) {
      return {
        isValid: false,
        errorCode: 'FILE_TOO_LARGE',
        errorMessage: `The image payload (${formatBytes(estimatedBytes)}) exceeds the 10 MB limit.`,
        errorMessageHi: `फोटो पेलोड 10 MB की सीमा से अधिक है।`,
      };
    }

    return {
      isValid: true,
      fileDetails: {
        name: 'captured_photo.jpg',
        sizeBytes: estimatedBytes,
        sizeFormatted: formatBytes(estimatedBytes),
        mimeType,
      },
    };
  }

  // HTTP or Blob URLs (e.g., Capacitor webPath)
  if (dataUrl.startsWith('http') || dataUrl.startsWith('blob:')) {
    return {
      isValid: true,
      fileDetails: {
        name: 'device_capture.jpg',
        sizeBytes: 150000,
        sizeFormatted: '~150 KB',
        mimeType: 'image/jpeg',
      },
    };
  }

  return {
    isValid: false,
    errorCode: 'INVALID_FORMAT',
    errorMessage: 'Unrecognized image source format.',
    errorMessageHi: 'अज्ञात फोटो प्रारूप।',
  };
}
