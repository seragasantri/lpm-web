import { useEffect, useRef, useState } from 'react';

export interface SelectInputProps {
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

type TomSelectInstance = {
  destroy: () => void;
  sync: () => void;
  setValue: (v: string) => void;
  open: () => void;
  close: () => void;
};

declare global {
  interface Window {
    TomSelect?: new (el: HTMLSelectElement, opts: Record<string, unknown>) => TomSelectInstance;
  }
}

function loadTomSelect(): Promise<boolean> {
  if (window.TomSelect) return Promise.resolve(true);
  return new Promise((resolve) => {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/css/tom-select.css';
    document.head.appendChild(css);

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/js/tom-select.complete.min.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

let loadPromise: Promise<boolean> | null = null;
function ensureLoaded(): Promise<boolean> {
  if (!loadPromise) loadPromise = loadTomSelect();
  return loadPromise;
}

// Track if TomSelect is currently syncing to prevent dropdown from closing
let isSyncing = false;

export default function SelectInput({
  value = '',
  onChange,
  options,
  placeholder = 'Pilih...',
  disabled = false,
  className = '',
  name,
  id,
  required,
}: SelectInputProps) {
  const selectRef = useRef<HTMLSelectElement>(null);
  const tsRef = useRef<TomSelectInstance | null>(null);
  const onChangeRef = useRef(onChange);
  const optionsRef = useRef(options);
  const [isReady, setIsReady] = useState(false);

  // Keep onChange ref current
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  // Track options
  useEffect(() => { optionsRef.current = options; }, [options]);

  // Init TomSelect once
  useEffect(() => {
    if (!selectRef.current) return;
    ensureLoaded().then((ok) => {
      if (!ok || !window.TomSelect || !selectRef.current) return;
      if ((selectRef.current as unknown as { tomselect?: unknown }).tomselect) return;

      tsRef.current = new window.TomSelect(selectRef.current, {
        plugins: ['dropdown_input'],
        create: false,
        searchField: ['label'],
        sortField: [{ field: '$order' }],
        onChange: (val: unknown) => {
          if (onChangeRef.current && !isSyncing) {
            onChangeRef.current(String(val));
          }
        },
      });
      setIsReady(true);
    });

    return () => {
      if (tsRef.current) {
        try { tsRef.current.destroy(); } catch { }
        tsRef.current = null;
      }
    };
  }, []);

  // Sync options once when ready
  useEffect(() => {
    if (!isReady || !tsRef.current || !selectRef.current) return;

    isSyncing = true;
    const select = selectRef.current;
    while (select.firstChild) select.removeChild(select.firstChild);

    if (placeholder) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = placeholder;
      select.appendChild(opt);
    }

    optionsRef.current.forEach(opt => {
      const optEl = document.createElement('option');
      optEl.value = opt.value;
      optEl.textContent = opt.label;
      select.appendChild(optEl);
    });

    tsRef.current.sync();

    // Restore value after short delay to ensure dropdown is stable
    setTimeout(() => {
      if (value && tsRef.current) {
        try { tsRef.current.setValue(value); } catch { }
      }
      isSyncing = false;
    }, 100);
  }, [isReady]);

  return (
    <>
      <style>{`
        .tom-select-wrap .ts-wrapper {
          border-radius: 0.5rem;
          border: 1px solid #cbd5e1;
          font-size: 0.875rem;
        }
        .tom-select-wrap .ts-wrapper.single .ts-control {
          padding: 0.625rem 2.5rem 0.625rem 0.75rem;
          background: white;
        }
        .tom-select-wrap .ts-wrapper .ts-control {
          border: 1px solid #cbd5e1;
          border-radius: 0.5rem;
        }
        .tom-select-wrap .ts-wrapper.focus .ts-control,
        .tom-select-wrap .ts-wrapper.focus.has-items .ts-control {
          border-color: #38bdf8;
          box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.25);
        }
        .tom-select-wrap .ts-dropdown {
          border-radius: 0.5rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          font-size: 0.875rem;
        }
        .tom-select-wrap .ts-dropdown .option {
          padding: 0.5rem 0.75rem;
        }
        .tom-select-wrap .ts-dropdown .option:hover,
        .tom-select-wrap .ts-dropdown .option.selected {
          background-color: #f0f9ff;
        }
        .tom-select-wrap .ts-control > * {
          display: inline-block;
        }
        .tom-select-wrap .ts-wrapper.single .ts-control > * {
          width: 100%;
        }
      `}</style>
      <div className={`tom-select-wrap ${className}`}>
        <select
          ref={selectRef}
          name={name}
          id={id}
          required={required}
          disabled={disabled}
          value={value}
        >
          <option value="">{placeholder}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
