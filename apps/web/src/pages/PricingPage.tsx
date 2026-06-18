import { Link } from '@tanstack/react-router'
import { Button } from '@ttg/ui'
import { Panel } from '../components'

const TIERS = [
  {
    name: 'Free',
    price: '€0',
    period: '/mo',
    desc: 'For stores just getting started.',
    features: [
      '1 active event at a time',
      'Up to 16 players per event',
      'Basic registration (1v1 only)',
      'Public event listing',
      'Email support',
    ],
    missing: ['2HG registration', 'Waitlist management', 'CSV export', 'Announcements', 'Analytics'],
    cta: 'Start Free',
    variant: 'ghost' as const,
    highlight: false,
  },
  {
    name: 'Basic',
    price: '€29',
    period: '/mo',
    desc: 'For active stores running regular events.',
    features: [
      'Unlimited events',
      'Up to 64 players per event',
      '2HG + 1v1 registration',
      'Waitlist management',
      'CSV export',
      'Email announcements',
      'Priority support',
    ],
    missing: ['Advanced analytics', 'Custom branding', 'API access'],
    cta: 'Apply — Basic',
    variant: 'ghost' as const,
    highlight: false,
  },
  {
    name: 'Pro',
    price: '€79',
    period: '/mo',
    desc: 'For high-volume tournament organizers.',
    features: [
      'Everything in Basic',
      'Unlimited players per event',
      'Advanced analytics & revenue',
      'Custom store branding',
      'Companion app integration',
      'Priority onboarding',
      'Dedicated account manager',
    ],
    missing: [],
    cta: 'Apply — Pro',
    variant: 'primary' as const,
    highlight: true,
  },
]

export function PricingPage() {
  return (
    <div className="page-enter max-w-[1100px] mx-auto px-5 py-12">
      <div className="text-center mb-10">
        <h1 className="text-[30px] font-bold text-ink mb-2">Simple, transparent pricing</h1>
        <p className="text-[14px] text-ink-3">Start free. Upgrade when you're ready.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {TIERS.map(tier => (
          <div
            key={tier.name}
            className={`rounded-[12px] border p-6 flex flex-col ${
              tier.highlight ? 'bg-gold/5 border-gold/30' : 'bg-surface-2 border-line'
            }`}
          >
            {tier.highlight && (
              <div className="text-[10px] font-semibold text-gold bg-gold/10 border border-gold/20 rounded-full px-2.5 py-0.5 self-start mb-3">
                MOST POPULAR
              </div>
            )}
            <p className="text-[18px] font-semibold text-ink mb-1">{tier.name}</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-[32px] font-bold text-ink">{tier.price}</span>
              <span className="text-[13px] text-ink-3 mb-1.5">{tier.period}</span>
            </div>
            <p className="text-[12px] text-ink-3 mb-5">{tier.desc}</p>

            <ul className="flex-1 flex flex-col gap-2 mb-6">
              {tier.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-[12px] text-ink-2">
                  <span className="text-green mt-0.5">✓</span>
                  {f}
                </li>
              ))}
              {tier.missing.map(f => (
                <li key={f} className="flex items-start gap-2 text-[12px] text-ink-4">
                  <span className="mt-0.5">✕</span>
                  {f}
                </li>
              ))}
            </ul>

            <Link to="/apply">
              <Button variant={tier.variant} className="w-full">{tier.cta}</Button>
            </Link>
          </div>
        ))}
      </div>

      <Panel className="p-6 text-center">
        <h2 className="text-[16px] font-semibold text-ink mb-2">Questions?</h2>
        <p className="text-[13px] text-ink-3 mb-4">
          All plans include a 30-day free trial. No credit card required to apply.
          Contact us if you need a custom plan for large tournament organizers.
        </p>
        <a href="mailto:hello@ttgevents.com" className="text-[13px] text-gold hover:underline">
          hello@ttgevents.com
        </a>
      </Panel>
    </div>
  )
}
