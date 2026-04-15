import { Download, FileText, Link as LinkIcon, Calendar } from 'lucide-react';
import { downloadFiles } from '../data';
import './DownloadSection.css';

export default function DownloadSection() {
  const getIcon = (type?: string) => {
    if (type === 'link') return <LinkIcon size={18} />;
    return <FileText size={18} />;
  };

  return (
    <div className="download-section">
      <div className="download-header">
        <Download size={20} className="download-header-icon" />
        <h3 className="download-title">Download File</h3>
      </div>

      <ul className="download-list">
        {downloadFiles.map((file) => (
          <li key={file.id} className="download-item">
            <a href={`#file-${file.id}`} className="download-link">
              <div className="download-link-icon">
                {getIcon(file.type)}
              </div>
              <div className="download-link-info">
                <span className="download-link-title">{file.title}</span>
                <span className="download-link-meta">
                  <Calendar size={12} />
                  {file.date}
                  {file.size && ` • ${file.size}`}
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>

      <a href="/download" className="download-all-link">
        Pengumuman Lainnya <span>&#8594;</span>
      </a>
    </div>
  );
}
