import { useState } from 'react'
import { useAdminStoreId } from '@ttg/auth'
import { useStoreById } from '@ttg/hooks'
import { Button, Field, FieldLabel, Input, Spinner } from '@ttg/ui'

export function SettingsPage() {
  const storeId = useAdminStoreId()
  const { data: store, isLoading } = useStoreById(storeId ?? '')
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (isLoading) return <div className="flex justify-center py-16"><Spinner /></div>
  if (!store) return <div className="p-8 text-ink-3">Store not found.</div>

  return (
    <div className="p-6 max-w-[600px]">
      <div className="mb-6">
        <h1 className="text-[20px] font-semibold text-ink">Store Settings</h1>
        <p className="text-[12px] text-ink-3 mt-0.5">Manage your store profile</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="bg-surface-2 border border-line rounded-[10px] p-5">
          <p className="text-[11px] font-semibold text-ink-4 uppercase tracking-wider mb-4">Store Profile</p>
          <div className="grid grid-cols-2 gap-4">
            <Field className="col-span-2">
              <FieldLabel>Store name</FieldLabel>
              <Input defaultValue={store.name} />
            </Field>
            <Field>
              <FieldLabel>City</FieldLabel>
              <Input defaultValue={store.city} />
            </Field>
            <Field>
              <FieldLabel>Country</FieldLabel>
              <Input defaultValue={store.country} />
            </Field>
            <Field className="col-span-2">
              <FieldLabel>Address</FieldLabel>
              <Input defaultValue={store.address} />
            </Field>
            <Field className="col-span-2">
              <FieldLabel>Website</FieldLabel>
              <Input type="url" defaultValue={store.website ?? ''} placeholder="https://yourstore.com" />
            </Field>
          </div>
        </div>

        <div className="bg-surface-2 border border-line rounded-[10px] p-5">
          <p className="text-[11px] font-semibold text-ink-4 uppercase tracking-wider mb-4">Defaults</p>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Default currency</FieldLabel>
              <Input defaultValue="CZK" />
            </Field>
            <Field>
              <FieldLabel>Default event capacity</FieldLabel>
              <Input type="number" defaultValue="24" />
            </Field>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit">Save Changes</Button>
          {saved && <p className="text-[12px] text-green">✓ Saved</p>}
        </div>
      </form>

      <div className="mt-6 pt-5 border-t border-line">
        <p className="text-[12px] font-semibold text-ink-3 mb-1">Danger zone</p>
        <p className="text-[12px] text-ink-4 mb-3">These actions are irreversible. Contact support to delete your store account.</p>
        <Button variant="danger" size="sm" onClick={() => alert('Contact support@ttgevents.com to delete your account.')}>
          Request Account Deletion
        </Button>
      </div>
    </div>
  )
}
