import { clsx } from "clsx"; //giúp bật tắt class
import { twMerge } from "tailwind-merge"// tự động xóa bỏ class dư thừa

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
