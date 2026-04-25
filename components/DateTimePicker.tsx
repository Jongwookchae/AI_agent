"use client";

import { useState, useRef, useEffect } from "react";

type Props = {
  value: string; // ISO datetime string "YYYY-MM-DDTHH:mm"
  onChange: (iso: string) => void;
  min?: string;
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const HOURS = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0")
);
const MINUTES = ["00", "15", "30", "45"];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function DateTimePicker({ value, onChange, min }: Props) {
  const now = new Date();
  const minDate = min ? new Date(min) : now;

  const parsed = value ? new Date(value) : null;

  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(parsed?.getFullYear() ?? now.getFullYear());
  const [month, setMonth] = useState(parsed?.getMonth() ?? now.getMonth());
  const [day, setDay] = useState(parsed?.getDate() ?? now.getDate());
  const [hour, setHour] = useState(parsed?.getHours() ?? 23);
  const [minute, setMinute] = useState(
    parsed ? Math.round(parsed.getMinutes() / 15) * 15 : 59
  );

  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Keep day valid when month/year changes
  useEffect(() => {
    const maxDay = daysInMonth(year, month);
    if (day > maxDay) setDay(maxDay);
  }, [year, month, day]);

  function commit(
    y = year, m = month, d = day, h = hour, min = minute
  ) {
    const maxDay = daysInMonth(y, m);
    const safeDay = Math.min(d, maxDay);
    const iso = `${y}-${pad(m + 1)}-${pad(safeDay)}T${pad(h)}:${pad(min)}`;
    onChange(iso);
  }

  function handleYear(v: number) {
    setYear(v);
    commit(v, month, day, hour, minute);
  }
  function handleMonth(v: number) {
    setMonth(v);
    commit(year, v, day, hour, minute);
  }
  function handleDay(v: number) {
    setDay(v);
    commit(year, month, v, hour, minute);
  }
  function handleHour(v: number) {
    setHour(v);
    commit(year, month, day, v, minute);
  }
  function handleMinute(v: number) {
    setMinute(v);
    commit(year, month, day, hour, v);
  }

  const displayValue = value
    ? new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  const yearOptions = Array.from(
    { length: 5 },
    (_, i) => minDate.getFullYear() + i
  );
  const dayCount = daysInMonth(year, month);
  const dayOptions = Array.from({ length: dayCount }, (_, i) => i + 1);

  const selectClass =
    "bg-slate-900 border border-slate-600 text-white text-sm rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none cursor-pointer w-full";

  return (
    <div className="relative" ref={panelRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full bg-slate-800 border text-left px-4 py-3 rounded-xl text-sm transition-colors flex items-center justify-between gap-2 ${
          open
            ? "border-violet-500 ring-2 ring-violet-500"
            : "border-slate-600 hover:border-slate-400"
        }`}
      >
        <span className={displayValue ? "text-white" : "text-slate-500"}>
          {displayValue || "Select date & time"}
        </span>
        <span className="text-slate-400 text-base shrink-0">📅</span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 space-y-4">
          {/* Date row */}
          <div>
            <p className="text-xs text-slate-400 mb-2 font-medium">Date</p>
            <div className="grid grid-cols-3 gap-2">
              {/* Month */}
              <div>
                <p className="text-xs text-slate-500 mb-1 text-center">Month</p>
                <select
                  value={month}
                  onChange={(e) => handleMonth(Number(e.target.value))}
                  className={selectClass}
                >
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Day */}
              <div>
                <p className="text-xs text-slate-500 mb-1 text-center">Day</p>
                <select
                  value={day}
                  onChange={(e) => handleDay(Number(e.target.value))}
                  className={selectClass}
                >
                  {dayOptions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <p className="text-xs text-slate-500 mb-1 text-center">Year</p>
                <select
                  value={year}
                  onChange={(e) => handleYear(Number(e.target.value))}
                  className={selectClass}
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-700" />

          {/* Time row */}
          <div>
            <p className="text-xs text-slate-400 mb-2 font-medium">Time</p>
            <div className="grid grid-cols-2 gap-2">
              {/* Hour */}
              <div>
                <p className="text-xs text-slate-500 mb-1 text-center">Hour</p>
                <select
                  value={hour}
                  onChange={(e) => handleHour(Number(e.target.value))}
                  className={selectClass}
                >
                  {HOURS.map((h) => (
                    <option key={h} value={Number(h)}>
                      {h}:00
                    </option>
                  ))}
                </select>
              </div>

              {/* Minute */}
              <div>
                <p className="text-xs text-slate-500 mb-1 text-center">Minute</p>
                <select
                  value={minute}
                  onChange={(e) => handleMinute(Number(e.target.value))}
                  className={selectClass}
                >
                  {MINUTES.map((m) => (
                    <option key={m} value={Number(m)}>
                      :{m}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Confirm button */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}
