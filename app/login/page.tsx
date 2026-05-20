"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const handleLogin = () => {
    // CHANGE THESE
    const ADMIN_USERNAME = "aj";
    const ADMIN_PASSWORD = "books123";

    if (
      username === ADMIN_USERNAME &&
      password === ADMIN_PASSWORD
    ) {
      localStorage.setItem(
        "role",
        "admin"
      );

      router.push("/library");
    } else {
      setError("Invalid credentials");
    }
  };

  const loginAsGuest = () => {
    localStorage.setItem(
      "role",
      "guest"
    );

    router.push("/library");
  };

  return (
    <main
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-[#f6f1e9]
        px-4
      "
    >
      <div
        className="
          w-full
          max-w-md
          bg-[#fffdf9]
          border
          border-[#e4d8ca]
          rounded-[32px]
          p-8
          shadow-lg
        "
      >
        <h1
          className="
            text-5xl
            font-bold
            mb-2
            text-center
          "
        >
          Ex libris AJ
        </h1>

        <p
          className="
            text-center
            opacity-60
            mb-8
          "
        >
          Enter the library
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
            className="
              w-full
              p-3
              rounded-2xl
              border
              border-[#d7ccbf]
              bg-white
              outline-none
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="
              w-full
              p-3
              rounded-2xl
              border
              border-[#d7ccbf]
              bg-white
              outline-none
            "
          />

          {error && (
            <p className="text-red-600 text-sm">
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            className="
              w-full
              bg-[#5c3b28]
              text-white
              py-3
              rounded-2xl
              hover:bg-[#4a2f20]
              transition
            "
          >
            Login
          </button>

          <button
            onClick={loginAsGuest}
            className="
              w-full
              border
              border-[#d7ccbf]
              py-3
              rounded-2xl
              hover:bg-[#f4ede3]
              transition
            "
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </main>
  );
}