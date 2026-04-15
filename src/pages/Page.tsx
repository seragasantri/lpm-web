import './Page.css';

interface PageProps {
  title: string;
  children: React.ReactNode;
}

export default function Page({ title, children }: PageProps) {
  return (
    <div className="page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">{title}</h1>
        </div>
      </div>
      <div className="page-content">
        <div className="container">
          {children}
        </div>
      </div>
    </div>
  );
}
