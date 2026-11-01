"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function CheckoutButton() {
  const { close } = useCart();
  return (
    <Link href="/checkout" className="btn btn--dark btn--block" onClick={close}>
      Checkout
    </Link>
  );
}
