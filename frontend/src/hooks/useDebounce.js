"use client";

import { useState, useEffect } from "react";

// Bu hook, bir değerin belirli bir süre boyunca değişmemesini bekler.
// Kullanıcı yazmayı bıraktığında API'ye istek göndermek için idealdir.
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Bir sonraki effect çalışmadan önce zamanlayıcıyı temizle
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
