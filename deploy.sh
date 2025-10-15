#!/bin/bash

# Script deploy cho dự án uni-class-game
# Thực hiện git pull, build và khởi động containers

set -e  # Dừng script nếu có lỗi

echo "🚀 Bắt đầu quá trình deploy..."

# Chuyển đến thư mục dự án
cd "$(dirname "$0")/uni-class-game"

echo "📥 Đang pull code mới nhất từ git..."
git pull

echo "🔎 Kiểm tra file môi trường..."
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
  echo "⚙️  Chưa có .env, đang tạo từ .env.example"
  cp .env.example .env
fi

echo "🔨 Đang build Docker images..."
docker compose build
docker compose down
echo "🚀 Đang khởi động containers..."
docker compose up -d

echo "✅ Deploy hoàn tất!"
echo "📊 Kiểm tra trạng thái containers:"
docker compose ps
