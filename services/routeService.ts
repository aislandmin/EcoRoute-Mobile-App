import routes from "@/assets/routes.json";

export type Route = {
  mode: string;
  score: number;
  distance_km: number;
  time_min: number;
  co2_g: number;
};

export const getRoutes = async (): Promise<Route[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(routes), 500); // simulate delay
  });
};
