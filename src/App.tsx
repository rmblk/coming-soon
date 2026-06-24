import { motion } from "motion/react";
import { useState } from "react";
import { TypewriterTerminal } from "./components/TypewriterTerminal";

function App() {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_28%),linear-gradient(180deg,#111827_0%,#020617_45%,#000000_100%)] px-6 py-12 text-white sm:px-10 lg:px-16">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-4xl items-center justify-center">
        <div className="w-full space-y-8 pb-8 sm:pb-12">
          <TypewriterTerminal
            title="ryan"
            prompt="ryan@ryanblack.dev ~ %"
            className="mx-auto max-w-3xl min-h-96 sm:min-h-104"
            onOutputComplete={() => setShowComingSoon(true)}
            onReplay={() => setShowComingSoon(false)}
          >
            {"vp dev"}
          </TypewriterTerminal>

          <div className="relative min-h-20 sm:min-h-28">
            {showComingSoon ? (
              <motion.h1
                initial={{ opacity: 0, y: -28, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 14, bounce: 0.6 }}
                className="absolute inset-x-0 top-0 text-center text-3xl font-bold text-white sm:text-5xl"
                style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
              >
                Coming Soon.
              </motion.h1>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
