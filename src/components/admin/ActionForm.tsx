"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import type { ActionState } from "@/app/admin/actions";

export function SubmitButton({ children = "Save changes", className = "abtn abtn--primary" }: { children?: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button className={className} disabled={pending}>
      {pending ? "Saving…" : children}
    </button>
  );
}

/** A form bound to a server action that returns { ok, message }, with a small status message. */
export default function ActionForm({
  action,
  children,
  className,
  submitLabel,
  footer = true,
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  className?: string;
  submitLabel?: string;
  footer?: boolean;
}) {
  const [state, formAction] = useActionState(action, null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!state) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), state.ok ? 3000 : 8000);
    return () => clearTimeout(t);
  }, [state]);

  return (
    <form action={formAction} className={className}>
      {children}
      {footer && (
        <div className="form-actions">
          <SubmitButton>{submitLabel}</SubmitButton>
          {state && visible && (
            <span className={`form-status ${state.ok ? "is-ok" : "is-error"}`} role="status">
              {state.message}
            </span>
          )}
        </div>
      )}
    </form>
  );
}
