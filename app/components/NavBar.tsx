"use client";

import Link from "next/link";
import AuthModal from "./AuthModal";
import { useAuthContext } from "../context/AuthContext";
import useAuth from "../hooks/useAuth";

export default function NavBar() {
  const { data, loading } = useAuthContext();
  const { signout } = useAuth();

  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link href="/" className="font-bold text-gray-700 text-2xl">
        OpenTable
      </Link>
      {loading ? null : (
        <div className="flex">
          {data ? (
            <button
              onClick={signout}
              className="bg-blue-400 text-white border p-1 px-4 rounded"
            >
              Sign out
            </button>
          ) : (
            <>
              <AuthModal isSignIn={true} />
              <AuthModal isSignIn={false} />
            </>
          )}
        </div>
      )}
    </nav>
  );
}
