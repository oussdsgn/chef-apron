"use client";

import { useTransition } from "react";
import { logNoAnswer, setOrderStatus } from "@/app/admin/actions";
import type { OrderStatus } from "@/lib/types";

type Step = {
  title: string;
  text: string;
  actions: { label: string; status?: OrderStatus; noAnswer?: true; style: string; confirm?: string }[];
};

/** The one thing to do next for an order, with big buttons for the usual outcomes. */
export default function NextStep({
  id,
  status,
  total,
  noAnswers,
  lastTry,
}: {
  id: string;
  status: OrderStatus;
  total: string;
  noAnswers: number;
  lastTry?: string;
}) {
  const [pending, start] = useTransition();

  const steps: Partial<Record<OrderStatus, Step>> = {
    new: {
      title: "Call the customer to confirm",
      text: `Check their name, full address and the amount to pay on delivery (${total}), then record what happened.`,
      actions: [
        { label: "✓ Confirmed by phone", status: "confirmed", style: "abtn--ok" },
        { label: "No answer", noAnswer: true, style: "" },
        {
          label: "Customer cancelled",
          status: "cancelled",
          style: "abtn--ghost-danger",
          confirm: "Cancel this order? You can still change the status later.",
        },
      ],
    },
    confirmed: {
      title: "Ready to ship",
      text: "Pack the order, hand it to the delivery company and add the tracking number to the internal note.",
      actions: [{ label: "Mark as shipped", status: "shipped", style: "abtn--primary" }],
    },
    shipped: {
      title: "On its way",
      text: `When the courier confirms delivery and the ${total} were collected, mark it delivered.`,
      actions: [
        { label: "✓ Delivered & paid", status: "delivered", style: "abtn--ok" },
        {
          label: "Refused / returned",
          status: "returned",
          style: "abtn--ghost-danger",
          confirm: "Mark this order as returned?",
        },
      ],
    },
  };
  const step = steps[status];
  if (!step) return null;

  return (
    <section className={`panel next-step next-step--${status} no-print`} aria-busy={pending}>
      <div className="next-step__text">
        <span className="next-step__eyebrow">Next step</span>
        <h2>{step.title}</h2>
        <p className="muted">{step.text}</p>
        {status === "new" && noAnswers > 0 && (
          <p className="next-step__tries">
            No answer {noAnswers === 1 ? "once" : `${noAnswers} times`}
            {lastTry && <> · last try {lastTry}</>}
          </p>
        )}
      </div>
      <div className="button-row">
        {step.actions.map((a) => (
          <button
            key={a.label}
            type="button"
            className={`abtn ${a.style}`}
            disabled={pending}
            onClick={() => {
              if (a.confirm && !window.confirm(a.confirm)) return;
              start(async () => {
                if (a.noAnswer) await logNoAnswer(id);
                else if (a.status) await setOrderStatus(id, a.status);
              });
            }}
          >
            {a.label}
          </button>
        ))}
      </div>
    </section>
  );
}
