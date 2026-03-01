"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSupabase } from "@/lib/supabase";
import { spring } from "@/lib/animations";

interface WaitlistFormProps {
  buttonText?: string;
  className?: string;
  inputClassName?: string;
}

export function WaitlistForm({
  buttonText = "JOIN WAITLIST",
  className = "",
  inputClassName = "",
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      setErrorMessage("Enter a valid email address.");
      return;
    }

    setStatus("loading");

    try {
      const { error } = await getSupabase()
        .from("waitlist")
        .insert({ email: trimmed });

      if (error) {
        if (error.code === "23505") {
          // Unique constraint — already signed up
          setStatus("success");
          return;
        }
        throw error;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Try again.");
    }
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring.snappy}
            className="flex items-center gap-3 py-5 px-6 bg-emerald text-white font-headline font-bold text-sm tracking-wide"
          >
            <span className="text-lg">&#10003;</span>
            You&apos;re in. We&apos;ll be in touch.
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className={`flex flex-col sm:flex-row border-[3px] border-ink sm:border-[3px] overflow-hidden ${className}`}
          >
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              disabled={status === "loading"}
              className={`form-input flex-1 border-b-[3px] sm:border-b-0 border-ink sm:border-none disabled:opacity-60 ${inputClassName}`}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-8 py-5 font-headline font-bold text-sm bg-emerald text-white hover:bg-ink transition-colors tracking-wide disabled:opacity-60"
            >
              {status === "loading" ? (
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  JOINING...
                </motion.span>
              ) : (
                buttonText
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-sm text-red-500 font-medium"
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
