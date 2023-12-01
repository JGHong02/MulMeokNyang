import { useState } from "react";

const useLoading = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLoading = (status: boolean) => {
    setIsLoading(status);
  };

  return {
    isLoading,
    handleLoading,
  };
};

export default useLoading;
