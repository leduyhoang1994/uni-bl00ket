import { useRef, useEffect } from "react";

// --- Các hằng số ---
const totalSprites: number = 150;
const flipSpeed: number = 0.08;
const colors: string[] = [
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
];

// --- Các hàm tiện ích với kiểu dữ liệu rõ ràng ---
function getRandomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// --- Lớp Particle với các thuộc tính được định kiểu ---
class Particle {
  // Khai báo kiểu dữ liệu cho các thuộc tính
  radius: number;
  x: number;
  y: number;
  color: string;
  fallSpeed: number;
  rotation: number;
  scaleY: number;
  direction: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.radius = 8;
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * -canvasHeight;
    this.color = randomFromArray(colors);

    // Thuộc tính vật lý
    this.fallSpeed = getRandomFloat(4, 9);
    this.rotation = Math.random() * Math.PI * 2;
    this.scaleY = getRandomFloat(-1, 1);
    this.direction = this.scaleY > 0 ? -1 : 1;
  }

  // Cập nhật trạng thái
  update(canvasHeight: number): void {
    this.y += this.fallSpeed;
    const rotationDirection = randomFromArray([-1, 1]);
    this.rotation += flipSpeed * this.direction * rotationDirection;
    this.scaleY += flipSpeed * this.direction;

    // Đảo chiều lật
    if (this.scaleY >= 1) {
      this.scaleY = 1;
      this.direction = -1;
    }
    if (this.scaleY <= -1) {
      this.scaleY = -1;
      this.direction = 1;
    }

    // Reset khi rơi ra khỏi màn hình
    if (this.y > canvasHeight + this.radius) {
      this.y = -this.radius;
    }
  }

  // Vẽ hạt, định kiểu cho context
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(1, this.scaleY);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}

// --- Component React với kiểu `React.FC` (Functional Component) ---
export default function CongratulationEffect() {
  // Định kiểu cho ref: nó sẽ tham chiếu đến một HTMLCanvasElement hoặc là null
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Định kiểu cho ref lưu ID của animation frame
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    // Kiểm tra `canvas` không phải là null
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    // Kiểm tra `ctx` có lấy được không (quan trọng trong môi trường không phải trình duyệt)
    if (!ctx) return;

    let particles: Particle[] = [];

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < totalSprites; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const particle of particles) {
        particle.update(canvas.height);
        particle.draw(ctx);
      }
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      init();
    };

    init();
    animate();

    window.addEventListener("resize", handleResize);

    // Hàm dọn dẹp
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []); // useEffect chỉ chạy một lần sau khi component mount

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        position: "fixed",
        top: 0,
        left: 0,
        background: "transparent",
      }}
    />
  );
}
