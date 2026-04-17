import { useParams } from 'react-router-dom';
import GaleriForm from './Form';

export default function GaleriEdit() {
  const { id } = useParams<{ id: string }>();
  return <GaleriForm editId={id} />;
}
