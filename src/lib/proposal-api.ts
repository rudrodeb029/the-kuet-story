const FIRESTORE_API_KEY = "AIzaSyBYGge8UGwf7zDo4AozKcCI3WF9iV30ZOE";
const FIRESTORE_PROJECT_ID = "mrdigifibackend";
const COLLECTION_URL = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/proposal_replies`;

export interface ProposalReply {
  id: string;
  reply: string;
  replyType: "YES" | "NO_ATTEMPT";
  timestamp: string;
  formattedDate: string;
  device: string;
  note?: string;
  userAgent?: string;
}

export async function recordProposalReply(
  replyType: "YES" | "NO_ATTEMPT",
  customText?: string
): Promise<boolean> {
  try {
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat("bn-BD", {
      dateStyle: "full",
      timeStyle: "medium",
      timeZone: "Asia/Dhaka",
    }).format(now);

    const isMobile =
      typeof window !== "undefined"
        ? /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 768
        : false;

    const device =
      typeof window !== "undefined"
        ? `${isMobile ? "📱 Mobile" : "💻 PC"} (${window.innerWidth}x${window.innerHeight})`
        : "Unknown Device";

    const replyText =
      customText ??
      (replyType === "YES" ? "হ্যাঁ! ❤️" : "উঁহু 💔 (ক্লিক করার চেষ্টা করেছে কিন্তু বাটন পালিয়ে গেছে)");

    const body = {
      fields: {
        reply: { stringValue: replyText },
        replyType: { stringValue: replyType },
        timestamp: { stringValue: now.toISOString() },
        formattedDate: { stringValue: formattedDate },
        device: { stringValue: device },
        note: {
          stringValue:
            replyType === "YES"
              ? "প্রস্তাব গ্রহণ করা হয়েছে! 🥰🎉"
              : "উঁহু বাটনে মাউস নেওয়া হয়েছিল বা স্পর্শ করা হয়েছিল।",
        },
        userAgent: {
          stringValue: typeof navigator !== "undefined" ? navigator.userAgent : "",
        },
      },
    };

    const res = await fetch(`${COLLECTION_URL}?key=${FIRESTORE_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return res.ok;
  } catch (error) {
    console.error("Failed to record proposal reply:", error);
    return false;
  }
}

export async function fetchProposalReplies(): Promise<ProposalReply[]> {
  try {
    const res = await fetch(`${COLLECTION_URL}?key=${FIRESTORE_API_KEY}`);
    if (!res.ok) return [];

    const data = await res.json();
    if (!data.documents || !Array.isArray(data.documents)) return [];

    const replies: ProposalReply[] = data.documents.map((doc: any) => {
      const docName = doc.name ?? "";
      const id = docName.split("/").pop() ?? "";
      const fields = doc.fields ?? {};

      return {
        id,
        reply: fields.reply?.stringValue ?? "কোনো তথ্য নেই",
        replyType: (fields.replyType?.stringValue as "YES" | "NO_ATTEMPT") ?? "YES",
        timestamp: fields.timestamp?.stringValue ?? doc.createTime ?? new Date().toISOString(),
        formattedDate: fields.formattedDate?.stringValue ?? new Date(doc.createTime).toLocaleString(),
        device: fields.device?.stringValue ?? "Unknown",
        note: fields.note?.stringValue,
        userAgent: fields.userAgent?.stringValue,
      };
    });

    // Sort newest first
    replies.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return replies;
  } catch (error) {
    console.error("Failed to fetch replies:", error);
    return [];
  }
}

export async function deleteProposalReply(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${COLLECTION_URL}/${id}?key=${FIRESTORE_API_KEY}`, {
      method: "DELETE",
    });
    return res.ok;
  } catch (error) {
    console.error("Failed to delete proposal reply:", error);
    return false;
  }
}

