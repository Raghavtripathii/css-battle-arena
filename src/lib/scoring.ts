export const PIXEL_TOLERANCE = 10

function pixelSimilarity(channelDiff: number, tolerance: number): number {
  if (channelDiff <= tolerance) return 1
  const range = 255 - tolerance
  if (range <= 0) return 0
  return Math.max(0, 1 - (channelDiff - tolerance) / range)
}

export function compareImageData(
  a: Uint8ClampedArray | number[],
  b: Uint8ClampedArray | number[],
  width: number,
  height: number,
  tolerance: number = PIXEL_TOLERANCE,
): number {
  const total = width * height
  if (total <= 0) return 0
  if (a.length !== b.length) return 0

  let similaritySum = 0
  for (let i = 0; i < a.length; i += 4) {
    const diff = (
      Math.abs(a[i]     - b[i]) +
      Math.abs(a[i + 1] - b[i + 1]) +
      Math.abs(a[i + 2] - b[i + 2])
    ) / 3
    similaritySum += pixelSimilarity(diff, tolerance)
  }

  return Math.round((similaritySum / total) * 100)
}

export function compareCanvases(
  a: HTMLCanvasElement,
  b: HTMLCanvasElement,
  width: number,
  height: number,
): number {
  const ac = a.getContext('2d')
  const bc = b.getContext('2d')
  if (!ac || !bc) return 0

  const ad = ac.getImageData(0, 0, width, height).data
  const bd = bc.getImageData(0, 0, width, height).data

  return compareImageData(ad, bd, width, height)
}