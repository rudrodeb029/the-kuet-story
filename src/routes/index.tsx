import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type AnimationEvent, type MouseEvent } from "react";
import confetti from "canvas-confetti";
import { recordProposalReply } from "../lib/proposal-api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "তোমার জন্য কিছু কথা ✨" },
      { name: "description", content: "একটি ছোট্ট ভালোবাসার গল্প — শুধু তোমার জন্য।" },
      { property: "og:title", content: "তোমার জন্য কিছু কথা ✨" },
      { property: "og:description", content: "একটি ছোট্ট ভালোবাসার গল্প — শুধু তোমার জন্য।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Story,
});

type Effect = "burst" | "glow" | "likes" | "shake" | "none";
type Scene = {
  icon: string;
  chapterWord: string;
  title: string;
  leftProse: string;
  dropCap: string;
  text: string;
  effect: Effect;
  hint?: string;
};

const scenes: Scene[] = [
  {
    icon: "💌",
    chapterWord: "Prologue",
    title: "A Few Words For You...",
    leftProse:
      "“Some feelings can never be fully spoken aloud. A quiet hesitation, a little fear of losing what we have... Today, I unfold these cherished memories just for you.”",
    dropCap: "জা",
    text: "নো পূজা, তোমাকে এই কথাগুলো অনেক দিন ধরেই মন খুলে বলতে চেয়েছিলাম। স্ক্রিনের ওপর বা পাতার কোণে আলতো ক্লিক করো—প্রতিটি পাতা উল্টে যাবে আমাদের সেই ফেলে আসা দিনগুলোর দিকে।",
    effect: "burst",
  },
  {
    icon: "🏫",
    chapterWord: "Chapter One",
    title: "The KUET Days & That Sweet Mole",
    leftProse:
      "“We only met for a handful of days on the KUET campus, yet your bright eyes and gentle laughter lingered in my mind. You smiled and corrected me—‘Not on my cheek, it’s on my nose!’ That little moment still brings a warm smile to my face.”",
    dropCap: "শু",
    text: "রুটা হয়েছিল আমাদের KUET ক্যাম্পাসে। কোর্সের ওই অল্প কিছুদিনেই তোমার সাথে একটু পরিচয়। পরে তোমার হোয়াটসঅ্যাপে ঘিবলি আর্টের ছবিটা দেখে বলেছিলাম—চেহারাটা কেমন যেন আবছা মনে পড়ে, তবে গালে একটা মিষ্টি তিল ছিল। তুমি তখন হেসে শুধরে দিয়েছিলে—'গালে না, নাকে!' সত্যি বলতে, তোমার সেই হাসিমাখা কথাটাই আমার মনের ভেতর এখনো গেঁথে আছে।",
    effect: "burst",
  },
  {
    icon: "🌸",
    chapterWord: "Chapter Two",
    title: "Unspoken Care in Dark Days",
    leftProse:
      "“When Dengue left me weak and broken in Khulna, you simply said—‘Take your medicine, rest well, work can wait.’ You might never know how much courage and healing those few quiet words gave me.”",
    dropCap: "ম",
    text: "নে আছে যখন খুলনায় আমার মারাত্মক ডেঙ্গু হলো? শরীর প্রচণ্ড দুর্বল, ওজন কমে একদম শেষ, সব কাজকর্ম আর পড়াশোনা বন্ধ। তখন তুমি মেসেজে বলেছিলে—'ওষুধ ঠিকমতো খেয়ো, রেস্ট নাও, কাজ পরে হবে নে রে। Take rest!' সেই সামান্য কয়েকটা সাধারণ কথায় যে আমার জন্য কত বড় সান্ত্বনা লুকিয়ে ছিল, তুমি হয়তো ভাবতেও পারবে না। তোমার ওই এক চিলতে যত্নই আমাকে দ্রুত সুস্থ হতে সাহায্য করেছিল।",
    effect: "glow",
  },
  {
    icon: "💍",
    chapterWord: "Chapter Three",
    title: "An Honest Confession of the Heart",
    leftProse:
      "“I wanted to be completely honest with you—not for a fleeting romance, but as a partner for a lifetime. You appreciated my honesty with such grace, even while gently holding onto our friendship.”",
    dropCap: "সু",
    text: "স্থ হয়ে সাহস করে তোমাকে সোজাসুজি জানিয়েছিলাম—'তোমাকে কিন্তু আমি কোনো টাইমপাস প্রেম করার মতো নয়, সারা জীবনের জন্য বিয়ে করার মতো পছন্দ করি।' জীবনে একটু উচ্চাকাঙ্ক্ষী আমি, নিজের পায়ে শক্ত হয়ে দাঁড়িয়ে প্রিয় মানুষের সব দায়িত্ব নিতে চেয়েছি। তুমি কত সুন্দর আর সম্মান দিয়ে বলেছিলে—'তোমার কথাগুলো পড়ে ভালো লেগেছে, কারণ তুমি খুব সম্মান দিয়ে বলেছো।' কিন্তু শেষে একটা বন্ধুত্বের গণ্ডি টেনে দিলে!",
    effect: "glow",
  },
  {
    icon: "💬",
    chapterWord: "Chapter Four",
    title: "Begins with You, Ends with You",
    leftProse:
      "“You teased me about your future husband—‘Rich, respectful, hygienic, doting, begins with me and ends with me!’ And when you joked that I’d block my wife if she didn’t reply, I silently knew—if it’s you, I would search the whole world to bring you home.”",
    dropCap: "তো",
    text: "মার মনে আছে সেই মজার কথাগুলো? যখন জিজ্ঞেস করলাম কেমন বর চাও, তুমি বলেছিলে—'Rich, respectful, hygienic, doting, আমাতেই শুরু, আমাতেই শেষ!' আর আমার একটু দেরিতে রিপ্লাইয়ের ক্ষোভ দেখে তুমি হাসতে হাসতে বললে—'শুভ্র, তোমার বউ বাপের বাড়ি গিয়ে ফোন না ধরলে তুমি তো তাকেও ব্লক করে দিবা!' আমি মনে মনে তখনই ভেবে নিয়েছিলাম—আমার বউটা যদি তুমি হও, তবে তো চিরুনি তল্লাশি দিয়ে হলেও খুঁজে আনব, তোমাকে ছাড়া কি আমার চলবে?!",
    effect: "likes",
  },
  {
    icon: "📱",
    chapterWord: "Chapter Five",
    title: "Chasing Dreams & Quiet Struggles",
    leftProse:
      "“Building apps late into the night, rushing through the dust of Dhaka only to find the exam cancelled... Through every struggle, your genuine words—‘Hats off to you guys!’—made every bit of hard work worthwhile.”",
    dropCap: "এ",
    text: "কদিকে আমার অ্যাপ আর ম্যাথ পাজল গেম নিয়ে দিনরাত এক করে কাজ করা, আর অন্যদিকে ঢাকায় যুব উন্নয়ন পরীক্ষার সেই ধকল! সারা দিন ধুলোবালি খেয়ে গিয়ে দেখি প্রশ্ন ফাঁস, পরীক্ষা বাতিল। যখন তোমাকে জানালাম, তুমি সহানুভূতি জানালে। আমার বানানো অ্যাপগুলো দেখে তুমি অবাক হয়ে বলেছিলে—'আমি একটা কাজই পারি না, আর তোমরা দুই-তিনটা কাজ একসাথে করো, hats off!' তোমার ওই ছোট্ট প্রশংসাটুকুও আমার জন্য অনেক স্পেশাল ছিল।",
    effect: "likes",
  },
  {
    icon: "💔",
    chapterWord: "Chapter Six",
    title: "The Hurt, The Fear & The Block",
    leftProse:
      "“Being an introvert, late replies felt like silent rejection, and I grew terrified that caring too much would end in heartbreak. When I begged you to block me, it was never anger—it was just a desperate heart scared of losing you.”",
    dropCap: "আ",
    text: "মি মানুষটা বড্ড ইন্ট্রোভার্ট। মন থেকে কাউকে ভালোবাসলে তার একটু দেরিতে রিপ্লাই আসলেও বুকটা অস্থির হয়ে উঠত। আর ভেতরে ভয় কাজ করত—কথা বলতে বলতে মায়া বাড়লে পরে যদি ছেড়ে যাও? তাই অভিমানে আর যন্ত্রণায় পাগল হয়ে বারবার বললাম—'আমাকে সব জায়গা থেকে ব্লক করে দাও, তুমি আমার মানসিক যন্ত্রণা হয়ে যাচ্ছো।' ওটা রাগ ছিল না পূজা, ওটা ছিল তোমাকে হারানোর ভয়ে এক বুক অভিমান আর অসহায় ভালোবাসা।",
    effect: "shake",
  },
  {
    icon: "💖",
    chapterWord: "Chapter Seven",
    title: "Will You Be Mine?",
    leftProse:
      "“Leaving all fears, unspoken tears, and distance behind... You once asked if becoming special was truly that simple. It never was, Puja. But since that first day, my heart has belonged only to you. Will you walk this life with me?”",
    dropCap: "পূ",
    text: "জোর সেই দিনগুলোতে ভাইকে বাঁচাতে গিয়ে হাত কেটে ফেলা, কিংবা বিজয়ার সকালে জানতে চাওয়া—আমাদের কি নতুন শুরু হতে পারে? তুমি বলেছিলে এসব হাবাজাবি বাদ দিয়ে পুজো উপভোগ করতে। কিন্তু তোমায় ছাড়া আমার মন যে আর কিছুতেই বসে না! তুমি বলেছিলে—'Special মানুষ চাইলাম আর হয়ে গেলাম এতো সহজ!?' সহজ নয় জানি, তবে KUET-এর সেই দিন থেকে আজও আমার মনের পুরোটা জুড়ে শুধুই তুমি। আমি সাধারণ কোনো বন্ধু নয়, তোমার সেই 'আমাতেই শুরু, আমাতেই শেষ' মানুষটা হতে চাই। তুমি কি আমার বাকি জীবনের বেঁচে থাকার একমাত্র অনুপ্রেরণা হবে? 🥰",
    effect: "none",
  },
];

type Particle = {
  id: number;
  x: number;
  y: number;
  e: string;
  dx: number;
  rot: number;
  size: number;
};
type Soundscape = {
  context: AudioContext;
  master: GainNode;
  limiter: DynamicsCompressorNode;
};

function playTone(
  soundscape: Soundscape,
  frequency: number,
  startAt: number,
  duration: number,
  volume: number,
  type: OscillatorType = "sine",
  attack = 0.12,
) {
  const { context, master } = soundscape;
  const oscillator = context.createOscillator();
  const envelope = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startAt);
  envelope.gain.setValueAtTime(0.0001, startAt);
  envelope.gain.exponentialRampToValueAtTime(volume, startAt + attack);
  envelope.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  oscillator.connect(envelope);
  envelope.connect(master);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.05);
}

function Story() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [glow, setGlow] = useState(0);
  const [shake, setShake] = useState(0);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const [pageTurn, setPageTurn] = useState<"idle" | "out" | "in">("idle");
  const [coverOpen, setCoverOpen] = useState(true);
  const [coverOpening, setCoverOpening] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const isTransitioning = useRef(true);
  const soundOnRef = useRef(true);
  const soundscapeRef = useRef<Soundscape | null>(null);
  const lastNoSoundRef = useRef(0);
  const idRef = useRef(0);

  useEffect(() => {
    return () => {
      const soundscape = soundscapeRef.current;
      if (!soundscape) return;
      void soundscape.context.close();
    };
  }, []);

  const getSoundscape = () => {
    if (!soundOnRef.current) return;

    let soundscape = soundscapeRef.current;
    if (!soundscape) {
      const context = new AudioContext();
      const master = context.createGain();
      const limiter = context.createDynamicsCompressor();
      master.gain.value = 0.85;
      limiter.threshold.value = -12;
      limiter.knee.value = 0;
      limiter.ratio.value = 12;
      limiter.attack.value = 0.003;
      limiter.release.value = 0.15;
      master.connect(limiter);
      limiter.connect(context.destination);
      soundscape = { context, master, limiter };
      soundscapeRef.current = soundscape;
    }

    if (soundscape.context.state === "suspended") {
      void soundscape.context.resume().catch((error: unknown) => {
        console.error("Could not enable story sounds.", error);
        soundOnRef.current = false;
        setSoundOn(false);
      });
    }

    return soundscape;
  };

  const playClickSound = () => {
    const soundscape = getSoundscape();
    if (!soundscape) return;
    const play = () => {
      if (!soundOnRef.current || soundscape.context.state !== "running") return;
      const time = soundscape.context.currentTime;
      playTone(soundscape, 880, time, 0.22, 0.18, "sine", 0.015);
      playTone(soundscape, 1174.66, time + 0.055, 0.28, 0.14, "sine", 0.02);
    };
    if (soundscape.context.state === "running") {
      play();
    } else {
      void soundscape.context
        .resume()
        .then(play)
        .catch((error: unknown) => {
          console.error("Could not play the click sound.", error);
        });
    }
  };

  const playSceneSound = (sceneIndex: number) => {
    const soundscape = getSoundscape();
    if (!soundscape) return;
    if (soundscape.context.state === "suspended") {
      void soundscape.context
        .resume()
        .then(() => playSceneSound(sceneIndex))
        .catch((error: unknown) => {
          console.error("Could not play the story sound.", error);
        });
      return;
    }
    if (soundscape.context.state !== "running") return;

    const notes = [
      [659.25, 783.99, 1046.5],
      [523.25, 659.25, 783.99],
      [587.33, 698.46, 880],
      [783.99, 987.77, 1174.66],
      [659.25, 880, 1046.5],
      [523.25, 659.25, 880],
      [392, 466.16, 587.33],
      [523.25, 659.25, 783.99, 1046.5],
    ];
    const chord = notes[sceneIndex] ?? [523.25, 659.25, 783.99, 1046.5];
    const now = soundscape.context.currentTime;
    chord.forEach((note, index) => {
      playTone(soundscape, note, now + index * 0.1, 0.65, 0.15, "sine", 0.025);
    });
  };

  const playHeartbeat = () => {
    const soundscape = soundscapeRef.current;
    if (!soundOnRef.current || soundscape?.context.state !== "running") return;

    const beatStart = soundscape.context.currentTime;
    playTone(soundscape, 92, beatStart + 0.15, 0.14, 0.32, "triangle", 0.012);
    playTone(soundscape, 68, beatStart + 0.45, 0.18, 0.26, "triangle", 0.012);
  };

  const toggleSound = () => {
    const nextSoundOn = !soundOnRef.current;
    soundOnRef.current = nextSoundOn;
    setSoundOn(nextSoundOn);

    const soundscape = soundscapeRef.current;
    if (!nextSoundOn && soundscape) {
      const now = soundscape.context.currentTime;
      soundscape.master.gain.cancelScheduledValues(now);
      soundscape.master.gain.setTargetAtTime(0.0001, now, 0.12);
    } else if (nextSoundOn) {
      const enabledSoundscape = getSoundscape();
      if (enabledSoundscape) {
        const now = enabledSoundscape.context.currentTime;
        enabledSoundscape.master.gain.cancelScheduledValues(now);
        enabledSoundscape.master.gain.setTargetAtTime(0.85, now, 0.12);
      }
    }
  };

  const spawn = (x: number, y: number, set: string[], n = 14) => {
    const fresh = Array.from({ length: n }, () => ({
      id: idRef.current++,
      x: x + (Math.random() - 0.5) * 30,
      y,
      e: set[Math.floor(Math.random() * set.length)] ?? "❤️",
      dx: (Math.random() - 0.5) * 260,
      rot: (Math.random() - 0.5) * 120,
      size: 18 + Math.random() * 22,
    }));
    setParticles((p) => [...p, ...fresh]);
    const ids = new Set(fresh.map((f) => f.id));
    setTimeout(() => setParticles((p) => p.filter((q) => !ids.has(q.id))), 1500);
  };

  const onTap = (x: number, y: number) => {
    if (coverOpen || isTransitioning.current) return;
    const s = scenes[step]!;

    if (done || s.effect === "none") return;
    isTransitioning.current = true;
    playClickSound();
    if (s.effect === "burst") {
      spawn(x, y, ["❤️", "🌹", "✨", "💖", "🌸"]);
      if (step === 0)
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { x: x / innerWidth, y: y / innerHeight },
          colors: ["#ff7aa2", "#ffc46b", "#c18cff", "#ff4d6d"],
        });
    } else if (s.effect === "glow") {
      setGlow((g) => g + 1);
      spawn(x, y, ["🤍", "✨"], 8);
    } else if (s.effect === "likes") {
      for (let i = 0; i < 4; i++)
        spawn(
          Math.random() * innerWidth,
          innerHeight * (0.5 + Math.random() * 0.4),
          ["👍", "💙"],
          4,
        );
    } else if (s.effect === "shake") {
      setShake((k) => k + 1);
      if (navigator.vibrate) navigator.vibrate(150);
    }
    setPageTurn("out");
  };

  const openCover = () => {
    if (!coverOpen || coverOpening) return;
    playClickSound();
    setCoverOpening(true);
  };

  const handleCoverAnimationEnd = (event: AnimationEvent<HTMLButtonElement>) => {
    if (event.animationName !== "book-cover-opening") return;
    setCoverOpen(false);
    setCoverOpening(false);
    isTransitioning.current = false;
  };

  const handlePageAnimationEnd = (event: AnimationEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;

    if (pageTurn === "out" && event.animationName === "book-page-turn-out") {
      setStep((current) => Math.min(current + 1, scenes.length - 1));
      setPageTurn("in");
    } else if (pageTurn === "in" && event.animationName === "book-page-turn-in") {
      setPageTurn("idle");
      isTransitioning.current = false;
    }
  };

  const hasRecordedNoRef = useRef(false);
  const runAway = () => {
    if (!hasRecordedNoRef.current) {
      hasRecordedNoRef.current = true;
      void recordProposalReply("NO_ATTEMPT");
    }
    const now = Date.now();
    if (now - lastNoSoundRef.current > 500) {
      lastNoSoundRef.current = now;
      const soundscape = soundscapeRef.current;
      if (soundOnRef.current && soundscape?.context.state === "running") {
        playClickSound();
      }
    }
    const w = innerWidth - 140;
    const h = innerHeight - 70;
    setNoPos({ x: 20 + Math.random() * w, y: 20 + Math.random() * h });
  };

  const sayYes = () => {
    setDone(true);
    playClickSound();
    void recordProposalReply("YES");
    const end = Date.now() + 12000;
    const colors = ["#ff4d6d", "#ff8fab", "#ffc46b", "#c18cff", "#7bdff2"];
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 70, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 70, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  useEffect(() => setNoPos(null), [step]);

  const s = scenes[step]!;
  const nextScene = scenes[Math.min(step + 1, scenes.length - 1)]!;
  const illustrationChapter = step + 1;
  const leftFolioNumber = step * 2 + 1;
  const rightFolioNumber = step * 2 + 2;

  return (
    <main
      onClick={(event) => onTap(event.clientX, event.clientY)}
      className="story-page bg-sky relative flex min-h-[100svh] select-none items-center justify-center overflow-x-clip overflow-y-auto"
    >
      <FloatingHearts />

      <button
        type="button"
        aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
        aria-pressed={soundOn}
        onClick={(event) => {
          event.stopPropagation();
          toggleSound();
        }}
        className="sound-toggle fixed z-20 rounded-full border border-border bg-card/90 px-4 py-2 text-sm font-semibold text-foreground shadow-card backdrop-blur-md transition-transform hover:scale-105"
      >
        {soundOn ? "🔊 শব্দ চালু" : "🔇 শব্দ বন্ধ"}
      </button>

      {glow > 0 && <div key={glow} className="glow-flash" />}
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: p.x,
            top: p.y,
            fontSize: p.size,
            ["--dx" as string]: `${p.dx}px`,
            ["--rot" as string]: `${p.rot}deg`,
          }}
        >
          {p.e}
        </span>
      ))}

      <div
        className={`story-book relative z-10 ${coverOpen && !coverOpening ? "story-book--covered" : ""}`}
      >
        <div className="book-board-shadow" aria-hidden="true" />
        <div className="book-stack-left" aria-hidden="true" />
        <div className="book-stack-right" aria-hidden="true" />
        <div className="book-spine-crease" aria-hidden="true" />
        <div className="book-sunlight-overlay" aria-hidden="true" />

        <RomanticIllustration
          chapter={illustrationChapter}
          leftProse={s.leftProse}
          leftFolio={leftFolioNumber}
        />

        <div className={`book-copy-stage ${pageTurn === "out" ? "book-copy-stage--turning" : ""}`}>
          {pageTurn === "out" && !done && (
            <div className="book-copy-underlay" aria-hidden="true">
              <RightPageWatermark />
              <div className="book-recto-header">
                <span className="book-page-number">পরের পৃষ্ঠা · {step + 2}</span>
                <span className="book-chapter-word">{nextScene.chapterWord}</span>
              </div>
              <span className="book-next-icon">{nextScene.icon}</span>
              <h2 className="book-next-title">{nextScene.title}</h2>
              <p className="book-next-hint">গল্পটা এগিয়ে নিতে পাতাটি উল্টে দাও</p>
              <div className="book-folio-row book-folio-row--right">
                <span className="book-folio-number">{rightFolioNumber + 2}</span>
              </div>
            </div>
          )}

          {done ? (
            <section className="book-copy-page book-copy-page--success scene-arrival">
              <RightPageWatermark />
              <div className="book-recto-header">
                <span className="book-page-number">শেষ পৃষ্ঠা · ভালোবাসা রইল</span>
                <span className="book-chapter-word">Forever</span>
              </div>
              <div
                className="book-heart-finale animate-heartbeat neon"
                onAnimationStart={playHeartbeat}
                onAnimationIteration={playHeartbeat}
              >
                ❤️
              </div>
              <h1 className="book-story-title text-gradient">ইয়েয়য়য়! থ্যাঙ্ক ইউ! 🥰</h1>
              <p className="book-story-text book-story-text--dropcap">
                <span className="book-drop-cap" aria-hidden="true">
                  আ
                </span>
                মি জানতাম তুমি আমাদের গল্পটা এভাবে শেষ হতে দেবে না! এবার আর কোনো ভুল বোঝাবুঝি বা
                ব্লক নয়, আজীবন তোমার পাশে থাকার এই শুরু।
              </p>
              <p className="book-success-note">খুব তাড়াতাড়ি দেখা হচ্ছে কিন্তু! 😉💖</p>
              <div className="book-folio-row book-folio-row--right">
                <span className="book-folio-number">∞</span>
              </div>
            </section>
          ) : (
            <section
              key={`${step}-${shake}`}
              className={`book-copy-page scene-arrival ${pageTurn === "out" ? "book-copy-page--turning-out" : pageTurn === "in" ? "book-copy-page--turning-in" : ""}`}
              onAnimationStart={(event) => {
                if (
                  event.target === event.currentTarget &&
                  event.animationName === "book-page-turn-in" &&
                  pageTurn === "in"
                ) {
                  playSceneSound(step);
                }
              }}
              onAnimationEnd={handlePageAnimationEnd}
            >
              <RightPageWatermark />
              <div
                key={shake}
                className={`book-copy-content ${shake > 0 && s.effect === "shake" ? "animate-shake" : ""}`}
              >
                <div className="book-recto-header">
                  <span className="book-page-number">পৃষ্ঠা {step + 1} · আমাদের গল্প</span>
                  <span className="book-chapter-word">{s.chapterWord}</span>
                </div>

                <div className="book-title-row">
                  <span
                    className="book-chapter-icon neon animate-heartbeat"
                    onAnimationStart={playHeartbeat}
                    onAnimationIteration={playHeartbeat}
                  >
                    {s.icon}
                  </span>
                  <h1 className="book-story-title">{s.title}</h1>
                </div>

                <p className="book-story-text book-story-text--dropcap">
                  <span className="book-drop-cap" aria-hidden="true">
                    {s.dropCap}
                  </span>
                  {s.text}
                </p>

                {step === scenes.length - 1 ? (
                  <div className="book-story-actions">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        sayYes();
                      }}
                      className="bg-yes shadow-glow animate-pulse-soft min-h-10 rounded-full px-4 py-2 text-sm font-bold text-primary-foreground sm:min-h-12 sm:px-8 sm:py-3 sm:text-xl"
                    >
                      হ্যাঁ! ❤️
                    </button>
                    {!noPos && (
                      <button
                        onMouseEnter={runAway}
                        onTouchStart={(event) => {
                          event.preventDefault();
                          runAway();
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                          runAway();
                        }}
                        className="min-h-10 rounded-full border-2 border-border bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground sm:min-h-12 sm:px-6 sm:py-3 sm:text-lg"
                      >
                        উঁহু 💔
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="book-page-footer">
                    <button
                      type="button"
                      className="book-next-button"
                      aria-label={`পরের পৃষ্ঠা: ${nextScene.title}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        onTap(event.clientX, event.clientY);
                      }}
                    >
                      {step === 0 ? "গল্প শুরু করো" : "পরের পৃষ্ঠা"}
                      <span aria-hidden="true"> →</span>
                    </button>
                  </div>
                )}

                <div className="book-folio-row book-folio-row--right">
                  <span className="book-step-progress">
                    {step + 1} / {scenes.length}
                  </span>
                  <span className="book-folio-number">{rightFolioNumber}</span>
                </div>
              </div>
            </section>
          )}
        </div>
        {coverOpen && (
          <>
            <div
              className={`book-cover-pages ${coverOpening ? "book-cover-pages--opening" : ""}`}
              aria-hidden="true"
            />
            <button
              type="button"
              className={`book-cover ${coverOpening ? "book-cover--opening" : ""}`}
              aria-label="বইটি খুলে গল্প পড়ুন"
              onClick={(event) => {
                event.stopPropagation();
                openCover();
              }}
              onAnimationEnd={handleCoverAnimationEnd}
            >
              <RomanticIllustration chapter={-1} cover />
              <span className="book-cover-title">
                তোমার জন্য
                <br />
                একটি গল্প
              </span>
              <span className="book-cover-subtitle">
                যেখানে প্রতিটি পাতায় জমে আছে একটু ভালোবাসা
              </span>
              <span className="book-cover-open">
                বইটি খুলে দেখো <span aria-hidden="true">→</span>
              </span>
            </button>
          </>
        )}
      </div>

      {noPos && !done && (
        <button
          onMouseEnter={runAway}
          onTouchStart={(event) => {
            event.preventDefault();
            runAway();
          }}
          onClick={(event) => {
            event.stopPropagation();
            runAway();
          }}
          style={{ left: noPos.x, top: noPos.y }}
          className="fixed z-30 min-h-12 rounded-full border-2 border-border bg-secondary px-4 py-3 text-base font-semibold text-secondary-foreground transition-all duration-200 sm:px-6 sm:text-lg"
        >
          উঁহু 💔
        </button>
      )}
    </main>
  );
}

function RightPageWatermark() {
  return (
    <div className="book-right-watermark" aria-hidden="true">
      <img
        src="/girl-watermark.png"
        alt=""
        className="book-right-watermark-img"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

function RomanticIllustration({
  chapter,
  cover = false,
  leftProse,
  leftFolio = 1,
}: {
  chapter: number;
  cover?: boolean;
  leftProse?: string;
  leftFolio?: number;
}) {
  const chapterNames = [
    "একটি রোমান্টিক গল্প",
    "একটি চিঠি ও না-বলা কথা",
    "কুয়েট ক্যাম্পাস ও নাকে তিল",
    "অসুস্থতা আর এক ফোঁটা যত্ন",
    "মনের সত্যি কথা বলা",
    "আমাতেই শুরু, আমাতেই শেষ",
    "কোডিং, অ্যাপস আর ঢাকার লড়াই",
    "অভিমান ও না-বলা যন্ত্রণা",
    "একসাথে নতুন পথচলা",
  ];
  const chapterName = chapterNames[chapter < 0 ? 0 : chapter] ?? "আমাদের গল্পের রোমান্টিক ছবি";
  return (
    <aside className={`book-art-page ${cover ? "book-cover-art" : ""}`} aria-label={chapterName}>
      <div className="book-art-heading">
        <span className="book-running-header">একটি ছোট্ট ভালোবাসার গল্প</span>
        <span>{chapter < 0 ? "♥" : `০${chapter}`}</span>
      </div>
      <svg
        className={`book-artwork ${cover ? "book-cover-artwork" : ""}`}
        viewBox="0 0 520 520"
        preserveAspectRatio={cover ? "xMidYMid slice" : "xMidYMid meet"}
        role="img"
        aria-label={chapterName}
      >
        <defs>
          <linearGradient id={`book-sunset-${chapter}`} x1="0" x2="0.9" y1="0" y2="1">
            <stop offset="0" stopColor="#ffe2c3" />
            <stop offset="0.58" stopColor="#f8bfd0" />
            <stop offset="1" stopColor="#d8c6e8" />
          </linearGradient>
          <linearGradient id={`book-ground-${chapter}`} x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#9cc5aa" />
            <stop offset="1" stopColor="#668e83" />
          </linearGradient>
          <linearGradient id={`book-coat-${chapter}`} x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#2b8b82" />
            <stop offset="1" stopColor="#14605f" />
          </linearGradient>
          <linearGradient id={`book-dress-${chapter}`} x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#fff0d4" />
            <stop offset="1" stopColor="#e9bd91" />
          </linearGradient>
          <radialGradient id={`book-sun-glow-${chapter}`}>
            <stop stopColor="#fff7d5" stopOpacity=".95" />
            <stop offset="1" stopColor="#ffc2be" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="520" height="520" rx="24" fill={`url(#book-sunset-${chapter})`} />
        <circle cx="394" cy="106" r="115" fill={`url(#book-sun-glow-${chapter})`} />
        <circle cx="397" cy="108" r="34" fill="#fff1cd" opacity=".8" />
        <path
          d="M0 278Q100 220 205 270T420 258Q480 244 520 270V520H0Z"
          fill="#aac7ac"
          opacity=".72"
        />
        <path d="M0 336Q118 286 236 331T520 310V520H0Z" fill={`url(#book-ground-${chapter})`} />
        <path
          d="M43 0Q82 91 45 183M478 0Q421 91 476 177"
          fill="none"
          stroke="#718c73"
          strokeWidth="17"
          strokeLinecap="round"
          opacity=".65"
        />
        <path
          d="M72 92Q125 72 135 118M438 65Q386 74 374 123M86 174Q134 145 161 182M448 162Q404 132 385 173"
          fill="none"
          stroke="#718c73"
          strokeWidth="9"
          strokeLinecap="round"
          opacity=".52"
        />
        <g fill="#f3a4b1" opacity=".9">
          <circle cx="84" cy="105" r="12" />
          <circle cx="103" cy="91" r="10" />
          <circle cx="118" cy="116" r="11" />
          <circle cx="433" cy="92" r="13" />
          <circle cx="408" cy="110" r="10" />
          <circle cx="455" cy="119" r="11" />
          <circle cx="67" cy="194" r="9" />
          <circle cx="449" cy="203" r="9" />
        </g>
        {chapter === 1 && (
          <g>
            <path
              d="M120 210Q260 116 400 210V390H120Z"
              fill="#fffaf4"
              stroke="#b37c77"
              strokeWidth="12"
            />
            <path
              d="M120 215L260 320L400 215"
              fill="#f3c3cf"
              stroke="#bd8290"
              strokeWidth="10"
              strokeLinejoin="round"
            />
            <path
              d="M120 390L225 294M400 390L295 294"
              fill="none"
              stroke="#bd8290"
              strokeWidth="10"
            />
            <path d="M260 184C228 151 185 190 260 254C335 190 292 151 260 184Z" fill="#ed5d85" />
            <path
              d="M83 360Q88 319 117 312M437 352Q430 316 406 302"
              fill="none"
              stroke="#557e5e"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <circle cx="92" cy="324" r="13" fill="#e97996" />
            <circle cx="112" cy="308" r="12" fill="#f5c46e" />
            <circle cx="430" cy="316" r="13" fill="#e97996" />
            <circle cx="408" cy="300" r="12" fill="#f5c46e" />
            <text
              x="260"
              y="431"
              fill="#845369"
              fontSize="24"
              fontFamily="serif"
              textAnchor="middle"
            >
              একটি চিঠি, অনেক অনুভূতি
            </text>
          </g>
        )}
        {chapter === 2 && (
          <g>
            <path
              d="M93 366V219L260 130L427 219V366Z"
              fill="#f5e2c8"
              stroke="#9e7767"
              strokeWidth="10"
              strokeLinejoin="round"
            />
            <path
              d="M72 225L260 116L448 225"
              fill="none"
              stroke="#7e6054"
              strokeWidth="20"
              strokeLinejoin="round"
            />
            <path d="M122 255H398M122 365H398" stroke="#c58e70" strokeWidth="9" />
            <path
              d="M151 366V281Q151 245 184 245Q217 245 217 281V366M228 366V281Q228 245 261 245Q294 245 294 281V366M305 366V281Q305 245 338 245Q371 245 371 281V366"
              fill="#b68e78"
              stroke="#8c6b5d"
              strokeWidth="8"
            />
            <path
              d="M96 386H424M113 407H407"
              stroke="#ede0ca"
              strokeWidth="13"
              strokeLinecap="round"
            />
            <text
              x="260"
              y="211"
              fill="#70544b"
              fontSize="28"
              fontWeight="700"
              letterSpacing="5"
              textAnchor="middle"
            >
              KUET
            </text>
            <circle cx="115" cy="167" r="33" fill="#ffd97d" opacity=".8" />
            <path
              d="M82 385V290M438 385V290M64 385V318M456 385V318"
              stroke="#557c5c"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <circle cx="82" cy="282" r="36" fill="#719b71" />
            <circle cx="438" cy="278" r="39" fill="#719b71" />
            <path
              d="M201 385Q210 338 238 338H249V385M266 385V338H281Q311 338 319 385Z"
              fill="#397f75"
            />
            <circle cx="237" cy="321" r="17" fill="#d89462" />
            <circle cx="282" cy="321" r="17" fill="#e4ad7e" />
          </g>
        )}
        {chapter === 3 && (
          <g>
            <path
              d="M102 250Q260 75 418 250Q395 260 370 248Q345 270 316 250Q286 271 258 251Q228 270 200 250Q168 272 142 250Z"
              fill="#d87594"
              stroke="#9d536e"
              strokeWidth="10"
              strokeLinejoin="round"
            />
            <path d="M260 246L275 380Q261 395 247 380Z" fill="#8b6156" />
            <path d="M169 365Q167 318 194 292Q220 272 245 299L255 374Z" fill="#31887e" />
            <path d="M273 374Q280 307 317 293Q351 281 369 317L380 373Z" fill="#ead0b1" />
            <circle cx="207" cy="278" r="29" fill="#d99562" />
            <path d="M177 275Q174 235 214 238Q243 241 239 274Q212 257 191 284Z" fill="#573932" />
            <circle cx="328" cy="278" r="28" fill="#e7ae7d" />
            <path d="M300 270Q299 232 337 241Q363 248 353 276Q333 259 310 282Z" fill="#49352f" />
            <path d="M260 126C236 102 206 130 260 176C314 130 284 102 260 126Z" fill="#fff1df" />
            <path
              d="M243 381Q260 363 277 381"
              fill="none"
              stroke="#fff1df"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <text
              x="260"
              y="439"
              fill="#fff8eb"
              fontSize="24"
              fontFamily="serif"
              textAnchor="middle"
            >
              নীরব যত্নের ছায়া
            </text>
          </g>
        )}
        {chapter === 4 && (
          <g>
            <path
              d="M105 153Q260 87 415 153V369Q260 426 105 369Z"
              fill="#fffaf1"
              stroke="#d7aeb2"
              strokeWidth="10"
            />
            <path
              d="M139 191H371M139 219H330"
              stroke="#dbc8c4"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <path d="M260 263C223 224 170 269 260 345C350 269 297 224 260 263Z" fill="#ee5e83" />
            <path
              d="M179 354Q193 304 235 294M342 357Q325 310 286 295"
              fill="none"
              stroke="#d69a65"
              strokeWidth="13"
              strokeLinecap="round"
            />
            <path
              d="M175 354Q156 376 140 360M345 357Q365 378 382 360"
              fill="none"
              stroke="#e5b07a"
              strokeWidth="15"
              strokeLinecap="round"
            />
            <circle cx="123" cy="138" r="17" fill="#f3a5b4" />
            <circle cx="397" cy="137" r="17" fill="#f3a5b4" />
            <path d="M100 385H420" stroke="#9d7868" strokeWidth="12" strokeLinecap="round" />
            <text
              x="260"
              y="454"
              fill="#795769"
              fontSize="24"
              fontFamily="serif"
              textAnchor="middle"
            >
              মনের কথা জানালাম তোমায়
            </text>
          </g>
        )}
        {chapter === 5 && (
          <g>
            <rect x="157" y="78" width="206" height="352" rx="34" fill="#303f56" />
            <rect x="170" y="99" width="180" height="300" rx="22" fill="#f8f2eb" />
            <rect x="224" y="84" width="72" height="8" rx="4" fill="#bbc4d0" />
            <circle cx="260" cy="414" r="10" fill="#bbc4d0" />
            <path
              d="M188 144H294Q309 144 309 159V190Q309 205 294 205H231L211 220V205H188Q173 205 173 190V159Q173 144 188 144Z"
              fill="#d8e9d8"
            />
            <path
              d="M232 238H332Q347 238 347 253V285Q347 300 332 300H319V316L296 300H232Q217 300 217 285V253Q217 238 232 238Z"
              fill="#d9e7fa"
            />
            <path
              d="M192 325H287Q301 325 301 340V362Q301 377 287 377H236L216 391V377H192Q178 377 178 362V340Q178 325 192 325Z"
              fill="#d8e9d8"
            />
            <path
              d="M202 169H277M202 184H252M244 263H319M244 278H299M204 346H267M204 361H252"
              stroke="#70899b"
              strokeWidth="7"
              strokeLinecap="round"
              opacity=".55"
            />
            <path d="M327 126C314 113 298 128 327 154C356 128 340 113 327 126Z" fill="#ec6c91" />
            <text
              x="260"
              y="466"
              fill="#655c75"
              fontSize="24"
              fontFamily="serif"
              textAnchor="middle"
            >
              আমাতেই শুরু, আমাতেই শেষ
            </text>
          </g>
        )}
        {chapter === 6 && (
          <g>
            <path d="M70 410H450" stroke="#7e5f52" strokeWidth="14" strokeLinecap="round" />
            <path
              d="M120 380L140 405H380L400 380Z"
              fill="#3a4b60"
              stroke="#2c3949"
              strokeWidth="6"
              strokeLinejoin="round"
            />
            <rect x="235" y="388" width="50" height="12" rx="3" fill="#5b6c82" opacity=".8" />
            <rect
              x="145"
              y="160"
              width="230"
              height="220"
              rx="18"
              fill="#222c38"
              stroke="#1b2430"
              strokeWidth="7"
            />
            <rect x="156" y="174" width="208" height="188" rx="10" fill="#1e293b" />
            <circle cx="170" cy="188" r="4" fill="#ef4444" />
            <circle cx="182" cy="188" r="4" fill="#f59e0b" />
            <circle cx="194" cy="188" r="4" fill="#10b981" />
            <path
              d="M170 208H240M250 208H295M180 224H270M180 240H225M235 240H315M170 256H255M170 272H210M220 272H280"
              stroke="#38bdf8"
              strokeWidth="5"
              strokeLinecap="round"
              opacity=".85"
            />
            <rect x="270" y="292" width="80" height="58" rx="8" fill="#334155" stroke="#64748b" strokeWidth="2" />
            <path d="M290 321H330M310 306V336" stroke="#f472b6" strokeWidth="4" strokeLinecap="round" />
            <circle cx="310" cy="321" r="14" fill="#ec4899" opacity=".3" />
            <rect x="408" y="356" width="34" height="48" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="3" />
            <path d="M442 368Q456 380 442 392" fill="none" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
            <path d="M418 348Q422 338 420 330M428 348Q432 338 430 330" fill="none" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" opacity=".6" />
            <circle cx="118" cy="190" r="14" fill="#fef08a" opacity=".8" />
            <path d="M118 170V210M98 190H138" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
            <path d="M395 140C383 128 368 143 395 168C422 143 407 128 395 140Z" fill="#f43f5e" />
            <text
              x="260"
              y="464"
              fill="#6b534d"
              fontSize="24"
              fontFamily="serif"
              textAnchor="middle"
            >
              স্বপ্ন আর অবিরাম লড়াই
            </text>
          </g>
        )}
        {chapter === 7 && (
          <g>
            <rect
              x="88"
              y="94"
              width="344"
              height="286"
              rx="18"
              fill="#e6d9d7"
              stroke="#977f85"
              strokeWidth="10"
            />
            <path d="M260 99V375M93 237H427" stroke="#b29a9e" strokeWidth="9" />
            <path
              d="M133 120L111 159M205 118L183 157M354 120L332 159M402 174L380 213M148 273L126 312M360 279L338 318"
              stroke="#8296ad"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <rect x="184" y="174" width="152" height="217" rx="24" fill="#44546b" />
            <rect x="196" y="194" width="128" height="165" rx="15" fill="#f7eef0" />
            <path
              d="M222 240H299M222 263H282"
              stroke="#c3abb5"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path d="M260 280C238 257 210 284 260 328C310 284 282 257 260 280Z" fill="#d95d78" />
            <circle cx="260" cy="342" r="7" fill="#9ba8b5" />
            <circle cx="356" cy="157" r="42" fill="#fff0e8" stroke="#d95d78" strokeWidth="8" />
            <path d="M333 134L379 180" stroke="#d95d78" strokeWidth="10" strokeLinecap="round" />
            <text
              x="260"
              y="446"
              fill="#695a69"
              fontSize="24"
              fontFamily="serif"
              textAnchor="middle"
            >
              অভিমানও ছিল ভালোবাসা
            </text>
          </g>
        )}
        {chapter === 8 && (
          <g>
            <ellipse
              cx="260"
              cy="300"
              rx="119"
              ry="126"
              fill="none"
              stroke="#d3a64f"
              strokeWidth="28"
            />
            <ellipse
              cx="260"
              cy="300"
              rx="88"
              ry="96"
              fill="none"
              stroke="#fff0bb"
              strokeWidth="7"
            />
            <path
              d="M218 181L260 95L302 181L260 218Z"
              fill="#8bd3e8"
              stroke="#fff4d1"
              strokeWidth="8"
              strokeLinejoin="round"
            />
            <path d="M218 181H302L260 218Z" fill="#fff0bb" />
            <path
              d="M260 96V216M218 181L260 154L302 181"
              fill="none"
              stroke="#fff8e0"
              strokeWidth="6"
            />
            <path
              d="M116 374Q160 337 197 370M404 374Q360 337 323 370"
              fill="none"
              stroke="#6b8574"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="149" cy="346" r="27" fill="#e4ae7d" />
            <circle cx="371" cy="346" r="27" fill="#d99562" />
            <path
              d="M107 435Q114 372 160 374L196 434M413 435Q406 372 360 374L324 434"
              fill="#4c8f82"
            />
            <path
              d="M204 431C222 395 242 388 260 414C278 388 298 395 316 431"
              fill="none"
              stroke="#fff0bb"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <text
              x="260"
              y="480"
              fill="#735a54"
              fontSize="24"
              fontFamily="serif"
              textAnchor="middle"
            >
              একসাথে নতুন পথচলা
            </text>
          </g>
        )}
        {chapter < 0 && (
          <g>
            <path d="M114 332H413" stroke="#805543" strokeWidth="19" strokeLinecap="round" />
            <path
              d="M150 343L137 425M379 343L396 425"
              stroke="#795544"
              strokeWidth="15"
              strokeLinecap="round"
            />
            <path
              d="M157 328Q257 349 376 328"
              fill="none"
              stroke="#bc8660"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <ellipse cx="273" cy="421" rx="163" ry="22" fill="#425d57" opacity=".26" />

            <path d="M164 311Q152 357 166 410L216 414L246 344L224 309Z" fill="#555044" />
            <path d="M218 313Q213 364 235 410L281 405L279 332L251 306Z" fill="#49493f" />
            <path
              d="M179 223Q196 206 223 214Q248 215 263 241L278 322Q244 346 163 321L157 264Q158 239 179 223Z"
              fill="url(#book-coat)"
            />
            <path d="M205 222Q222 224 232 240L246 287L212 302L190 258Z" fill="#f2e7dc" />
            <path d="M173 243Q153 264 174 294L205 317L219 301L194 271L199 243Z" fill="#26786f" />
            <path d="M233 239Q264 255 290 280L281 297Q252 283 226 271Z" fill="#1e6e68" />
            <path
              d="M189 159Q181 126 205 115Q239 105 251 134L245 174Q229 190 205 177Z"
              fill="#d99656"
            />
            <path
              d="M185 151Q172 119 197 101Q220 88 243 106L252 130Q228 121 213 130Q201 144 185 151Z"
              fill="#56352f"
            />
            <path d="M218 172Q231 181 246 167L250 212Q236 224 215 213Z" fill="#cc874d" />
            <circle cx="228" cy="151" r="2.8" fill="#3b2b26" />
            <path
              d="M219 163Q228 168 236 161"
              fill="none"
              stroke="#a75450"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            <path
              d="M277 246Q294 218 326 223Q354 228 365 260L382 323Q349 342 278 322L266 277Z"
              fill="url(#book-dress)"
            />
            <path d="M297 249Q274 270 250 286L238 273Q257 246 286 230Z" fill="#f4d5ae" />
            <path d="M347 250Q375 270 359 294L331 316L317 300L339 275Z" fill="#eac49c" />
            <path d="M286 291Q317 310 352 299L386 377Q350 404 289 375L270 331Z" fill="#d9b795" />
            <path d="M280 376Q328 394 385 376L401 402Q339 429 276 404Z" fill="#c6a381" />
            <path
              d="M297 229Q279 209 287 181Q297 155 323 160Q345 164 347 190L330 228Q314 241 297 229Z"
              fill="#d9a06a"
            />
            <path
              d="M285 192Q277 165 302 149Q328 137 349 164L350 187Q336 172 318 174Q302 185 285 192Z"
              fill="#45312d"
            />
            <path d="M289 166Q270 170 277 190Q281 201 291 197Z" fill="#47312d" />
            <circle cx="316" cy="190" r="2.5" fill="#3b2b26" />
            <path
              d="M309 202Q318 207 326 201"
              fill="none"
              stroke="#a75450"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M270 286Q283 287 294 300M360 297Q346 315 328 318"
              fill="none"
              stroke="#d99656"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M291 177Q296 167 308 165"
              fill="none"
              stroke="#f4ca67"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="301" cy="166" r="7" fill="#f5d276" />
          </g>
        )}

        <g fill="#fff1dc" opacity=".95">
          <path d="M127 388q8-11 16 0q8 11 0 19q-8-8-16 0q-8-8 0-19Z" />
          <path d="M427 351q7-10 14 0q7 10 0 17q-7-7-14 0q-7-7 0-17Z" />
          <path d="M97 278q6-8 12 0q6 8 0 14q-6-6-12 0q-6-6 0-14Z" />
        </g>
        <g fill="#e77e9c">
          <circle cx="72" cy="426" r="8" />
          <circle cx="88" cy="416" r="7" />
          <circle cx="100" cy="431" r="8" />
          <circle cx="436" cy="427" r="8" />
          <circle cx="453" cy="417" r="7" />
          <circle cx="465" cy="432" r="8" />
        </g>
      </svg>
      <div className="book-left-body">
        {!cover && leftProse && <p className="book-left-prose">{leftProse}</p>}
      </div>
      {!cover && (
        <div className="book-folio-row book-folio-row--left">
          <span className="book-folio-number">{leftFolio}</span>
        </div>
      )}
    </aside>
  );
}

function FloatingHearts() {
  const risers = ["💗", "🌸", "✨", "💕", "🌷", "💖", "🌹", "🦋", "💐", "💞"];
  const swayers = ["🕊️", "🦋", "🎈", "🌸", "💌", "🌺"];
  const twinklers = ["✨", "⭐", "💫", "🌟", "❇️"];
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* rising hearts and flowers */}
      {Array.from({ length: 28 }).map((_, i) => (
        <span
          key={`r${i}`}
          className="drifter"
          style={{
            left: `${(i * 3.7 + 1.5) % 98}%`,
            fontSize: 18 + (i % 5) * 7,
            animationDuration: `${9 + (i % 6) * 2.5}s`,
            animationDelay: `${-i * 1.1}s`,
          }}
        >
          {risers[i % risers.length]}
        </span>
      ))}
      {/* gentle side-to-side floaters */}
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={`s${i}`}
          className="drifter-sway"
          style={{
            left: `${(i * 8.5 + 4) % 96}%`,
            fontSize: 20 + (i % 3) * 8,
            animationDuration: `${12 + (i % 4) * 3.5}s`,
            animationDelay: `${-i * 1.8}s`,
          }}
        >
          {swayers[i % swayers.length]}
        </span>
      ))}
      {/* twinkling sparkles in place */}
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={`t${i}`}
          className="twinkler"
          style={{
            left: `${(i * 5.7 + 2) % 97}%`,
            top: `${(i * 13 + 6) % 92}%`,
            fontSize: 15 + (i % 4) * 6,
            animationDuration: `${2 + (i % 5) * 0.7}s`,
            animationDelay: `${-i * 0.5}s`,
          }}
        >
          {twinklers[i % twinklers.length]}
        </span>
      ))}
      {/* big soft dreamy hearts */}
      {["💗", "💖", "🌸", "💞"].map((e, i) => (
        <span
          key={`b${i}`}
          className="dreamy"
          style={{
            left: `${8 + i * 26}%`,
            top: `${18 + (i % 2) * 42}%`,
            animationDuration: `${7 + i * 2}s`,
            animationDelay: `${-i * 2.5}s`,
          }}
        >
          {e}
        </span>
      ))}
    </div>
  );
}
