import WishForm from "@/components/WishForm";
import Ribbons from "@/components/Ribbons";

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-120px)] flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      <Ribbons
        colors={["#8f7cff", "#f765b6", "#67d6ff"]}
        baseSpring={0.03}
        baseFriction={0.9}
        baseThickness={22}
        offsetFactor={0.05}
        maxAge={500}
        pointCount={42}
        speedMultiplier={0.6}
        enableFade={false}
        enableShaderEffect={false}
        effectAmplitude={2}
        backgroundColor={[0, 0, 0, 0]}
        className="absolute inset-0 pointer-events-none"
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
