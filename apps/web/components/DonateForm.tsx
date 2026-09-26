"use client";

import { FormEvent, useState } from "react";

type Purpose = {
  slug: string;
  title: string;
};

type Props = {
  purposes: Purpose[];
  initial?: string;
};

const PRESET_AMOUNTS = [
  500,
  1000,
  2500,
  5000,
  10000,
  25000,
];

export function DonateForm({ purposes, initial }: Props) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const [purpose, setPurpose] = useState(
    initial ?? purposes[0]?.slug ?? ""
  );

  const [amount, setAmount] = useState<number | null>(500);

  const [customOpen, setCustomOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [coverFee, setCoverFee] = useState(false);

  const selectedAmount = customOpen
    ? Number(customAmount)
    : amount;

  const feeAmount =
    coverFee && selectedAmount && selectedAmount > 0
      ? Math.round(selectedAmount * 0.025)
      : 0;

  const totalAmount =
    selectedAmount && selectedAmount > 0
      ? selectedAmount + feeAmount
      : 0;

  function handlePresetSelect(value: number) {
    setAmount(value);
    setCustomOpen(false);
    setCustomAmount("");
  }

  function handleCustomSelect() {
    setCustomOpen(true);
    setAmount(null);
  }

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    if (!mobile.trim()) {
      return;
    }

    if (!selectedAmount || selectedAmount <= 0) {
      return;
    }

    /*
      KEEP YOUR EXISTING PAYMENT LOGIC HERE.

      Send:

      {
        name,
        mobile,
        email,
        purpose,
        amount: selectedAmount,
        coverFee,
        feeAmount,
        totalAmount
      }

      to your existing donation/order API.
    */

    console.log({
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim() || null,
      purpose,
      amount: selectedAmount,
      coverFee,
      feeAmount,
      totalAmount,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* DONOR DETAILS */}
      <div className="space-y-5">
        <div>
          <label
            htmlFor="donor-name"
            className="text-sm font-medium text-forest"
          >
            Full name
          </label>

          <input
            id="donor-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="mt-3 w-full rounded-xl border border-forest/15 bg-white px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-ink-muted/60 focus:border-forest"
          />
        </div>

        <div>
          <label
            htmlFor="donor-mobile"
            className="text-sm font-medium text-forest"
          >
            Mobile number
          </label>

          <input
            id="donor-mobile"
            name="mobile"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter your mobile number"
            className="mt-3 w-full rounded-xl border border-forest/15 bg-white px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-ink-muted/60 focus:border-forest"
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-3">
            <label
              htmlFor="donor-email"
              className="text-sm font-medium text-forest"
            >
              Email
            </label>

            <span className="text-xs text-ink-muted">
              Optional
            </span>
          </div>

          <input
            id="donor-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="mt-3 w-full rounded-xl border border-forest/15 bg-white px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-ink-muted/60 focus:border-forest"
          />
        </div>
      </div>

      {/* PURPOSE */}
      <div>
        <label
          htmlFor="purpose"
          className="text-sm font-medium text-forest"
        >
          What would you like to support?
        </label>

        <select
          id="purpose"
          name="purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="mt-3 w-full rounded-xl border border-forest/15 bg-white px-4 py-3.5 text-sm text-ink outline-none transition focus:border-forest"
        >
          {purposes.map((p) => (
            <option
              key={p.slug}
              value={p.slug}
            >
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {/* AMOUNT */}
      <div>
        <p className="text-sm font-medium text-forest">
          Choose an amount
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PRESET_AMOUNTS.map((value) => {
            const isSelected =
              !customOpen && amount === value;

            return (
              <button
                key={value}
                type="button"
                onClick={() =>
                  handlePresetSelect(value)
                }
                aria-pressed={isSelected}
                className={[
                  "rounded-xl border px-4 py-4 text-base font-medium transition",
                  isSelected
                    ? "border-forest bg-forest text-cream"
                    : "border-forest/15 bg-white text-forest hover:border-forest/40",
                ].join(" ")}
              >
                ₹{value.toLocaleString("en-IN")}
              </button>
            );
          })}
        </div>

        {/* CUSTOM AMOUNT */}
        {!customOpen ? (
          <button
            type="button"
            onClick={handleCustomSelect}
            className="mt-3 w-full rounded-xl border border-dashed border-forest/20 bg-white px-4 py-3.5 text-sm font-medium text-forest/70 transition hover:border-forest/40 hover:text-forest"
          >
            Enter another amount
          </button>
        ) : (
          <div className="mt-3">
            <div className="flex items-center rounded-xl border border-forest/20 bg-white px-4 transition outline-none focus-within:outline-none focus-visible:outline-none">
              <span className="text-lg text-ink-muted">
                ₹
              </span>

              <input
                id="custom-amount"
                name="customAmount"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoFocus
                value={customAmount}
                onKeyDown={(e) => {
                  if (
                    e.key === "ArrowUp" ||
                    e.key === "ArrowDown"
                  ) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value.replace(
                    /[^0-9]/g,
                    ""
                  );
                  setCustomAmount(value);
                }}
                placeholder="Enter amount"
                className="w-full bg-transparent px-3 py-3.5 text-base text-ink outline-none focus:outline-none focus-visible:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-ink-muted">
                Enter an amount greater than ₹0.
              </p>

              <button
                type="button"
                onClick={() =>
                  handlePresetSelect(500)
                }
                className="text-xs font-medium text-forest hover:underline"
              >
                Choose preset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* COVER PAYMENT PROCESSING COSTS */}
      <div className="rounded-xl border border-forest/15 bg-white p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={coverFee}
            onChange={(e) =>
              setCoverFee(e.target.checked)
            }
            className="mt-1 h-4 w-4 rounded border-forest/30 text-forest focus:ring-forest accent-forest cursor-pointer"
          />

          <div>
            <span className="text-sm font-medium text-forest">
              Cover payment processing costs — 2.5%
            </span>

            <p className="mt-1 text-xs text-ink-muted leading-relaxed">
              This helps cover payment processing charges so that your intended donation can reach ISKCON Margao in full.
            </p>
          </div>
        </label>
      </div>

      {/* SUMMARY */}
      <div className="rounded-xl bg-forest/5 px-5 py-4 space-y-2">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-ink-muted">
            {coverFee && selectedAmount && selectedAmount > 0
              ? "Base donation"
              : "Your offering"}
          </span>

          <span className="text-base font-medium text-forest">
            {selectedAmount && selectedAmount > 0
              ? `₹${selectedAmount.toLocaleString("en-IN")}`
              : "—"}
          </span>
        </div>

        {coverFee && selectedAmount && selectedAmount > 0 ? (
          <div className="flex items-center justify-between gap-4 text-xs text-ink-muted border-t border-forest/10 pt-2">
            <span>Processing fee (2.5%)</span>
            <span>+₹{feeAmount.toLocaleString("en-IN")}</span>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-4 border-t border-forest/10 pt-2">
          <span className="text-sm font-medium text-forest">
            Total offering
          </span>

          <span className="font-serif text-2xl text-forest">
            {totalAmount > 0
              ? `₹${totalAmount.toLocaleString("en-IN")}`
              : "—"}
          </span>
        </div>
      </div>

      {/* PAYMENT BUTTON */}
      <button
        type="submit"
        disabled={
          !name.trim() ||
          !mobile.trim() ||
          !selectedAmount ||
          selectedAmount <= 0 ||
          !purpose
        }
        className="w-full rounded-full bg-forest px-6 py-4 text-sm font-medium text-cream transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue to payment
        <span className="ml-2">→</span>
      </button>
    </form>
  );
}