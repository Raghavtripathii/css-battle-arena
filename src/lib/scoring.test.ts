import { describe, it, expect } from 'vitest'
import { compareImageData, PIXEL_TOLERANCE } from './scoring'

// Builds a flat RGBA buffer for `count` pixels, all set to the given color.
function solidBuffer(count: number, r: number, g: number, b: number, a = 255): Uint8ClampedArray {
  const data = new Uint8ClampedArray(count * 4)
  for (let i = 0; i < data.length; i += 4) {
    data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = a
  }
  return data
}

describe('compareImageData', () => {
  it('scores two identical buffers as a perfect 100% match', () => {
    const a = solidBuffer(4, 124, 106, 247)
    const b = solidBuffer(4, 124, 106, 247)
    expect(compareImageData(a, b, 2, 2)).toBe(100)
  })

  it('scores two completely different colors as 0%', () => {
    const a = solidBuffer(4, 255, 0, 0)
    const b = solidBuffer(4, 0, 255, 0)
    expect(compareImageData(a, b, 2, 2)).toBe(0)
  })

  it('treats small per-channel differences within tolerance as a match', () => {
    const a = solidBuffer(4, 100, 100, 100)
    const b = solidBuffer(4, 100 + PIXEL_TOLERANCE, 100, 100 - PIXEL_TOLERANCE)
    expect(compareImageData(a, b, 2, 2)).toBe(100)
  })

  it('treats a difference exactly at the tolerance boundary as a match', () => {
    const a = solidBuffer(1, 50, 50, 50)
    const b = solidBuffer(1, 50 + PIXEL_TOLERANCE, 50, 50)
    expect(compareImageData(a, b, 1, 1)).toBe(100)
  })

  it('treats a difference one unit past the tolerance boundary as a mismatch', () => {
    const a = solidBuffer(1, 50, 50, 50)
    const b = solidBuffer(1, 50 + PIXEL_TOLERANCE + 1, 50, 50)
    expect(compareImageData(a, b, 1, 1)).toBe(0)
  })

  it('ignores the alpha channel entirely', () => {
    const a = solidBuffer(4, 10, 20, 30, 255)
    const b = solidBuffer(4, 10, 20, 30, 0)
    expect(compareImageData(a, b, 2, 2)).toBe(100)
  })

  it('reports a partial match when only some pixels match', () => {
    const width = 4, height = 1
    const a = new Uint8ClampedArray(width * height * 4)
    const b = new Uint8ClampedArray(width * height * 4)
    for (let px = 0; px < width * height; px++) {
      const i = px * 4
      // first half matches, second half is wildly different
      const matches = px < 2
      a[i] = 200; a[i+1] = 50; a[i+2] = 50; a[i+3] = 255
      b[i] = matches ? 200 : 0
      b[i+1] = matches ? 50 : 255
      b[i+2] = matches ? 50 : 0
      b[i+3] = 255
    }
    expect(compareImageData(a, b, width, height)).toBe(50)
  })

  it('returns 0 for mismatched buffer lengths instead of throwing', () => {
    const a = solidBuffer(4, 0, 0, 0)
    const b = solidBuffer(2, 0, 0, 0)
    expect(compareImageData(a, b, 2, 2)).toBe(0)
  })

  it('returns 0 for zero-area dimensions instead of dividing by zero', () => {
    const a = new Uint8ClampedArray(0)
    const b = new Uint8ClampedArray(0)
    expect(compareImageData(a, b, 0, 0)).toBe(0)
  })

  it('respects a custom tolerance value', () => {
    const a = solidBuffer(1, 100, 100, 100)
    const b = solidBuffer(1, 105, 100, 100)
    expect(compareImageData(a, b, 1, 1, 2)).toBe(0)   // tighter tolerance rejects it
    expect(compareImageData(a, b, 1, 1, 10)).toBe(100) // default tolerance accepts it
  })
})