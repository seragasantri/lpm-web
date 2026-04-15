import Page from '../pages/Page';
import './ComingSoon.css';

interface ComingSoonProps {
  title: string;
}

export default function ComingSoon({ title }: ComingSoonProps) {
  return (
    <Page title={title}>
      <div className="coming-soon">
        <div className="coming-soon-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 6v6l4 2" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <h2 className="coming-soon-title">Halaman dalam Pengembangan</h2>
        <p className="coming-soon-desc">
          Konten untuk <strong>{title}</strong> sedang dalam proses pengembangan.
          Terima kasih atas kesabarannya.
        </p>
      </div>
    </Page>
  );
}
