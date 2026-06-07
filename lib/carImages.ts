// A fixed pool of 10 EV/car photos (in /public/cars). We reuse these across the
// app, picking one deterministically per vehicle id so the same vehicle always
// shows the same image.
export const carImages = [
  "/cars/car-1.jpg",
  "/cars/car-2.jpg",
  "/cars/car-3.jpg",
  "/cars/car-4.jpg",
  "/cars/car-5.jpg",
  "/cars/car-6.jpg",
  "/cars/car-7.jpg",
  "/cars/car-8.jpg",
  "/cars/car-9.jpg",
  "/cars/car-10.jpg",
] as const;

// Stable string hash so a given key always maps to the same image.
function hash(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Pick one of the 10 car images for a vehicle (stable per key). */
export function carImageFor(key: string): string {
  return carImages[hash(key) % carImages.length];
}
