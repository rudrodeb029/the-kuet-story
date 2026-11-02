import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useTransition } from "react";
import {
  Heart,
  Calendar,
  Clock,
  Smartphone,
  Monitor,
  RefreshCw,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Sparkles,
} from "lucide-react";
import {
  fetchProposalReplies,
  deleteProposalReply,
  type ProposalReply,
} from "../lib/proposal-api";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel · The KUET Story" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPanel,
});

function AdminPanel() {
  const [replies, setReplies] = useState<ProposalReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isPending, startTransition] = useTransition();

  // Simple PIN protection (default: 2026 or 1234)
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    const savedPin = sessionStorage.getItem("kuet_admin_auth");
    if (savedPin === "unlocked") {
      setIsUnlocked(true);
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 2026 or kuet
    if (pinInput.trim() === "2026" || pinInput.trim().toLowerCase() === "kuet") {
      setIsUnlocked(true);
      sessionStorage.setItem("kuet_admin_auth", "unlocked");
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const loadData = async () => {
    try {
      setError(null);
      const data = await fetchProposalReplies();
      setReplies(data);
      setLastRefreshed(new Date());
    } catch (err: any) {
      setError("ডেটা লোড করতে সমস্যা হয়েছে: " + (err?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      void loadData();
    }
  }, [isUnlocked]);

  // Auto-refresh interval
  useEffect(() => {
    if (!isUnlocked || !autoRefresh) return;
    const interval = setInterval(() => {
      void loadData();
    }, 10000);
    return () => clearInterval(interval);
  }, [isUnlocked, autoRefresh]);

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত এই রিপ্লাইটি মুছে ফেলতে চান?")) return;
    startTransition(async () => {
      const ok = await deleteProposalReply(id);
      if (ok) {
        setReplies((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert("মুছে ফেলা সম্ভব হয়নি। আবার চেষ্টা করুন।");
      }
    });
  };

  const yesCount = replies.filter((r) => r.replyType === "YES").length;
  const noCount = replies.filter((r) => r.replyType === "NO_ATTEMPT").length;

  if (!isUnlocked) {
    return (
      <main className="min-h-screen bg-sky flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-card/95 border border-border backdrop-blur-md rounded-3xl p-8 shadow-card text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">এডমিন প্যানেল</h1>
          <p className="text-sm text-muted-foreground mb-6">
            লাস্ট পেজের প্রস্তাবের রিপ্লাই এবং সময় দেখতে পিন কোড দিন (ডিফল্ট: <span className="font-semibold text-primary">2026</span>)
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="পিন কোড লিখুন..."
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className={`w-full text-center tracking-widest text-lg font-mono px-4 py-3 rounded-xl border bg-background text-foreground outline-none transition-all ${
                  pinError
                    ? "border-destructive focus:ring-2 focus:ring-destructive/30"
                    : "border-border focus:ring-2 focus:ring-primary/30"
                }`}
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-destructive mt-2">
                  ভুল পিন কোড! সঠিক পিন হলো: <span className="font-bold">2026</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-yes text-primary-foreground font-semibold rounded-xl shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              আনলক করুন 🔓
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-border/60">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <BookOpen className="w-4 h-4" /> গল্পের বইয়ে ফিরে যান
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-sky p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Navigation */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card/90 border border-border backdrop-blur-md rounded-3xl p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                প্রস্তাবের রিপ্লাই প্যানেল 💌
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                The KUET Story · সর্বশেষ রিয়েল-টাইম রেসপন্স ট্র্যাকার
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => void loadData()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              রিফ্রেশ
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:bg-accent transition-colors"
            >
              <BookOpen className="w-4 h-4" /> মূল গল্প দেখুন
            </Link>

            <button
              onClick={() => {
                sessionStorage.removeItem("kuet_admin_auth");
                setIsUnlocked(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              title="লক করুন"
            >
              <Lock className="w-3.5 h-3.5" /> লক
            </button>
          </div>
        </header>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card/90 border border-border/80 backdrop-blur-md rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                মোট প্রস্তাব গ্রহণ (হ্যাঁ!)
              </span>
              <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-950/40 text-pink-600 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-current" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-foreground">{yesCount}</span>
              <span className="text-xs text-pink-600 font-medium">ভালোবাসার সম্মতি ❤️</span>
            </div>
          </div>

          <div className="bg-card/90 border border-border/80 backdrop-blur-md rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                উঁহু বাটনে টাচ / ডজ
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-foreground">{noCount}</span>
              <span className="text-xs text-amber-600 font-medium">অভিমান / পলায়নের চেষ্টা 💔</span>
            </div>
          </div>

          <div className="bg-card/90 border border-border/80 backdrop-blur-md rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                সর্বশেষ আপডেট
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-sm font-semibold text-foreground block truncate">
                {lastRefreshed.toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
              <span className="text-xs text-muted-foreground">১০ সেকেন্ড পরপর অটো-চেক</span>
            </div>
          </div>
        </div>

        {/* Replies List Table / Cards */}
        <section className="bg-card/95 border border-border backdrop-blur-md rounded-3xl p-6 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">প্রাপ্ত রেসপন্সের তালিকা</h2>
              <p className="text-xs text-muted-foreground">
                প্রতিটি ক্লিকে সাথে সাথে তারিখ, সময় ও ডিভাইসের বিবরণ সংরক্ষিত হয়
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground select-none">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded accent-primary"
              />
              অটো-রিফ্রেশ চালু রাখুন
            </label>
          </div>

          {loading ? (
            <div className="py-16 text-center text-muted-foreground">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />
              <p className="text-sm">ডাটাবেজ থেকে রেসপন্স লোড হচ্ছে...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-destructive">
              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">{error}</p>
            </div>
          ) : replies.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground/60">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-foreground">এখনো কোনো রেসপন্স আসেনি</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                যখন সে শেষ পেজের "হ্যাঁ! ❤️" বাটনে ক্লিক করবে, সাথে সাথে এখানে সময় ও তারিখসহ দেখা যাবে!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {replies.map((item, index) => {
                const isYes = item.replyType === "YES";
                const dateObj = new Date(item.timestamp);
                const isRecent = Date.now() - dateObj.getTime() < 1000 * 60 * 60 * 24; // within 24 hours

                return (
                  <div
                    key={item.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border transition-all ${
                      isYes
                        ? "bg-pink-50/70 dark:bg-pink-950/20 border-pink-200 dark:border-pink-900/50 shadow-sm"
                        : "bg-muted/40 border-border"
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                          isYes
                            ? "bg-pink-600 text-white shadow-md shadow-pink-500/20"
                            : "bg-amber-500 text-white"
                        }`}
                      >
                        {isYes ? <Heart className="w-6 h-6 fill-current" /> : <AlertCircle className="w-6 h-6" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              isYes
                                ? "bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300"
                                : "bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300"
                            }`}
                          >
                            {item.reply}
                          </span>
                          {index === 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300">
                              সর্বশেষ রেসপন্স ✨
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {item.note ?? (isYes ? "প্রস্তাব গৃহীত!" : "উঁহু ক্লিক চেষ্টা")}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-4 text-xs text-muted-foreground pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
                      <div className="space-y-1 text-left sm:text-right">
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>{item.formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          {item.device.includes("Mobile") ? (
                            <Smartphone className="w-3.5 h-3.5" />
                          ) : (
                            <Monitor className="w-3.5 h-3.5" />
                          )}
                          <span>{item.device}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => void handleDelete(item.id)}
                        disabled={isPending}
                        className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40"
                        title="এই এন্ট্রি মুছে ফেলুন"
                        aria-label="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

