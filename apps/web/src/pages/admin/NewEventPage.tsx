import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button, Field, FieldLabel, Input, Select } from '@ttg/ui'
import type { GameType, EventFormat, EventType } from '@ttg/types'

interface FormState {
  name: string
  game: GameType
  format: EventFormat
  type: EventType
  date: string
  time: string
  capacity: string
  waitlistCapacity: string
  entryFee: string
  currency: string
  notes: string
}

const INIT: FormState = {
  name: '', game: 'mtg', format: 'sealed', type: 'regular',
  date: '', time: '10:00', capacity: '24', waitlistCapacity: '8',
  entryFee: '280', currency: 'CZK', notes: '',
}

export function NewEventPage() {
  const [form, setForm] = useState<FormState>(INIT)
  const [saved, setSaved] = useState(false)
  const navigate = useNavigate()

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => navigate({ to: '/admin/events' }), 1500)
  }

  if (saved) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-[24px] mb-2">✅</p>
          <p className="text-[14px] font-medium text-ink">Event created!</p>
          <p className="text-[12px] text-ink-3">Redirecting…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-[700px]">
      <div className="flex items-center gap-2 text-[12px] text-ink-4 mb-5">
        <Link to="/admin/events" className="hover:text-ink-2 transition-colors">Events</Link>
        <span>/</span>
        <span className="text-ink-3">New Event</span>
      </div>

      <h1 className="text-[20px] font-semibold text-ink mb-6">Create Event</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="bg-surface-2 border border-line rounded-[10px] p-5">
          <p className="text-[11px] font-semibold text-ink-4 uppercase tracking-wider mb-4">Event Details</p>
          <div className="grid grid-cols-2 gap-4">
            <Field className="col-span-2">
              <FieldLabel>Event name</FieldLabel>
              <Input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Aetherdrift Prerelease Sealed" required />
            </Field>
            <Field>
              <FieldLabel>Game</FieldLabel>
              <Select value={form.game} onChange={e => update('game', e.target.value as GameType)} required>
                <option value="mtg">Magic: The Gathering</option>
                <option value="pokemon">Pokémon</option>
                <option value="one-piece">One Piece</option>
                <option value="lorcana">Lorcana</option>
                <option value="yugioh">Yu-Gi-Oh!</option>
                <option value="fab">Flesh and Blood</option>
                <option value="other">Other</option>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Format</FieldLabel>
              <Select value={form.format} onChange={e => update('format', e.target.value as EventFormat)} required>
                <option value="sealed">Sealed</option>
                <option value="2hg">Two-Headed Giant</option>
                <option value="draft">Draft</option>
                <option value="standard">Standard</option>
                <option value="commander">Commander</option>
                <option value="prerelease">Prerelease</option>
                <option value="other">Other</option>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Type</FieldLabel>
              <Select value={form.type} onChange={e => update('type', e.target.value as EventType)} required>
                <option value="regular">Regular</option>
                <option value="prerelease">Prerelease</option>
                <option value="launch">Launch</option>
                <option value="championship">Championship</option>
              </Select>
            </Field>
          </div>
        </div>

        <div className="bg-surface-2 border border-line rounded-[10px] p-5">
          <p className="text-[11px] font-semibold text-ink-4 uppercase tracking-wider mb-4">Date & Time</p>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Date</FieldLabel>
              <Input type="date" value={form.date} onChange={e => update('date', e.target.value)} required />
            </Field>
            <Field>
              <FieldLabel>Start time</FieldLabel>
              <Input type="time" value={form.time} onChange={e => update('time', e.target.value)} required />
            </Field>
          </div>
        </div>

        <div className="bg-surface-2 border border-line rounded-[10px] p-5">
          <p className="text-[11px] font-semibold text-ink-4 uppercase tracking-wider mb-4">Capacity & Pricing</p>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Capacity</FieldLabel>
              <Input type="number" min="2" value={form.capacity} onChange={e => update('capacity', e.target.value)} required />
            </Field>
            <Field>
              <FieldLabel>Waitlist capacity</FieldLabel>
              <Input type="number" min="0" value={form.waitlistCapacity} onChange={e => update('waitlistCapacity', e.target.value)} />
            </Field>
            <Field>
              <FieldLabel>Entry fee</FieldLabel>
              <Input type="number" min="0" value={form.entryFee} onChange={e => update('entryFee', e.target.value)} />
            </Field>
            <Field>
              <FieldLabel>Currency</FieldLabel>
              <Select value={form.currency} onChange={e => update('currency', e.target.value)}>
                <option value="CZK">CZK</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </Select>
            </Field>
          </div>
        </div>

        <div className="bg-surface-2 border border-line rounded-[10px] p-5">
          <p className="text-[11px] font-semibold text-ink-4 uppercase tracking-wider mb-4">Notes</p>
          <textarea
            value={form.notes}
            onChange={e => update('notes', e.target.value)}
            placeholder="Additional info for players (optional)…"
            rows={3}
            className="w-full bg-surface-1 border border-line rounded-[7px] px-3 py-2 text-[12px] text-ink outline-none focus:border-gold placeholder:text-ink-4 resize-none"
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit">Create Event</Button>
          <Link to="/admin/events"><Button variant="ghost">Cancel</Button></Link>
        </div>
      </form>
    </div>
  )
}
