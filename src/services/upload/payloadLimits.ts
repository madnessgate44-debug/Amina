/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Request size limits for the hosted deployment.
 *
 * Vercel rejects request bodies over about 4.5 MB before they ever reach
 * `server.ts`, so anything the learner sends — a photo of homework, a page scan,
 * a voice recording — must be shrunk on the device first. Without this, a normal
 * phone photo (3-8 MB) fails with an opaque platform error instead of a helpful
 * message.
 *
 * The sizing rules are plain functions so they can be tested without a browser;
 * only the canvas helper touches the DOM.
 */

/** Hard platform ceiling. Vercel rejects bodies above ~4.5 MB. */
export const PLATFORM_LIMIT_BYTES = 4.5 * 1024 * 1024;

/** Our own ceiling, comfortably below the platform's so headers still fit. */
export const MAX_REQUEST_BYTES = 4 * 1024 * 1024;

/** Longest edge, in pixels, that an uploaded image is reduced to. */
export const MAX_IMAGE_DIMENSION = 1600;

/** JPEG quality used when re-encoding an uploaded image. */
export const IMAGE_JPEG_QUALITY = 0.8;

/** Longest voice recording kept, in milliseconds. */
export const MAX_AUDIO_MS = 30_000;

/** Byte length of the data a base64 string carries, ignoring any data-URL prefix. */
export function base64ByteLength(input: string): number {
  if (!input) return 0;
  const comma = input.indexOf(',');
  const b64 = comma >= 0 && input.slice(0, comma).includes('base64') ? input.slice(comma + 1) : input;
  const clean = b64.replace(/[^A-Za-z0-9+/=]/g, '');
  if (clean.length === 0) return 0;
  const padding = clean.endsWith('==') ? 2 : clean.endsWith('=') ? 1 : 0;
  return Math.floor((clean.length * 3) / 4) - padding;
}

/**
 * Scales a width/height down so its longest edge is at most `maxDimension`.
 * Never enlarges: a small image keeps its size. Aspect ratio is preserved.
 */
export function fitWithinBox(
  width: number,
  height: number,
  maxDimension: number = MAX_IMAGE_DIMENSION
): { width: number; height: number } {
  if (!(width > 0) || !(height > 0)) return { width: 0, height: 0 };
  const longest = Math.max(width, height);
  if (longest <= maxDimension) return { width: Math.round(width), height: Math.round(height) };
  const scale = maxDimension / longest;
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

/** Serialized size of a request body, in bytes (UTF-8). */
export function requestBodyBytes(body: unknown): number {
  try {
    return new TextEncoder().encode(JSON.stringify(body)).length;
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}

/** True when the body would exceed our safe request ceiling. */
export function isBodyTooLarge(body: unknown, limit: number = MAX_REQUEST_BYTES): boolean {
  return requestBodyBytes(body) > limit;
}

/** True when the server or platform rejected the body for its size. */
export function isPayloadTooLargeStatus(status: number): boolean {
  return status === 413;
}

/**
 * Message shown when an upload is too big. Deliberately friendly and in the
 * learner's own language: a child should never see a raw error.
 */
export function payloadTooLargeMessage(language: string): string {
  if (language === 'fr') {
    return "La photo ou l'enregistrement est trop volumineux. Essaie une photo plus légère ou un enregistrement plus court.";
  }
  if (language === 'en') {
    return 'That photo or recording is a bit too big. Try a smaller photo or a shorter recording.';
  }
  return 'الصورة أو التسجيل حجمه كبير شوية. جرّبي صورة أصغر أو تسجيل أقصر، وأنا معاكي!';
}

/**
 * Re-encodes an image data URL down to `MAX_IMAGE_DIMENSION` and JPEG quality.
 * Returns the original string if the DOM is unavailable or decoding fails, so a
 * caller never loses the upload because of this step.
 */
export async function shrinkImageDataUrl(
  dataUrl: string,
  maxDimension: number = MAX_IMAGE_DIMENSION,
  quality: number = IMAGE_JPEG_QUALITY
): Promise<string> {
  if (typeof document === 'undefined' || typeof Image === 'undefined') return dataUrl;

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = dataUrl;
    });

    const { width, height } = fitWithinBox(
      img.naturalWidth || img.width,
      img.naturalHeight || img.height,
      maxDimension
    );
    if (width === 0 || height === 0) return dataUrl;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, width, height);

    const shrunk = canvas.toDataURL('image/jpeg', quality);
    // Only keep the result if it actually helped.
    return base64ByteLength(shrunk) < base64ByteLength(dataUrl) ? shrunk : dataUrl;
  } catch {
    return dataUrl;
  }
}
