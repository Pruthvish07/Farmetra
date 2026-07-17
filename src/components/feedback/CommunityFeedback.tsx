import { useState, useEffect } from "react";
import { Heart, Star, Send, Loader2, MessageSquare, AlertCircle } from "lucide-react";
import { collection, query, orderBy, onSnapshot, doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../../lib/firebase";
import { useAuth } from "../../lib/AuthContext";
import { useLanguage } from "../../lib/LanguageContext";
import { cn } from "../../lib/utils";

export interface FeedbackItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  text: string;
  timestamp: number;
  likes: string[];
  adminLikes: string[];
}

export default function CommunityFeedback() {
  const { user, profile, login } = useAuth();
  const { t } = useLanguage();
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [newText, setNewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Real-time snapshot listener restricted to authenticated users
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const feedbacksCol = collection(db, "feedbacks");
    const q = query(feedbacksCol, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: FeedbackItem[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          items.push({
            id: doc.id,
            userId: data.userId || "",
            userName: data.userName || "Anonymous",
            userEmail: data.userEmail || "",
            text: data.text || "",
            timestamp: typeof data.timestamp === "number" ? data.timestamp : Date.now(),
            likes: Array.isArray(data.likes) ? data.likes : [],
            adminLikes: Array.isArray(data.adminLikes) ? data.adminLikes : [],
          });
        });
        setFeedbacks(items);
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        try {
          handleFirestoreError(err, OperationType.LIST, "feedbacks");
        } catch (typedErr: any) {
          setError("Failed to stream posts. Please check database permissions.");
        }
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newText.trim()) return;

    setSubmitting(true);
    setError(null);
    const path = "feedbacks";

    try {
      const payload = {
        userId: user.uid,
        userName: user.displayName || user.email?.split("@")[0] || "Farmer Participant",
        userEmail: user.email || "",
        text: newText.trim(),
        timestamp: Date.now(),
        likes: [],
        adminLikes: [],
      };

      await addDoc(collection(db, "feedbacks"), payload);
      setNewText("");
    } catch (err) {
      console.error("Error creating feedback doc:", err);
      try {
        handleFirestoreError(err, OperationType.CREATE, path);
      } catch (typedErr: any) {
        setError("Submit failed: permissions constraint or invalid input.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (feedbackId: string, currentLikes: string[]) => {
    if (!user) return;
    const isLiked = currentLikes.includes(user.uid);
    const updatedLikes = isLiked
      ? currentLikes.filter((uid) => uid !== user.uid)
      : [...currentLikes, user.uid];

    const path = `feedbacks/${feedbackId}`;
    try {
      const docRef = doc(db, "feedbacks", feedbackId);
      await updateDoc(docRef, { likes: updatedLikes });
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.UPDATE, path);
      } catch (typedErr) {
        setError("Unable to update like counter.");
      }
    }
  };

  const handleAdminLike = async (feedbackId: string, currentAdminLikes: string[]) => {
    if (!user || !profile || profile.role !== "Admin") return;
    const isAdminLiked = currentAdminLikes.includes(user.uid);
    const updatedAdminLikes = isAdminLiked
      ? currentAdminLikes.filter((uid) => uid !== user.uid)
      : [...currentAdminLikes, user.uid];

    const path = `feedbacks/${feedbackId}`;
    try {
      const docRef = doc(db, "feedbacks", feedbackId);
      await updateDoc(docRef, { adminLikes: updatedAdminLikes });
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.UPDATE, path);
      } catch (typedErr) {
        setError("Admin certificate application failed.");
      }
    }
  };

  const handleDelete = async (feedbackId: string) => {
    if (!user) return;
    if (!window.confirm("Delete this feedback?")) return;

    const path = `feedbacks/${feedbackId}`;
    try {
      await deleteDoc(doc(db, "feedbacks", feedbackId));
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.DELETE, path);
      } catch (typedErr) {
        setError("Delete operation rejected.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="text-left space-y-1">
        <h3 className="font-extrabold text-[#1B4332] dark:text-white text-base tracking-tight uppercase flex items-center gap-2">
          <MessageSquare size={18} className="text-emerald-500" />
          {t("communityFeedback")}
        </h3>
        <p className="text-slate-450 dark:text-slate-400 text-xs font-medium leading-normal">
          {t("feedbackSub")}
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-xs text-left">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Submission form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#111814] rounded-3xl p-4 border border-[#E5E5E5] dark:border-white/5 shadow-sm space-y-3">
        <textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder={t("writeFeedbackPlaceholder")}
          maxLength={1000}
          className="w-full text-xs font-semibold p-4 rounded-2xl border border-slate-100 dark:border-emerald-900/10 bg-slate-50/50 dark:bg-white/[0.02] outline-none focus:border-emerald-500/40 text-left min-h-[90px] text-slate-700 dark:text-white resize-none"
        />
        <div className="flex justify-between items-center bg-slate-50/30 dark:bg-white/[0.01] p-1 rounded-2xl">
          <span className="text-[10px] font-mono text-slate-400 font-bold px-3">
            {newText.length}/1000 CHARS
          </span>
          <button
            type="submit"
            disabled={submitting || !newText.trim()}
            className="bg-[#1B4332] text-white hover:bg-emerald-800 disabled:bg-slate-200 dark:disabled:bg-white/5 disabled:text-slate-400 px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow"
          >
            {submitting ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Send size={12} />
            )}
            {t("submit")}
          </button>
        </div>
      </form>

      {/* Feedbacks list */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 flex justify-center items-center">
            <Loader2 className="h-6 w-6 text-emerald-500 animate-spin" />
          </div>
        ) : feedbacks.length > 0 ? (
          feedbacks.map((item) => {
            const hasLiked = user ? item.likes?.includes(user.uid) : false;
            const hasAdminLiked = item.adminLikes && item.adminLikes.length > 0;
            const myAdminLiked = user ? item.adminLikes?.includes(user.uid) : false;
            const isMyPost = user && user.uid === item.userId;
            const isAdminUser = profile?.role === "Admin";

            return (
              <div
                key={item.id}
                className={cn(
                  "bg-white dark:bg-[#111814] rounded-[28px] p-5 border transition-all text-left space-y-4 shadow-sm",
                  hasAdminLiked
                    ? "border-amber-400/50 dark:border-amber-500/30 bg-amber-500/[0.02] dark:bg-amber-500/[0.01] shadow-amber-500/[0.02]"
                    : "border-[#E5E5E5] dark:border-white/5",
                  "hover:shadow-md"
                )}
              >
                {/* Meta details with dynamic highlight */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs uppercase shadow-sm",
                        hasAdminLiked
                          ? "bg-amber-500 text-white"
                          : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white"
                      )}
                    >
                      {item.userName.substring(0, 2)}
                    </div>
                    <div>
                      {/* Highlighted username if AdminLiked (Golden highlight or verified banner) */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "font-extrabold text-xs uppercase tracking-tight",
                            hasAdminLiked
                              ? "text-amber-600 dark:text-amber-450 font-black px-2.5 py-0.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200/40 rounded-lg shadow-inner"
                              : "text-slate-700 dark:text-white"
                          )}
                        >
                          {item.userName}
                        </span>

                        {hasAdminLiked && (
                          <span className="bg-amber-400 text-amber-950 font-black text-[7px] uppercase tracking-wider px-1.5 py-0.5 rounded-md shadow-sm border border-amber-500/10 inline-flex items-center gap-0.5 animate-pulse">
                            <Star size={7} fill="currentColor" /> {t("adminApproved")}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 block">
                        {new Date(item.timestamp).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Actions (Delete if owner/admin) */}
                  {(isMyPost || isAdminUser) && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs font-black uppercase text-red-500/65 dark:text-red-400/65 hover:text-red-500 tracking-wider hover:underline px-2 py-1"
                    >
                      Delete
                    </button>
                  )}
                </div>

                {/* Question / Feedback text */}
                <p className="text-xs font-semibold leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                  {item.text}
                </p>

                {/* Interactions buttons */}
                <div className="flex gap-4 pt-2 border-t border-slate-50 dark:border-white/5">
                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(item.id, item.likes)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                      hasLiked
                        ? "bg-red-50 dark:bg-red-500/10 text-red-650 dark:text-red-400"
                        : "bg-slate-50 dark:bg-white/5 text-slate-450 hover:bg-slate-100 dark:hover:bg-white/10"
                    )}
                  >
                    <Heart size={12} fill={hasLiked ? "currentColor" : "none"} />
                    <span>
                      {item.likes?.length || 0} {t("likes")}
                    </span>
                  </button>

                  {/* Special administrator button (visible to Admin accounts only) */}
                  {isAdminUser && (
                    <button
                      onClick={() => handleAdminLike(item.id, item.adminLikes)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border border-transparent animate-shimmer",
                        myAdminLiked
                          ? "bg-amber-400 text-amber-950 shadow-md shadow-amber-400/15"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border-dotted border-amber-400"
                      )}
                    >
                      <Star size={12} fill={myAdminLiked ? "currentColor" : "none"} />
                      <span>Admin Highlight</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center text-slate-400 text-[10px] uppercase font-black tracking-wider">
            {t("noFeedback")}
          </div>
        )}
      </div>
    </div>
  );
}
