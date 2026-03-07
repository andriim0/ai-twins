export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FUNNEL_STEPS } from "@/features/funnel/config/ai-twin.config";

const BADGE_COLORS: Record<string, string> = {
  quiz_start: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  quiz_submit: "bg-violet-500/40 text-violet-200 border-violet-500/50",
  step_viewed: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  step_back: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  email_page_viewed: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  email_submitted: "bg-sky-500/40 text-sky-200 border-sky-500/50",
  email_validation_error: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  chat_opened: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  message_sent: "bg-emerald-500/30 text-emerald-200 border-emerald-500/40",
  analysis_shown: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  analysis_dismissed: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  paywall_view: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  paywall_plan_clicked: "bg-pink-500/40 text-pink-200 border-pink-500/50",
};

async function getEventStats() {
  const counts = await prisma.event.groupBy({
    by: ["type"],
    _count: { type: true },
  });
  return Object.fromEntries(counts.map((c) => [c.type, c._count.type]));
}

export default async function DebugEventsPage() {
  const [events, stats] = await Promise.all([
    prisma.event.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { session: { select: { email: true } } },
    }),
    getEventStats(),
  ]);

  const funnelSteps = [
    "quiz_start",
    "quiz_submit",
    "email_submitted",
    "chat_opened",
    "analysis_shown",
    "paywall_view",
  ];

  return (
    <div className="min-h-screen bg-[oklch(0.1_0.02_280)] p-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Event Debug</h1>
          <p className="text-white/40 mt-1">
            Last 200 events · {events.length} shown
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-white/60 text-sm uppercase tracking-wider">
            Funnel
          </h2>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
            {funnelSteps.map((step) => (
              <div
                key={step}
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-1"
              >
                <p className="text-white font-bold text-2xl">
                  {stats[step] ?? 0}
                </p>
                <p className="text-white/40 text-xs">
                  {step.replace(/_/g, " ")}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/50">Event</TableHead>
                <TableHead className="text-white/50">User</TableHead>
                <TableHead className="text-white/50">Email</TableHead>
                <TableHead className="text-white/50">Platform</TableHead>
                <TableHead className="text-white/50">Time on Step</TableHead>
                <TableHead className="text-white/50">Payload</TableHead>
                <TableHead className="text-white/50">When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow
                  key={event.id}
                  className="border-white/5 hover:bg-white/5"
                >
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        BADGE_COLORS[event.type] ??
                        "bg-white/10 text-white/60 border-white/20"
                      }
                    >
                      {event.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white/40 text-xs font-mono">
                    {event.userId.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="text-white/60 text-xs">
                    {event.session?.email ?? "—"}
                  </TableCell>
                  <TableCell className="text-white/40 text-xs">
                    {event.platform ?? "—"}
                  </TableCell>
                  <TableCell className="text-white/40 text-xs">
                    {event.timeOnStep
                      ? `${(event.timeOnStep / 1000).toFixed(1)}s`
                      : "—"}
                  </TableCell>
                  <TableCell className="text-white/30 text-xs font-mono max-w-xs truncate">
                    {event.payload ? JSON.stringify(event.payload) : "—"}
                  </TableCell>
                  <TableCell className="text-white/30 text-xs whitespace-nowrap">
                    {new Date(event.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
