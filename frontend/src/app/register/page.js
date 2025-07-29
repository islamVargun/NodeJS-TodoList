"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const promise = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || "Kayıt işlemi başarısız.");
      }

      // GÜNCELLEME: login fonksiyonunun tamamlanması bekleniyor.
      await login(data.token);

      // Artık yönlendirme güvenle yapılabilir.
      router.push("/dashboard");
    };

    toast.promise(promise(), {
      loading: "Hesap oluşturuluyor...",
      success: "Hesap başarıyla oluşturuldu! Yönlendiriliyorsunuz...",
      error: (err) => err.message,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Toaster position="top-center" />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Hesap Oluştur</CardTitle>
          <CardDescription>Başlamak için bilgilerinizi girin.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">İsim</Label>
              <Input
                id="name"
                placeholder="Adınız"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@eposta.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Hesap Oluştur
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Zaten bir hesabın var mı?{" "}
            <Link href="/login" className="underline">
              Giriş Yap
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
