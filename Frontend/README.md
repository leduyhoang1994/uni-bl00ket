# Running

```
npm run dev
```

# Note

* Tryền thêm meta vào link join
  * Ví dụ: domain.com/join/{hostId}?meta=helloword thì khi trả bảng xếp hạng về thông qua API sẽ có thông tin meta tương ứng với từng player trong BXH

```typescript
export type HostLeaderboardItem = {
  playerId: string;
  score: number;
  username?: string;
  avatar?: string;
  meta?: string;
};

export type HostLeaderboard = HostLeaderboardItem[];
```
