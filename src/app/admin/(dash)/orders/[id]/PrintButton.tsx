"use client";

export default function PrintButton() {
  return (
    <button type="button" className="abtn no-print" onClick={() => window.print()}>
      Print delivery slip
    </button>
  );
}
