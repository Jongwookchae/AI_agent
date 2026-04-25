import WishForm from "@/components/WishForm";
import Galaxy from "@/components/Galaxy";

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-120px)] flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      <Galaxy
        focal={[0.5, 0.5]}
        rotation={[1.0, 0.0]}
        starSpeed={0.5}
        density={1}
        hueShift={140}
        speed={1.0}
        mouseInteraction
        glowIntensity={0.3}
        saturation={0.0}
        mouseRepulsion
        repulsionStrength={2}
        twinkleIntensity={0.3}
        rotationSpeed={0.1}
        autoCenterRepulsion={0}
        transparent
        className="pointer-events-none"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(30,41,59,0.15),rgba(2,6,23,0.72)_60%,rgba(2,6,23,0.92)_100%)] pointer-events-none" />
      <div className="relative z-10 min-h-[calc(100vh-120px)] w-full flex flex-col items-center justify-center">
      {/* Hero */}
      <div className="text-center mb-10 max-w-xl">
        <div className="text-6xl mb-4">🧞‍♂️</div>
        <h1 className="text-4xl font-extrabold text-white mb-3 leading-tight">
          AI aGENIEnt
        </h1>
        <p className="text-xl text-violet-300 font-semibold mb-2">
          Crypto Wish Funding Agent
        </p>
        <p className="text-slate-400 text-sm leading-relaxed">
          Pick your favorite crypto, set a funding goal, and share the magic.
          <br />
          AI writes your share copy and tracks progress in real time.
        </p>
      </div>

      {/* How it works */}
      <div className="flex gap-6 mb-10 flex-wrap justify-center">
        {[
          { icon: "✍️", label: "Make a Wish" },
          { icon: "🔗", label: "Share Link" },
          { icon: "💝", label: "Friends Fund" },
          { icon: "🎉", label: "Goal Reached" },
        ].map((step) => (
          <div key={step.label} className="flex flex-col items-center gap-1">
            <span className="text-2xl">{step.icon}</span>
            <span className="text-xs text-slate-400">{step.label}</span>
          </div>
        ))}
      </div>

      {/* Form card */}
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur rounded-2xl p-6 border border-slate-700 shadow-2xl">
        <h2 className="text-lg font-bold text-white mb-5">🌟 Make a Wish</h2>
        <WishForm />
      </div>

      <p className="text-xs text-slate-600 mt-6">
        * No real on-chain transactions occur in this MVP. All funding is mock data.
      </p>
      </div>
    </div>
  );
}
