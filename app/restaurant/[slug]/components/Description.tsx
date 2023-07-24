import { ReactNode } from "react";

export default function Desription({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4">
      <p className="text-lg font-light">{children}</p>
    </div>
  );
}
