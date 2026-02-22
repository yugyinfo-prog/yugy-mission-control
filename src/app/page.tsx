"use client";
import { useEffect, useState } from "react";

// ─── Helpers ───
function daysUntil(dateStr: string) {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return (
    <span className="text-sm text-[var(--text-dim)] font-mono">
      {now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
      {" · "}
      {now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </span>
  );
}

// ─── Components ───
function Card({ label, value, sub, done }: { label: string; value: string; sub?: string; done?: boolean }) {
  return (
    <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5 flex flex-col gap-1 hover:border-[var(--violet)] transition-colors">
      <span className="text-xs uppercase tracking-widest text-[var(--text-dim)] font-medium">{label}</span>
      <span className="text-2xl font-bold tracking-tight">
        {value} {done && <span className="text-[var(--green)]">✅</span>}
      </span>
      {sub && <span className="text-xs text-[var(--text-dim)]">{sub}</span>}
    </div>
  );
}

function ProgressBar({ label, current, total }: { label: string; current: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((current / total) * 100);
  const done = current === total;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-sm">
        <span>{label} {done && <span className="text-[var(--green)]">✅</span>}</span>
        <span className="text-[var(--text-dim)] font-mono">{current}/{total}</span>
      </div>
      <div className="h-2 bg-[#1E1E2E] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full progress-bar"
          style={{
            width: `${pct}%`,
            background: done ? "var(--green)" : "var(--violet)",
          }}
        />
      </div>
    </div>
  );
}

type Priority = "high" | "medium" | "this-week" | "done";
function PriorityBadge({ p }: { p: Priority }) {
  const styles: Record<Priority, string> = {
    high: "bg-red-500/15 text-red-400 border-red-500/30",
    medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    "this-week": "bg-blue-500/15 text-blue-400 border-blue-500/30",
    done: "bg-green-500/15 text-green-400 border-green-500/30",
  };
  const labels: Record<Priority, string> = { high: "HIGH", medium: "MED", "this-week": "THIS WEEK", done: "DONE ✅" };
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${styles[p]}`}>{labels[p]}</span>;
}

// ─── Data ───
const tasks: { name: string; priority: Priority }[] = [
  { name: "Database schema design", priority: "high" },
  { name: "Stripe Connect setup", priority: "high" },
  { name: "Cost sheet breakdown", priority: "medium" },
  { name: "Google Workspace signup ($14/mo)", priority: "high" },
  { name: "Apple Developer ($99)", priority: "high" },
  { name: "Google Play Developer ($25)", priority: "medium" },
  { name: "Review 9 YouTube episodes", priority: "this-week" },
  { name: "Mission Control (live)", priority: "done" },
  { name: "Customer audit applied", priority: "done" },
  { name: "Vendor audit applied", priority: "done" },
];

const deadlines: { name: string; date: string; urgent?: boolean }[] = [
  { name: "Phase 2: Backend", date: "2026-03-02" },
  { name: "yugy.us domain renewal", date: "2026-03-16", urgent: true },
  { name: "Phase 3: Customer App", date: "2026-03-16" },
  { name: "Phase 4: Vendor App", date: "2026-04-01" },
  { name: "Phase 5: Testing", date: "2026-04-14" },
  { name: "Phase 6: Pre-Launch", date: "2026-04-27" },
  { name: "🚀 LAUNCH", date: "2026-05-03" },
];

const spending = [
  { item: "Google Workspace", cost: "$14/mo", status: "pending" },
  { item: "Apple Developer", cost: "$99/yr", status: "pending" },
  { item: "Google Play Developer", cost: "$25 one-time", status: "pending" },
  { item: "Domain renewal yugy.us", cost: "~$10/yr", status: "due Mar 16" },
];

const documents = [
  { name: "YUGY-MASTER-BUSINESS-PLAN.docx", type: "word" },
  { name: "Profitability-Model.docx", type: "word" },
  { name: "YUGY-DOMAIN-AVAILABILITY.xlsx", type: "excel" },
  { name: "HOW YUGY Makes money", type: "word" },
  { name: "HOW TO VET Vendor", type: "word" },
  { name: "HOW APP Looks for Vendor and Customer", type: "word" },
  { name: "legal-clinic-outreach-emails-FINAL.docx", type: "word" },
  { name: "YUGY-PROVISIONAL-PATENT-APPLICATION.docx", type: "word" },
  { name: "YUGY-VENDOR-AGREEMENT-UPDATED.docx", type: "word" },
  { name: "YUGY-VENDOR-VETTING-STRATEGY-UPDATED.docx", type: "word" },
];

const progress = [
  { label: "Wireframes · Customer", current: 39, total: 39 },
  { label: "Wireframes · Vendor", current: 43, total: 43 },
  { label: "Legal Pages", current: 3, total: 3 },
  { label: "Backend · Database", current: 0, total: 15 },
  { label: "Backend · Auth", current: 0, total: 5 },
  { label: "Backend · Payments", current: 0, total: 8 },
  { label: "Customer App Screens", current: 0, total: 39 },
  { label: "Vendor App Screens", current: 0, total: 43 },
  { label: "Testing", current: 0, total: 10 },
];

// ─── Page ───
export default function Dashboard() {
  const launchDays = daysUntil("2026-05-03");

  return (
    <div className="min-h-screen">
      {/* NAV */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--bg)]/80 border-b border-[var(--card-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold tracking-tighter" style={{ color: "var(--violet)" }}>YUGY</span>
            <span className="text-[var(--text-dim)] text-sm font-light">Mission Control</span>
          </div>
          <Clock />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* STATUS CARDS */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card label="Wireframes" value="82/82" done />
          <Card label="Documents" value="23" sub="Word & Excel files" />
          <Card label="App Screens" value="0/82" sub="Starting soon" />
          <Card label="Days to Launch" value={String(launchDays)} sub="May 3, 2026" />
          <Card label="Budget" value="$0 spent" sub="$152 pending" />
        </section>

        {/* ACTIVE TASKS + DEADLINES */}
        <section className="grid lg:grid-cols-2 gap-6">
          {/* Tasks */}
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-dim)] mb-4">Active Tasks</h2>
            <div className="space-y-3">
              {tasks.map((t) => (
                <div key={t.name} className="flex items-center justify-between py-2 border-b border-[var(--card-border)] last:border-0">
                  <span className={`text-sm ${t.priority === "done" ? "text-[var(--text-dim)] line-through" : ""}`}>{t.name}</span>
                  <PriorityBadge p={t.priority} />
                </div>
              ))}
            </div>
          </div>

          {/* Deadlines */}
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-dim)] mb-4">Upcoming Deadlines</h2>
            <div className="space-y-3">
              {deadlines.map((d) => {
                const days = daysUntil(d.date);
                const dateLabel = new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                return (
                  <div key={d.name} className={`flex items-center justify-between py-2 border-b border-[var(--card-border)] last:border-0 ${d.urgent ? "bg-red-500/5 -mx-3 px-3 rounded" : ""}`}>
                    <div className="flex items-center gap-2">
                      {d.urgent && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                      <span className={`text-sm ${d.name === "🚀 LAUNCH" ? "font-bold text-[var(--violet)]" : ""}`}>{d.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[var(--text-dim)] font-mono">{dateLabel}</span>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded ${days <= 7 ? "text-red-400 bg-red-500/15" : days <= 30 ? "text-yellow-400 bg-yellow-500/15" : "text-[var(--text-dim)] bg-[var(--card-border)]"}`}>
                        {days}d
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SPENDING + DOCUMENTS */}
        <section className="grid lg:grid-cols-2 gap-6">
          {/* Spending */}
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-dim)] mb-4">Spending Tracker</h2>
            <div className="space-y-3">
              {spending.map((s) => (
                <div key={s.item} className="flex items-center justify-between py-2 border-b border-[var(--card-border)] last:border-0">
                  <span className="text-sm">{s.item}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono">{s.cost}</span>
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--card-border)] flex justify-between text-sm">
              <div><span className="text-[var(--text-dim)]">Monthly:</span> <span className="font-semibold">$14</span></div>
              <div><span className="text-[var(--text-dim)]">One-time:</span> <span className="font-semibold">$134</span></div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-dim)] mb-4">Documents</h2>
            <div className="space-y-2">
              {documents.map((d) => (
                <div key={d.name} className="flex items-center gap-2 py-1.5">
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${d.type === "excel" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}`}>
                    {d.type === "excel" ? "XLS" : "DOC"}
                  </span>
                  <span className="text-sm text-[var(--text-dim)]">{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BUILD PROGRESS */}
        <section className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-dim)] mb-6">Build Progress</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
            {progress.map((p) => (
              <ProgressBar key={p.label} {...p} />
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[var(--card-border)] py-6 text-center text-xs text-[var(--text-dim)]">
        Powered by Mars 🔴🐒 · yugy.us · Auto-updated
      </footer>
    </div>
  );
}
