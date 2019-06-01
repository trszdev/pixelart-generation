import { EventLoopReleaser } from './types'


export class EmptyReleaser implements EventLoopReleaser {
  async release() {}
}

export class AnimationFrameReleaser implements EventLoopReleaser {
  readonly thresholdMs: number
  timestampMs: number

  constructor(thresholdMs = 60, timestampMs = Date.now()) {
    this.thresholdMs = thresholdMs
    this.timestampMs = timestampMs
  }

  async release() {
    const now = Date.now()
    const { timestampMs, thresholdMs } = this
    if (now - timestampMs > thresholdMs) {
      this.timestampMs = now
      return new Promise<void>(res => requestAnimationFrame(() => res()))
    }
  }
}
