import { useState } from 'react'
import { Button, Field, FieldLabel, Input } from '@ttg/ui'
import { PageHeader, Panel, SectionLabel } from '../components'

interface FormState {
  storeName: string
  city: string
  country: string
  address: string
  contactName: string
  contactEmail: string
  website: string
  wpn: boolean
  message: string
}

const INIT: FormState = {
  storeName: '', city: '', country: '', address: '',
  contactName: '', contactEmail: '', website: '', wpn: false, message: '',
}

export function ApplyPage() {
  const [form, setForm] = useState<FormState>(INIT)
  const [submitted, setSubmitted] = useState(false)

  function update(key: keyof FormState, value: string | boolean) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  if (submitted) {
    return (
      <div className="page-enter max-w-[520px] mx-auto px-5 py-16 text-center">
        <div className="text-[48px] mb-4">🎉</div>
        <h1 className="text-[22px] font-semibold text-ink mb-2">Application submitted!</h1>
        <p className="text-[13px] text-ink-3 max-w-[360px] mx-auto">
          Thanks, <strong className="text-ink">{form.storeName}</strong>! We'll review your
          application and get back to you at{' '}
          <strong className="text-ink">{form.contactEmail}</strong> within 2–3 business days.
        </p>
      </div>
    )
  }

  return (
    <div className="page-enter max-w-[640px] mx-auto px-5 py-8">
      <PageHeader
        title="Apply to list your store"
        subtitle="Join the TTG Events network. We'll review your application and reach out within 2–3 business days."
      />

      <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }} className="flex flex-col gap-4">
        <Panel className="p-5">
          <SectionLabel>Store Details</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Store name</FieldLabel>
              <Input
                value={form.storeName}
                onChange={e => update('storeName', e.target.value)}
                placeholder="Dragon's Lair"
                required
              />
            </Field>
            <Field>
              <FieldLabel>City</FieldLabel>
              <Input
                value={form.city}
                onChange={e => update('city', e.target.value)}
                placeholder="Praha"
                required
              />
            </Field>
            <Field>
              <FieldLabel>Country</FieldLabel>
              <Input
                value={form.country}
                onChange={e => update('country', e.target.value)}
                placeholder="Czech Republic"
                required
              />
            </Field>
            <Field>
              <FieldLabel>Address</FieldLabel>
              <Input
                value={form.address}
                onChange={e => update('address', e.target.value)}
                placeholder="Náměstí Míru 12"
              />
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel>Website</FieldLabel>
              <Input
                type="url"
                value={form.website}
                onChange={e => update('website', e.target.value)}
                placeholder="https://yourstore.com"
              />
            </Field>
          </div>
          <div className="mt-4 flex items-start gap-3">
            <input
              id="wpn"
              type="checkbox"
              checked={form.wpn}
              onChange={e => update('wpn', e.target.checked)}
              className="mt-0.5 accent-[var(--gold)]"
            />
            <label htmlFor="wpn" className="text-[13px] text-ink-2 cursor-pointer">
              We are a WPN (Wizards Play Network) member store
            </label>
          </div>
        </Panel>

        <Panel className="p-5">
          <SectionLabel>Contact</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Your name</FieldLabel>
              <Input
                value={form.contactName}
                onChange={e => update('contactName', e.target.value)}
                placeholder="Jan Novák"
                required
              />
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                value={form.contactEmail}
                onChange={e => update('contactEmail', e.target.value)}
                placeholder="jan@yourstore.com"
                required
              />
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel>Additional message</FieldLabel>
              <textarea
                value={form.message}
                onChange={e => update('message', e.target.value)}
                placeholder="Tell us about your store, typical events, player base…"
                rows={3}
                className="w-full bg-surface-3 border border-line text-ink text-[13px] px-3 py-2 rounded-[7px] outline-none focus:border-gold/50 placeholder:text-ink-4 resize-none"
              />
            </Field>
          </div>
        </Panel>

        <Button type="submit" className="self-start px-6">
          Submit Application
        </Button>
      </form>
    </div>
  )
}
