"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { useStore } from "./StoreProvider";

export default function CheckoutButton() {
  const { close } = useCart();
  const { t } = useStore();
  return (
    <Link href="/checkout" className="btn btn--dark btn--block" onClick={close}>
      {t("cart.checkout")}
    </Link>
  );
}
