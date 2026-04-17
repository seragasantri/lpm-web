import { useParams } from 'react-router-dom';
import DownloadForm from './Form';

export default function DownloadEdit() {
  const { id } = useParams<{ id: string }>();
  return <DownloadForm editId={id} />;
}
