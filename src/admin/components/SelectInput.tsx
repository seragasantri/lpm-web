import { useEffect, useRef, useMemo, useState } from 'react';

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
};

declare global {
  interface Window {
    TomSelect?: new (el: HTMLSelectElement, opts: Record<string, unknown>) => TomSelectInstance;
    _tsLoaded?: boolean;
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
    script.onload = () => { window._tsLoaded = true; resolve(true); };
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

// Singleton promise — TomSelect loads only once
let _loadPromise: Promise<boolean> | null = null;
function ensureLoaded(): Promise<boolean> {
  if (!_loadPromise) _loadPromise = loadTomSelect();
  return _loadPromise;
}

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
  const [mountId] = useState(() => Math.random().toString(36).slice(2, 8));

  console.log(`[TS #${mountId}] RENDER name=${name} optionsCount=${options.length}`);

  useEffect(() => {
    return () => { console.log(`[TS #${mountId}] UNMOUNT name=${name}`); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep onChange ref current
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  // Init TomSelect on mount
  useEffect(() => {
    console.log(`[TS] MOUNT name=${name}, window.TomSelect:`, typeof window.TomSelect);
    ensureLoaded().then((ok) => {
      console.log(`[TS] loaded, ok=${ok}, selectRef:`, !!selectRef.current, 'TomSelect:', typeof window.TomSelect);
      if (!ok || !selectRef.current || !window.TomSelect) return;

      setTimeout(() => {
        console.log(`[TS] setTimeout, selectRef:`, !!selectRef.current);
        if (!selectRef.current || !window.TomSelect) return;
        const el = selectRef.current;
        console.log(`[TS] el tagName:`, el.tagName, 'hasTS:', !!(el as unknown as { tomselect?: unknown }).tomselect);

        if ((el as unknown as { tomselect?: unknown }).tomselect) {
          console.log(`[TS] already initialized, SKIP`);
          return;
        }

        try {
          tsRef.current = new window.TomSelect(el, {
            plugins: ['dropdown_input'],
            create: false,
            searchField: ['label'],
            sortField: [{ field: '$order' }],
            onChange: (val: unknown) => {
              if (onChangeRef.current) onChangeRef.current(String(val));
            },
          });
          console.log(`[TS] INIT SUCCESS`);
        } catch (e) {
          console.error(`[TS] INIT FAILED:`, e);
        }
      }, 50);
    });

    return () => {
      console.log(`[TS] CLEANUP name=${name}`);
      if (tsRef.current) {
        try { tsRef.current.destroy(); } catch { }
        tsRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value changes
  useEffect(() => {
    if (!tsRef.current || !selectRef.current) return;
    if (selectRef.current.value !== value) {
      try { tsRef.current.setValue(value); } catch { }
    }
  }, [value]);

  const stableOptions = useMemo(() => options, [options]);

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
          defaultValue={value}
        >
          <option value="">{placeholder}</option>
          {stableOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
