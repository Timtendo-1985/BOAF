import html2canvas from 'html2canvas'

/**
 * Captures the post canvas element and downloads it as a 1080x1080 PNG.
 */
export async function downloadPost(postType) {
  // Wait for all fonts to be loaded
  await document.fonts.ready

  const element = document.getElementById('post-canvas')
  if (!element) throw new Error('Post canvas not found')

  const canvas = await html2canvas(element, {
    scale: 2,           // 540 * 2 = 1080px output
    useCORS: true,
    allowTaint: false,
    backgroundColor: null,
    logging: false,
    imageTimeout: 10000,
    onclone: (clonedDoc) => {
      // Ensure the cloned element maintains full size (no CSS transform scaling)
      const cloned = clonedDoc.getElementById('post-canvas')
      if (cloned) {
        cloned.style.transform = 'none'
      }
    },
  })

  const filename = `boaf-${postType}-${Date.now()}.png`
  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/png', 1.0)
  link.click()

  return filename
}
