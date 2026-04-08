"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Count() {
  const [count, setCount] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    const savedCount = localStorage.getItem("count");
    if (savedCount) {
      setCount(JSON.parse(savedCount));
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("count", JSON.stringify(count));
    }
  }, [count, isHydrated]);

  if(!isHydrated) {
    return null
  }

  const handlePlus = () => {
    setCount(count + 1);
  };
  const handleMinus = () => {
    setCount(count - 1);
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="text-center">
        <p>{count}</p>
        <Button className="px-5 py-3 m-3" onClick={handlePlus}>
          +
        </Button>
        <Button className="px-5 py-3 m-3" onClick={reset}>
          Reset
        </Button>
        <Button className="px-5 py-3 m-3" onClick={handleMinus}>
          -
        </Button>
      </div>
    </div>
  );
}
