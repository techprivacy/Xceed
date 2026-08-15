'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// Drop-in replacement for <input type="password">: same props, same
// className goes straight onto the input (including margin/width utilities
// — the wrapper div is a bare block element, so margin collapses through it
// exactly as if the className were on the input directly). Adds a toggle eye
// button to reveal/hide the value; tabIndex={-1} keeps it out of the normal
// tab order so it doesn't sit between the field and the submit button.
type PasswordInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

export default function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input {...props} type={visible ? 'text' : 'password'} className={`${className ?? ''} pr-10`} />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-slate transition-colors hover:text-brand-charcoal"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
