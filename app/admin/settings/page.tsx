import AdminPageHeader from '@/components/admin/AdminPageHeader';
import Card from '@/components/ui/Card';

const SECTIONS = [
  {
    title: 'Company Details',
    fields: [
      { label: 'Company Name', value: 'XCEED India' },
      { label: 'Support Email', value: 'sales@xceedonetouch.com' },
      { label: 'Support Phone', value: '+91 99096 11333' },
    ],
  },
  {
    title: 'GST & Taxes',
    fields: [
      { label: 'GSTIN', value: '27AAECX1234F1Z5' },
      { label: 'Default GST Rate', value: '18%' },
    ],
  },
  {
    title: 'Shipping',
    fields: [
      { label: 'Default Delivery Time', value: '30 Days' },
      { label: 'Priority Delivery (Members)', value: 'Enabled' },
    ],
  },
  {
    title: 'Payment Gateway',
    fields: [
      { label: 'Provider', value: 'Razorpay' },
      { label: 'Mode', value: 'Test' },
    ],
  },
  {
    title: 'WhatsApp API',
    fields: [
      { label: 'Business Number', value: '+91 99096 11333' },
      { label: 'API Status', value: 'Not connected' },
    ],
  },
  {
    title: 'SMTP',
    fields: [
      { label: 'Host', value: 'Configured via backend .env' },
      { label: 'From Address', value: 'sales@xceedonetouch.com' },
    ],
  },
];

export default function SettingsPage() {
  return (
    <main className="p-6">
      <AdminPageHeader title="Settings" subtitle="Company, tax, shipping, payment and integration settings" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {SECTIONS.map((section) => (
          <Card key={section.title} className="p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-red">{section.title}</h2>
            <div className="space-y-3">
              {section.fields.map((f) => (
                <div key={f.label}>
                  <label className="mb-1 block text-xs font-semibold text-brand-charcoal">{f.label}</label>
                  <input
                    defaultValue={f.value}
                    readOnly
                    className="w-full rounded-xl border border-brand-border bg-brand-mist px-3 py-2 text-sm text-brand-charcoal"
                  />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <p className="mt-4 text-xs text-brand-slate/70">
        Showing demo values — SMTP is genuinely read from the backend .env file; everything else here is read-only for now.
      </p>
    </main>
  );
}
