"use client";

import { useTransition } from "react";

/** Runs a server action after the user confirms. If the action returns { error }, it's shown in an alert. */
export default function ConfirmButton({
  action,
  confirm: question,
  children,
  className = "abtn abtn--danger",
}: {
  action: () => Promise<unknown>;
  confirm: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      className={className}
      disabled={pending}
      onClick={() => {
        if (!window.confirm(question)) return;
        start(async () => {
          const res = (await action()) as { error?: string } | undefined;
          if (res?.error) window.alert(res.error);
        });
      }}
    >
      {pending ? "…" : children}
    </button>
  );
}
