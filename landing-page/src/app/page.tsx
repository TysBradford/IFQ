import { AnimatedSection } from "@/components/AnimatedSection";
import { WaitlistForm } from "@/components/WaitlistForm";
import {
  fadeUp,
  slideLeft,
  slideRight,
  scaleUp,
  staggerContainer,
  staggerContainerSlow,
} from "@/lib/animations";

export default function Home() {
  return (
    <>
      {/* Floating Stickers */}
      <div className="sticker sticker-1 font-headline">NO BS</div>
      <div className="sticker sticker-2 font-headline">24/7</div>
      <div className="sticker sticker-3 font-headline">SCIENCE-BACKED</div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 lg:px-12 bg-paper border-b-[3px] border-ink">
        <div className="font-headline font-bold text-[1.75rem]">
          <span className="text-ink">I</span>
          <span className="text-ink">F</span>
          <span className="text-emerald">Q</span>
        </div>
        <div className="font-mono text-[0.625rem] px-4 py-2 bg-emerald text-white rotate-2 tracking-wider">
          COMING SOON
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-12 pt-32 pb-16 px-6 lg:px-16 items-center max-w-[1400px] mx-auto">
        <AnimatedSection variants={slideLeft}>
          <div className="absolute -top-6 left-0 w-20 h-1.5 bg-emerald -rotate-2 rounded" />
          <h1 className="font-headline font-bold mb-8">
            <span className="block word-quit">QUIT</span>
            <span className="block word-like my-2">like you</span>
            <span className="block word-mean">
              MEAN IT<span className="text-emerald">.</span>
            </span>
          </h1>
          <p className="text-lg leading-relaxed mb-10 max-w-md text-ink/55">
            The anti-corporate quit app that{" "}
            <span className="highlight">matches your intensity</span>.
            Science-backed. No judgment. Available 24/7.
          </p>

          <div className="max-w-lg">
            <WaitlistForm />
            <p className="mt-4 text-sm text-ink/55">
              Join others ready to quit for real.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection
          variants={staggerContainer}
          className="flex flex-col gap-4 lg:items-end mt-8 lg:mt-0"
        >
          <AnimatedSection variants={scaleUp}>
            <div className="stat-card">
              <span className="block font-mono text-[0.65rem] opacity-80 tracking-wider">
                AVG QUIT TIME
              </span>
              <span className="block font-mono text-7xl leading-none">47</span>
              <span className="block font-headline font-bold text-xl">
                DAYS
              </span>
            </div>
          </AnimatedSection>
          <AnimatedSection variants={scaleUp}>
            <div className="floating-badge">
              <span className="block font-headline font-bold text-2xl">
                87%
              </span>
              <small className="text-sm opacity-80">success rate</small>
            </div>
          </AnimatedSection>
        </AnimatedSection>
      </section>

      {/* App Preview 1 */}
      <section className="grid lg:grid-cols-2 gap-8 lg:gap-16 py-24 px-6 lg:px-16 max-w-[1400px] mx-auto items-center">
        <AnimatedSection variants={slideLeft}>
          <span className="inline-block font-mono text-xs tracking-widest text-emerald mb-4">
            THE APP
          </span>
          <h2 className="font-headline font-bold text-4xl lg:text-5xl leading-tight mb-6">
            Your quit,
            <br />
            in your pocket.
          </h2>
          <p className="text-lg leading-relaxed text-ink/55 max-w-md">
            Track cravings, celebrate wins, and get real-time support—all
            designed for how quitting actually works.
          </p>
        </AnimatedSection>
        <AnimatedSection variants={slideRight} className="flex justify-center">
          <div className="app-mockup-placeholder">
            <span className="block text-5xl mb-4">📱</span>
            <span className="block font-headline font-semibold text-emerald mb-2">
              App Screenshot
            </span>
            <span className="text-sm text-ink/55 italic leading-relaxed">
              Home dashboard showing progress tracker, craving log, and daily
              stats
            </span>
          </div>
        </AnimatedSection>
      </section>

      {/* Animated Asset Section 1 */}
      <AnimatedSection
        as="section"
        variants={fadeUp}
        className="py-32 px-6 lg:px-16 bg-paper-alt"
      >
        <div className="animated-placeholder">
          <div className="text-6xl mb-6">✊→🖕</div>
          <span className="block font-mono text-xs tracking-widest text-emerald mb-2">
            SCROLL-TRIGGERED ANIMATION
          </span>
          <span className="text-sm text-ink/55 italic">
            Closed fist opens to middle finger as user scrolls through
          </span>
        </div>
      </AnimatedSection>

      {/* Features */}
      <AnimatedSection
        as="section"
        variants={staggerContainerSlow}
        className="grid lg:grid-cols-3 border-t-[3px] border-b-[3px] border-ink"
      >
        {/* Feature 1 */}
        <AnimatedSection
          variants={fadeUp}
          className="p-8 lg:p-14 border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-ink"
        >
          <div className="flex justify-between items-start mb-6">
            <span className="font-mono text-xs text-ink/55">01</span>
            <span className="feature-stamp">REAL</span>
          </div>
          <h3 className="font-headline font-bold text-3xl mb-4 leading-tight">
            TRACK
            <br />
            EVERYTHING
          </h3>
          <p className="text-sm leading-relaxed text-ink/55">
            Cravings, triggers, moods, wins. All the data you need to understand
            your patterns.
            <span className="block text-emerald font-medium mt-3">
              → Know yourself better than nicotine knows you
            </span>
          </p>
        </AnimatedSection>

        {/* Feature 2 */}
        <AnimatedSection
          variants={fadeUp}
          className="p-8 lg:p-14 border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-ink bg-mint"
        >
          <div className="flex justify-between items-start mb-6">
            <span className="font-mono text-xs text-ink/60">02</span>
            <span className="feature-stamp !bg-ink !text-paper">PROVEN</span>
          </div>
          <h3 className="font-headline font-bold text-3xl mb-4 leading-tight">
            SCIENCE
            <br />
            FIRST
          </h3>
          <p className="text-sm leading-relaxed text-ink/70">
            Every feature built on real addiction research. Not wellness fluff.
            <span className="block text-ink font-medium mt-3">
              → CBT, mindfulness, and habit science that works
            </span>
          </p>
        </AnimatedSection>

        {/* Feature 3 */}
        <AnimatedSection variants={fadeUp} className="p-8 lg:p-14">
          <div className="flex justify-between items-start mb-6">
            <span className="font-mono text-xs text-ink/55">03</span>
            <span className="feature-stamp !bg-amber !text-ink">24/7</span>
          </div>
          <h3 className="font-headline font-bold text-3xl mb-4 leading-tight">
            ALWAYS
            <br />
            THERE
          </h3>
          <p className="text-sm leading-relaxed text-ink/55">
            Cravings don&apos;t wait for office hours. Neither does your
            support.
            <span className="block text-emerald font-medium mt-3">
              → Get help at 3am when you actually need it
            </span>
          </p>
        </AnimatedSection>
      </AnimatedSection>

      {/* App Preview 2 */}
      <section className="grid lg:grid-cols-2 gap-8 lg:gap-16 py-24 px-6 lg:px-16 max-w-[1400px] mx-auto items-center">
        <AnimatedSection
          variants={slideLeft}
          className="order-2 lg:order-1 flex justify-center"
        >
          <div className="app-mockup-placeholder alt">
            <span className="block text-5xl mb-4">📊</span>
            <span className="block font-headline font-semibold text-emerald mb-2">
              App Screenshot
            </span>
            <span className="text-sm text-ink/55 italic leading-relaxed">
              Craving tracker with pattern analysis and trigger identification
            </span>
          </div>
        </AnimatedSection>
        <AnimatedSection variants={slideRight} className="order-1 lg:order-2">
          <span className="inline-block font-mono text-xs tracking-widest text-emerald mb-4">
            INSIGHTS
          </span>
          <h2 className="font-headline font-bold text-4xl lg:text-5xl leading-tight mb-6">
            Outsmart your cravings.
          </h2>
          <p className="text-lg leading-relaxed text-ink/55 max-w-md">
            See patterns you couldn&apos;t spot on your own. Know when cravings
            hit hardest, what triggers them, and what actually helps.
          </p>
        </AnimatedSection>
      </section>

      {/* Vera Section */}
      <AnimatedSection
        as="section"
        variants={fadeUp}
        className="py-24 px-6 lg:px-16 max-w-[1400px] mx-auto"
      >
        <div className="text-center mb-16">
          <span className="inline-block font-mono text-xs tracking-widest text-emerald mb-4">
            MEET VERA
          </span>
          <h2 className="font-headline font-bold text-4xl lg:text-5xl leading-tight">
            Your AI coach who{" "}
            <span className="highlight-warm">actually gets it</span>.
          </h2>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-16 items-start">
          {/* Chat Preview */}
          <AnimatedSection variants={slideLeft}>
            <div className="bg-paper-alt border-[3px] border-ink p-6 lg:p-8 flex flex-col gap-4">
              <div className="chat-bubble chat-bubble-user self-end text-ink">
                I&apos;m about to lose it. Everyone at this party is smoking and
                I&apos;m 11 days in.
              </div>
              <div className="chat-bubble chat-bubble-vera self-start">
                <span className="block font-headline font-bold text-xs mb-2 opacity-80">
                  Vera
                </span>
                11 days is real. That&apos;s not nothing—that&apos;s you showing
                up for yourself 11 times. Right now your brain is screaming
                because it sees triggers everywhere. What would help more:
                stepping outside for 5 minutes of fresh air, or do you need to
                just leave?
              </div>
              <div className="chat-bubble chat-bubble-user self-end text-ink">
                I don&apos;t want to be that person who leaves early
              </div>
              <div className="chat-bubble chat-bubble-vera self-start">
                <span className="block font-headline font-bold text-xs mb-2 opacity-80">
                  Vera
                </span>
                You&apos;re not &quot;that person.&quot; You&apos;re the person
                who&apos;s 11 days into changing their life. That&apos;s way
                more interesting than being the person who stayed and smoked.
                Your call though—I&apos;m here either way.
              </div>
            </div>
          </AnimatedSection>

          {/* Vera Features */}
          <AnimatedSection
            variants={staggerContainer}
            className="grid sm:grid-cols-2 gap-4"
          >
            <AnimatedSection
              variants={fadeUp}
              className="p-6 bg-paper-alt border-2 border-ink"
            >
              <span className="block text-2xl mb-3">🧠</span>
              <h4 className="font-headline font-bold mb-2">
                Remembers Everything
              </h4>
              <p className="text-sm leading-relaxed text-ink/55">
                Your triggers, your wins, your patterns. Vera learns what works
                for you.
              </p>
            </AnimatedSection>
            <AnimatedSection
              variants={fadeUp}
              className="p-6 bg-paper-alt border-2 border-ink"
            >
              <span className="block text-2xl mb-3">💬</span>
              <h4 className="font-headline font-bold mb-2">
                Real Conversation
              </h4>
              <p className="text-sm leading-relaxed text-ink/55">
                No scripts. No platitudes. Actual helpful dialogue when you need
                it.
              </p>
            </AnimatedSection>
            <AnimatedSection
              variants={fadeUp}
              className="p-6 bg-paper-alt border-2 border-ink"
            >
              <span className="block text-2xl mb-3">⏰</span>
              <h4 className="font-headline font-bold mb-2">
                Always Available
              </h4>
              <p className="text-sm leading-relaxed text-ink/55">
                3am craving? Vera&apos;s there. No waiting rooms, no
                appointments.
              </p>
            </AnimatedSection>
            <AnimatedSection
              variants={fadeUp}
              className="p-6 bg-paper-alt border-2 border-ink"
            >
              <span className="block text-2xl mb-3">📚</span>
              <h4 className="font-headline font-bold mb-2">Science-Backed</h4>
              <p className="text-sm leading-relaxed text-ink/55">
                Trained on addiction research and CBT techniques. Not just vibes.
              </p>
            </AnimatedSection>
          </AnimatedSection>
        </div>
      </AnimatedSection>

      {/* Animated Asset Section 2 */}
      <AnimatedSection
        as="section"
        variants={fadeUp}
        className="py-32 px-6 lg:px-16 bg-ink animated-asset-dark"
      >
        <div className="animated-placeholder">
          <div className="text-6xl mb-6">🌫️→✨</div>
          <span className="block font-mono text-xs tracking-widest text-emerald mb-2">
            SCROLL-TRIGGERED ANIMATION
          </span>
          <span className="text-sm text-white/60 italic">
            Smoke cloud that clears to reveal clear air/stars as user scrolls
          </span>
        </div>
      </AnimatedSection>

      {/* Statement */}
      <AnimatedSection
        as="section"
        variants={scaleUp}
        className="py-32 px-6 lg:px-16 bg-emerald text-white text-center"
      >
        <p className="text-lg opacity-80 mb-2">
          This isn&apos;t about willpower.
        </p>
        <p className="font-headline font-bold text-4xl lg:text-6xl leading-tight mb-2">
          It&apos;s about having the right tools
        </p>
        <p className="font-headline font-bold text-5xl lg:text-7xl leading-tight statement-accent">
          when it matters.
        </p>
      </AnimatedSection>

      {/* App Preview 3 */}
      <section className="grid lg:grid-cols-2 gap-8 lg:gap-16 py-24 px-6 lg:px-16 max-w-[1400px] mx-auto items-center">
        <AnimatedSection variants={slideLeft}>
          <span className="inline-block font-mono text-xs tracking-widest text-emerald mb-4">
            MILESTONES
          </span>
          <h2 className="font-headline font-bold text-4xl lg:text-5xl leading-tight mb-6">
            Every win counts.
          </h2>
          <p className="text-lg leading-relaxed text-ink/55 max-w-md">
            From 24 hours to 1 year—celebrate real progress with milestones that
            actually mean something. No participation trophies.
          </p>
        </AnimatedSection>
        <AnimatedSection variants={slideRight} className="flex justify-center">
          <div className="app-mockup-placeholder">
            <span className="block text-5xl mb-4">🏆</span>
            <span className="block font-headline font-semibold text-emerald mb-2">
              App Screenshot
            </span>
            <span className="text-sm text-ink/55 italic leading-relaxed">
              Milestone celebration screen with confetti and stats
            </span>
          </div>
        </AnimatedSection>
      </section>

      {/* CTA */}
      <AnimatedSection
        as="section"
        variants={fadeUp}
        className="py-32 px-6 lg:px-16 relative"
      >
        <div className="max-w-xl mx-auto text-center relative">
          <div className="absolute -top-8 right-0 lg:-right-5 font-headline font-bold text-xs px-4 py-2 bg-amber text-ink rotate-[8deg] border-2 border-ink">
            LET&apos;S GO
          </div>
          <h2 className="font-headline font-bold text-7xl lg:text-9xl mb-4 tracking-tight">
            READY?
          </h2>
          <p className="text-lg text-ink/55 mb-10 leading-relaxed">
            Join the waitlist. Get early access. Start quitting like you mean
            it.
          </p>
          <div className="max-w-md mx-auto">
            <WaitlistForm buttonText="I'M IN" inputClassName="bg-paper-alt" />
          </div>
        </div>

        {/* Floating stats */}
        <div className="cta-float top-1/4 left-[12%] -rotate-3">
          <span className="block font-mono text-xl text-emerald">IFQ</span>
          <small className="text-xs text-ink/55">coming soon</small>
        </div>
        <div className="cta-float bottom-1/4 right-[12%] rotate-2">
          <span className="block font-mono text-xl text-emerald">47 days</span>
          <small className="text-xs text-ink/55">avg quit time</small>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-16 border-t-[3px] border-ink max-w-[1400px] mx-auto flex flex-col lg:flex-row flex-wrap justify-between items-center gap-6">
        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
          <span className="font-headline font-bold text-2xl text-emerald">
            IFQ
          </span>
          <span className="text-sm text-ink/55">Quit like you mean it.</span>
        </div>
        <div className="flex gap-8">
          <a
            href="#"
            className="text-sm text-ink/60 hover:text-emerald transition-colors"
          >
            About
          </a>
          <a
            href="#"
            className="text-sm text-ink/60 hover:text-emerald transition-colors"
          >
            Science
          </a>
          <a
            href="#"
            className="text-sm text-ink/60 hover:text-emerald transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-sm text-ink/60 hover:text-emerald transition-colors"
          >
            Contact
          </a>
        </div>
      </footer>
    </>
  );
}
