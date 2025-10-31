import { throttle } from "lodash";

export class BroadcastThrottler {
  private throttles = new Map<string, (fn: () => void) => void>();

  constructor(private interval = 1000) {}

  /**
   * Đăng ký một hành động cần throttle theo hostId
   */
  schedule(hostId: string, fn: () => void) {
    if (!this.throttles.has(hostId)) {
      const throttled = throttle(
        (action: () => void) => action(),
        this.interval,
        { trailing: true }
      );
      this.throttles.set(hostId, throttled);
    }

    const runner = this.throttles.get(hostId)!;
    runner(fn);
  }

  /**
   * Xoá throttle của host (nếu host rời phòng chẳng hạn)
   */
  clear(hostId: string) {
    this.throttles.delete(hostId);
  }

  /**
   * Dọn toàn bộ throttles
   */
  clearAll() {
    this.throttles.clear();
  }
}

const leaderboardThrottler = new BroadcastThrottler(2000);

export default leaderboardThrottler;