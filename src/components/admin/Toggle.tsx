"use client";

import { useOptimistic, useTransition } from "react";

/** A switch that calls a server action; flips immediately and reverts if the action fails. */
export default function Toggle({ on, action, label }: { on: boolean; action: () => Promise<unknown>; label: string }) {
  const [value, setValue] = useOptimistic(on);
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label}
      title={label}
      className={`switch ${value ? "is-on" : ""}`}
      disabled={pending}
      onClick={() =>
        start(async () => {
          setValue(!value);
          await action();
        })
      }
    >
      <span />
    </button>
  );
}
