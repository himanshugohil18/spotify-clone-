import { axiosInstance } from "@/lib/axios";

export const createSubscription = async (plan: string) => {
  // This is a mock function that doesn't actually create a subscription
  // It just simulates a successful API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
}; 