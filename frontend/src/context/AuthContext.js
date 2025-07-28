"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/login");
  }, [router]);

  const fetchUser = useCallback(
    async (authToken) => {
      if (!authToken) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const response = await fetch("http://localhost:3000/api/auth/user", {
          headers: {
            "x-auth-token": authToken,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(
              errorData.msg || `Sunucu Hatası: ${response.status}`
            );
          } catch (e) {
            console.error("Sunucudan gelen yanıt JSON değil:", errorText);
            throw new Error(
              `Sunucuya ulaşılamıyor veya geçersiz yanıt. (Kod: ${response.status})`
            );
          }
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Kullanıcı getirme hatası:", error.message);
        logout();
      } finally {
        setLoading(false);
      }
    },
    [logout]
  );

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  // GÜNCELLEME: Fonksiyon 'async' yapıldı ve 'fetchUser' bekleniyor.
  const login = async (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    await fetchUser(newToken);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
