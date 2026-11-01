"use client";

import { useOptimistic, useTransition } from "react";
import { setOrderStatus } from "@/app/admin/actions";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";

export default function StatusButtons({ id, status }: { id: string; status: OrderStatus }) {
  const [current, setCurrent] = useOptimistic(status);
  const [pending, start] = useTransition();
  return (
    <div className="status-buttons" aria-busy={pending}>
      {ORDER_STATUSES.map((s) => (
        <button
          key={s.value}
          type="button"
          className={`status-btn status-btn--${s.value} ${current === s.value ? "is-active" : ""}`}
          aria-pressed={current === s.value}
          disabled={pending}
          onClick={() =>
            start(async () => {
              setCurrent(s.value);
              await setOrderStatus(id, s.value);
            })
          }
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
