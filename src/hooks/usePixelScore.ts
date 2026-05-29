// hooks/usePixelScore.ts
// pixel-by-pixel comparison between target and user output
// two canvases, same dimensions, compare RGBA arrays and score the match

import { useCallback } from 'react'

// debounce delay — don't run on every keystroke, too slow
export const SCORE_DEBOUNCE_MS = 300

// returns 0-100 match score between two canvases
export function compareCanvases(
  targetCanvas: HTMLCanvasElement,
  userCanvas: HTMLCanvasElement
): number {
  const width  = targetCanvas.width
  const height = targetCanvas.height

  const targetCtx = targetCanvas.getContext('2d')
  const userCtx   = userCanvas.getContext('2d')

  if (!targetCtx || !userCtx) return 0

  // flat RGBA array — 4 values per pixel
  const targetData = targetCtx.getImageData(0, 0, width, height).data
  const userData   = userCtx.getImageData(0, 0, width, height).data

  const totalPixels = width * height
  let matchingPixels = 0

  for (let i = 0; i < targetData.length; i += 4) {
    const rDiff = Math.abs(targetData[i]     - userData[i])
    const gDiff = Math.abs(targetData[i + 1] - userData[i + 1])
    const bDiff = Math.abs(targetData[i + 2] - userData[i + 2])

    // tolerance of 10 per channel — fonts render slightly differently
    // across browsers, without this a perfect match scores ~85
    const isMatch = rDiff <= 10 && gDiff <= 10 && bDiff <= 10
    if (isMatch) matchingPixels++
  }

  return Math.round((matchingPixels / totalPixels) * 100)
}

// screenshots an iframe by drawing its DOM into a canvas via svg foreignObject
export async function captureIframe(
  iframe: HTMLIFrameElement,
  width: number,
  height: number
): Promise<HTMLCanvasElement | null> {
  try {
    const doc = iframe.contentDocument
    if (!doc) return null

    const canvas  = document.createElement('canvas')
    canvas.width  = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    const data = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml">
            ${doc.documentElement.outerHTML}
          </div>
        </foreignObject>
      </svg>
    `

    const img = new Image()
    const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)

    return new Promise((resolve) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
        URL.revokeObjectURL(url)
        resolve(canvas)
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(null)
      }
      img.src = url
    })
  } catch {
    return null
  }
}

// builds the html string for both iframes — same structure, different css
export function buildIframeDocument(html: string, css: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { width: 400px; height: 300px; overflow: hidden; }
  ${css}
</style>
</head>
<body>${html}</body>
</html>`
}