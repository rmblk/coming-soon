import { Button } from "@base-ui/react/button";
import { Separator } from "@base-ui/react/separator";
import { animate, motion, useMotionValue, useMotionValueEvent } from "motion/react";
import { useEffect, useState } from "react";

type TypewriterTerminalProps = {
  children: string;
  output?: string[];
  title?: string;
  prompt?: string;
  speed?: number;
  startDelay?: number;
  pauseOnComplete?: number;
  loop?: boolean;
  className?: string;
  cursor?: string;
  onComplete?: () => void;
  onOutputComplete?: () => void;
  onReplay?: () => void;
};

export function TypewriterTerminal({
  children,
  output = [
    "VITE+ - The Unified Toolchain for the Web",
    "",
    "VITE+ v0.2.1",
    "",
    "➜  Local:   http://localhost:5173/",
    "➜  Network: use --host to expose",
    "➜  press h + enter to show help",
  ],
  title = "terminal",
  prompt = "$",
  speed = 42,
  startDelay = 250,
  pauseOnComplete = 1600,
  loop = false,
  className = "",
  cursor = "_",
  onComplete,
  onOutputComplete,
  onReplay,
}: TypewriterTerminalProps) {
  const text = children;
  const characterCount = useMotionValue(0);
  const [displayLength, setDisplayLength] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const [didNotifyComplete, setDidNotifyComplete] = useState(false);
  const [didNotifyOutputComplete, setDidNotifyOutputComplete] = useState(false);
  const [finishedOutputLines, setFinishedOutputLines] = useState(0);

  useMotionValueEvent(characterCount, "change", (latest) => {
    setDisplayLength(Math.round(latest));
  });

  useEffect(() => {
    characterCount.set(0);
    setDidNotifyComplete(false);
    setDidNotifyOutputComplete(false);
    setFinishedOutputLines(0);

    const controls = animate(characterCount, text.length, {
      duration: Math.max(text.length * speed, 400) / 1000,
      ease: "linear",
      delay: startDelay / 1000,
      repeat: loop ? Infinity : 0,
      repeatType: "loop",
      repeatDelay: pauseOnComplete / 1000,
    });

    return () => {
      controls.stop();
    };
  }, [characterCount, loop, pauseOnComplete, runKey, speed, startDelay, text.length]);

  const typedText = text.slice(0, Math.min(displayLength, text.length));
  const isComplete = displayLength >= text.length;

  useEffect(() => {
    if (!isComplete || didNotifyComplete) {
      return;
    }

    setDidNotifyComplete(true);
    onComplete?.();
  }, [didNotifyComplete, isComplete, onComplete]);

  useEffect(() => {
    if (!isComplete || didNotifyOutputComplete) {
      return;
    }

    const completedLineCount = output.filter(Boolean).length;

    if (completedLineCount === 0 || finishedOutputLines < completedLineCount) {
      return;
    }

    setDidNotifyOutputComplete(true);
    onOutputComplete?.();
  }, [didNotifyOutputComplete, finishedOutputLines, isComplete, onOutputComplete, output]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={[
        "w-full overflow-hidden rounded-[22px] border border-white/10 bg-[#1f1f21]/95 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex h-11 items-center justify-between gap-4 border-b border-white/5 bg-linear-to-b from-[#2c2c2f] to-[#212124] px-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] sm:px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <span className="h-3.5 w-3.5 rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.08)]" />
            <span className="h-3.5 w-3.5 rounded-full bg-[#febc2e] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.08)]" />
            <span className="h-3.5 w-3.5 rounded-full bg-[#28c840] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.08)]" />
          </div>

          <div className="flex items-center gap-2 rounded-full px-2 py-1 text-[15px] leading-none text-neutral-300/95">
            <span aria-hidden="true" className="text-[18px] leading-none">
              📁
            </span>
            <div className="truncate font-semibold tracking-wide text-neutral-300/90">
              {title} — -zsh — 80x24
            </div>
          </div>
        </div>
        <Button
          type="button"
          onClick={() => {
            setRunKey((value) => value + 1);
            onReplay?.();
          }}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-neutral-200/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
        >
          Replay
        </Button>
      </div>

      <Separator className="h-px bg-white/10" />

      <div className="px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex items-start gap-3 text-sm leading-7 text-emerald-300 sm:text-base">
          <span className="select-none text-cyan-300">{prompt}</span>

          <div className="flex-1 whitespace-pre-wrap text-neutral-100">
            {typedText}
            <motion.span
              aria-hidden="true"
              className="ml-0.5 inline-block text-cyan-300"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
            >
              {cursor}
            </motion.span>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{ opacity: isComplete ? 1 : 0, y: isComplete ? 0 : 8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="space-y-1 text-sm leading-7 text-neutral-100 sm:text-base"
        >
          {output.map((line, index) => {
            if (!line) {
              return <div key={`blank-${index}`} className="h-7 sm:h-8" />;
            }

            const isGradientTitle = index === 0;

            return (
              <motion.div
                key={`${line}-${index}`}
                initial={{ opacity: 0, y: 6 }}
                animate={isComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                transition={{
                  duration: 0.22,
                  delay: isComplete ? index * 0.08 : 0,
                  ease: "easeOut",
                }}
                className={
                  isGradientTitle
                    ? "bg-linear-to-r from-sky-400 via-fuchsia-400 to-violet-400 bg-clip-text font-semibold text-transparent"
                    : index === 2
                      ? "text-sky-300"
                      : "text-neutral-100"
                }
                onAnimationComplete={() => {
                  if (!isComplete || !line) {
                    return;
                  }

                  setFinishedOutputLines((value) => value + 1);
                }}
              >
                {line}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
