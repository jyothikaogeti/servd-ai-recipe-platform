import { useState } from "react";
import { toast } from "sonner";

export function useFetch(callback) {
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function execute(...args) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await callback(...args);
      setData(response);
      return response;
    } catch (error) {
      setError(error);
      toast.error(error?.message || "Something went wrong");
      return null;
    } finally {
      setIsLoading(false);
    }
  }
  return { data, isLoading, error, execute, setData };
}
