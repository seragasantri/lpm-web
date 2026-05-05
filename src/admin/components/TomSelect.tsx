import { useEffect, useRef, useState } from 'react';

interface TomSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
  id?: string;
  required?: boolean;
}

type TomSelectType = {
  destroy: () => void;
  sync: () => void;
  setValue: (v: string) => void;
  open: () => void;
  close: () => void;
};

declare global {
  interface Window {
    TomSelect?: new (el: HTMLSelectElement, opts: Record<string, unknown>) => TomSelectType;
  }
}

export default function TomSelect({
  value,
  onChange,
  options,
  placeholder = 'Pilih...',
  disabled = false,
  className = '',
  name,
  id,
  required,
}: TomSelectProps) {
  const selectRef = useRef<HTMLSelectElement>(null);
  const tsRef = useRef<TomSelectType | null>(null);
  const onChangeRef = useRef(onChange);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  useEffect(() => {
    if (!selectRef.current) return;
    if (typeof window.TomSelect === 'undefined') return;
    if ((selectRef.current as unknown as { tomselect?: unknown }).tomselect) return;

    tsRef.current = new window.TomSelect(selectRef.current, {
      plugins: ['dropdown_input'],
      create: false,
      onChange: (val: unknown) => {
        if (onChangeRef.current) onChangeRef.current(String(val || ''));
      },
    });
    setIsReady(true);

    return () => {
      if (tsRef.current) {
        try { tsRef.current.destroy(); } catch { }
        tsRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!tsRef.current || !isReady) return;
    if (value !== undefined && value !== null && value !== '') {
      try { tsRef.current.setValue(value); } catch { }
    }
  }, [value, isReady]);

  useEffect(() => {
    if (!selectRef.current || !tsRef.current || !isReady) return;

    const select = selectRef.current;
    while (select.firstChild) select.removeChild(select.firstChild);

    const placeholderOpt = document.createElement('option');
    placeholderOpt.value = '';
    placeholderOpt.textContent = placeholder;
    select.appendChild(placeholderOpt);

    options.forEach(opt => {
      const optEl = document.createElement('option');
      optEl.value = opt.value;
      optEl.textContent = opt.label;
      select.appendChild(optEl);
    });

    try { tsRef.current.sync(); } catch { }

    if (value && value !== '') {
      try { tsRef.current.setValue(value); } catch { }
    }
  }, [options, placeholder, isReady]);

  return (
    <>
      <style>{`
        .tom-select-wrap .ts-wrapper {
          border-radius: 0.5rem !important;
          border: 1px solid #cbd5e1 !important;
          font-size: 0.875rem !important;
        }
        .tom-select-wrap .ts-wrapper.single .ts-control {
          padding: 0.625rem 2.5rem 0.625rem 0.75rem !important;
          background: white !important;
        }
        .tom-select-wrap .ts-wrapper.focus .ts-control,
        .tom-select-wrap .ts-wrapper.focus.has-items .ts-control {
          border-color: #38bdf8 !important;
          box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.25) !important;
        }
        .tom-select-wrap .ts-dropdown {
          border-radius: 0.5rem !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
          font-size: 0.875rem !important;
        }
        .tom-select-wrap .ts-dropdown .option:hover {
          background-color: #f0f9ff !important;
        }
        .tom-select-wrap .ts-dropdown .option.selected {
          background-color: #e0f2fe !important;
        }
      `}</style>
      <div className={`tom-select-wrap ${className}`}>
        <select
          ref={selectRef}
          name={name}
          id={id}
          required={required}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </>
  );
}
