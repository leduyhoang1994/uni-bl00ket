# Uni Class Game

## Cài đặt

Build Backend

```
docker build -f Backend/Dockerfile -t uni-class-game-backend .
```

Build Frontend

```
docker build -f Frontend/Dockerfile -t uni-class-game-backend .
```

Build hole project

```
docker-compose up -d
```

## Hướng dẫn sử dụng demo trên máy cá nhân

1. Truy cập đường dẫn: `http://localhost:5173/cafe/create?accessToken=Host.host`
2. Ấn "Create Host"
3. Ấn chọn "Copy Join Link" ở góc phải
4. Mở tab mới và paste URL đã copy (Mỗi người chơi là một tab)
5. Quay về tab Host ban đầu ấn "Start"
