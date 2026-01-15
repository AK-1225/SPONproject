/**
 * Media Utilities for image/video compression and processing
 */

// Maximum dimensions for images
const MAX_IMAGE_WIDTH = 1200
const MAX_IMAGE_HEIGHT = 1200
const IMAGE_QUALITY = 0.8

// Video constraints
export const MAX_VIDEO_DURATION = 60 // seconds
const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB

/**
 * Compress an image file before upload
 * @param file - Original image file
 * @returns Promise<string> - Compressed image as base64 data URL
 */
export async function compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const reader = new FileReader()

        reader.onload = (e) => {
            img.src = e.target?.result as string
        }

        img.onload = () => {
            const canvas = document.createElement('canvas')
            let { width, height } = img

            // Calculate new dimensions while maintaining aspect ratio
            if (width > MAX_IMAGE_WIDTH || height > MAX_IMAGE_HEIGHT) {
                const ratio = Math.min(MAX_IMAGE_WIDTH / width, MAX_IMAGE_HEIGHT / height)
                width = Math.round(width * ratio)
                height = Math.round(height * ratio)
            }

            canvas.width = width
            canvas.height = height

            const ctx = canvas.getContext('2d')
            if (!ctx) {
                reject(new Error('Failed to get canvas context'))
                return
            }

            // Draw image with high quality
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'
            ctx.drawImage(img, 0, 0, width, height)

            // Convert to compressed JPEG
            const compressedDataUrl = canvas.toDataURL('image/jpeg', IMAGE_QUALITY)
            resolve(compressedDataUrl)
        }

        img.onerror = () => reject(new Error('Failed to load image'))
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
    })
}

/**
 * Generate a thumbnail from an image
 * @param dataUrl - Image data URL
 * @param size - Thumbnail size (default 200px)
 */
export async function generateThumbnail(dataUrl: string, size = 200): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
            const canvas = document.createElement('canvas')
            const ratio = Math.min(size / img.width, size / img.height)
            canvas.width = Math.round(img.width * ratio)
            canvas.height = Math.round(img.height * ratio)

            const ctx = canvas.getContext('2d')
            if (!ctx) {
                reject(new Error('Failed to get canvas context'))
                return
            }

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            resolve(canvas.toDataURL('image/jpeg', 0.7))
        }
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = dataUrl
    })
}

/**
 * Get video duration
 */
export function getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video')
        video.preload = 'metadata'

        video.onloadedmetadata = () => {
            URL.revokeObjectURL(video.src)
            resolve(video.duration)
        }

        video.onerror = () => {
            URL.revokeObjectURL(video.src)
            reject(new Error('Failed to load video metadata'))
        }

        video.src = URL.createObjectURL(file)
    })
}

/**
 * Validate video file (duration and size)
 */
export async function validateVideo(file: File): Promise<{ valid: boolean; duration: number; error?: string }> {
    try {
        // Check file size
        if (file.size > MAX_VIDEO_SIZE) {
            return {
                valid: false,
                duration: 0,
                error: `動画ファイルが大きすぎます（最大${MAX_VIDEO_SIZE / 1024 / 1024}MB）`
            }
        }

        // Check duration
        const duration = await getVideoDuration(file)

        if (duration > MAX_VIDEO_DURATION) {
            return {
                valid: false,
                duration,
                error: `動画は${MAX_VIDEO_DURATION}秒以内にしてください（現在: ${Math.round(duration)}秒）。最初の1分が使用されます。`
            }
        }

        return { valid: true, duration }
    } catch (error) {
        return { valid: false, duration: 0, error: '動画の読み込みに失敗しました' }
    }
}

/**
 * Generate video thumbnail from the first frame
 */
export function generateVideoThumbnail(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video')
        const canvas = document.createElement('canvas')

        video.preload = 'metadata'
        video.muted = true
        video.playsInline = true

        video.onloadeddata = () => {
            video.currentTime = 0.5 // Capture at 0.5 second
        }

        video.onseeked = () => {
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight

            const ctx = canvas.getContext('2d')
            if (!ctx) {
                reject(new Error('Failed to get canvas context'))
                return
            }

            ctx.drawImage(video, 0, 0)
            URL.revokeObjectURL(video.src)
            resolve(canvas.toDataURL('image/jpeg', 0.8))
        }

        video.onerror = () => {
            URL.revokeObjectURL(video.src)
            reject(new Error('Failed to load video'))
        }

        video.src = URL.createObjectURL(file)
        video.load()
    })
}

/**
 * Check if file is a video
 */
export function isVideoFile(file: File): boolean {
    return file.type.startsWith('video/')
}

/**
 * Check if file is an image
 */
export function isImageFile(file: File): boolean {
    return file.type.startsWith('image/')
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
