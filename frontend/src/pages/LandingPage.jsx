import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import Hero from '../components/landingcomp/Hero'
import TickerBar from '../components/landingcomp/TickerBar'
import HowItWorks from '../components/landingcomp/HowItWorks'
import TasksSection from '../components/landingcomp/TasksSection'
import RewardsSection from '../components/landingcomp/RewardsSection'
import Leaderboard from '../components/landingcomp/Leaderboard'
import FAQ from '../components/landingcomp/FAQ'
import Testimonials from '../components/landingcomp/Testimonials'
import CTASECTION from '../components/landingcomp/CTASECTION'
import GLOBAL_CSS from '../components/landingcomp/StyleHero/GLOBAL_CSS'

/* ── Wires up .reveal scroll animations page-wide.
   Uses MutationObserver so elements added after mount are also caught. ── */
const useScrollReveal = () => {
  useEffect(() => {
    const observe = (el) => {
      obs.observe(el)
    }

    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          obs.unobserve(e.target)
        }
      }),
      { threshold: 0.12 }
    )

    // Observe all existing .reveal elements
    document.querySelectorAll('.reveal').forEach(observe)

    // Watch for newly mounted .reveal elements (e.g. from lazy-rendered components)
    const mutObs = new MutationObserver(mutations => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return
          if (node.classList?.contains('reveal')) observe(node)
          node.querySelectorAll?.('.reveal').forEach(observe)
        })
      })
    })
    mutObs.observe(document.body, { childList: true, subtree: true })

    return () => {
      obs.disconnect()
      mutObs.disconnect()
    }
  }, [])
}

const LandingPage = () => {
  useScrollReveal()

  return (
    <>
      {/* ── SEO: Page title and meta description ── */}
      <Helmet>
        <title>REVADOO — Earn Real Rewards for Surveys, Games &amp; Tasks</title>
        <meta
          name="description"
          content="Join 2.4M+ earners completing surveys, mini games, and creative tasks. Redeem Creds for PayPal cash, gift cards, crypto, and 100+ reward options. Free forever, no minimum payout."
        />
        <meta property="og:title" content="REVADOO — Earn Real Rewards for Surveys, Games & Tasks" />
        <meta property="og:description" content="Turn your spare time into real money. Complete tasks, earn Creds, cash out instantly." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* ── Global styles — injected ONCE here, not duplicated in Hero.jsx ── */}
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {/* ── Three.js must be loaded in public/index.html before </body>:
          <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
          JSX <script> tags do NOT execute in React — removed from here. ── */}

      <main id="main-content">
        <Hero />
        <TickerBar />
        <HowItWorks />
        <TasksSection />
        <RewardsSection />
        <Leaderboard />
        <FAQ />
        <Testimonials />
        <CTASECTION />
      </main>
    </>
  )
}

export default LandingPage