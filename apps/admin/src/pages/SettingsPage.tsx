import { useState } from 'react'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-[14px]">
      <label className="block text-[11px] text-ink-3 mb-[5px]">{label}</label>
      {children}
    </div>
  )
}

function Input({ type = 'text', defaultValue, placeholder }: { type?: string; defaultValue?: string | number; placeholder?: string }) {
  return (
    <input
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full bg-surface-1 border border-line rounded-[7px] px-[10px] py-2 text-[12px] text-ink outline-none focus:border-gold transition-colors"
    />
  )
}

export function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [tested, setTested] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="p-5 page-enter max-w-[480px]">
      <form onSubmit={handleSave}>
        <div className="bg-surface-2 border border-line rounded-[8px] p-4 mb-[14px]">
          <div className="text-[13px] font-medium text-ink mb-[14px]">Platform settings</div>
          <Field label="Platform name">
            <Input defaultValue="TTG Events" />
          </Field>
          <Field label="Support email">
            <Input type="email" defaultValue="hello@ttgevents.com" />
          </Field>
          <Field label="Default cancellation cutoff (hours)">
            <Input type="number" defaultValue={24} />
          </Field>
          <div className="flex items-center gap-3 mt-[4px]">
            <button
              type="submit"
              className="text-[12px] font-medium bg-gold text-surface px-[16px] py-2 rounded-[8px] border-none cursor-pointer hover:brightness-110 transition-all"
            >
              Save settings
            </button>
            {saved && <span className="text-[12px] text-green">✓ Saved</span>}
          </div>
        </div>
      </form>

      <div className="bg-surface-2 border border-line rounded-[8px] p-4">
        <div className="text-[13px] font-medium text-ink mb-[14px]">Email (Resend)</div>
        <Field label="From address">
          <Input defaultValue="noreply@ttgevents.com" />
        </Field>
        <Field label="Resend API key">
          <Input type="password" defaultValue="re_••••••••••••" />
        </Field>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => { setTested(true); setTimeout(() => setTested(false), 2500) }}
            className="text-[12px] text-ink-3 border border-line rounded-[8px] px-[16px] py-2 bg-transparent cursor-pointer hover:text-ink hover:border-ink-4 transition-colors"
          >
            Test email
          </button>
          {tested && <span className="text-[12px] text-green">✓ Sent</span>}
        </div>
      </div>
    </div>
  )
}
