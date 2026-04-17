import { useParams } from 'react-router-dom';
import SertifikatForm from './Form';

export default function SertifikatEdit() {
  const { id } = useParams<{ id: string }>();
  return <SertifikatForm editId={id} />;
}
