/** Admin uploads can be a video (mp4/webm) in place of an image. */
export const isVideo = (url: string) => /\.(mp4|webm)(\?|#|$)/i.test(url)
