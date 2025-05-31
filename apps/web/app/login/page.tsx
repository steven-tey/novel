"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function LoginPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        router.push("/");
      }
    });
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      if (data.user) {
        router.push("/");
      }
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="mb-4">You are logged in as {user.email}</p>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={async () => {
            await supabase.auth.signOut();
            setUser(null);
          }}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        theme="dark"
      />
    </div>
  );
} 