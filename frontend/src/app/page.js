"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { CheckCircle, Loader2 } from "lucide-react";

export default function LandingPage() {
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && token) {
      router.push("/dashboard");
    }
  }, [token, loading, router]);

  if (loading || token) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center">
          <span className="text-lg font-semibold">TodoApp</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href="/login" passHref>
            <Button variant="ghost">Giriş Yap</Button>
          </Link>
          <Link href="/register" passHref>
            <Button>Kayıt Ol</Button>
          </Link>
          <ThemeToggleButton />
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Hayatınızı Kolaylaştıran Görev Yöneticisi
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    TodoApp ile görevlerinizi planlayın, takip edin ve
                    tamamlayın. Haftalık planlayıcı, son teslim tarihleri ve
                    daha fazlası ile organize olun.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register" passHref>
                    <Button size="lg">Hemen Başla</Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <ul className="grid gap-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Haftalık Planlayıcı</h3>
                      <p className="text-sm text-muted-foreground">
                        Tüm haftanızı tek bir ekranda görün ve planlayın.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Son Teslim Tarihleri</h3>
                      <p className="text-sm text-muted-foreground">
                        Görevlerinize tarihler atayın ve hiçbir şeyi kaçırmayın.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Koyu & Açık Tema</h3>
                      <p className="text-sm text-muted-foreground">
                        Gözünüze en uygun temayı seçerek çalışın.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
