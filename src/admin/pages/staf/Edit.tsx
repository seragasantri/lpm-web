import { useParams } from 'react-router-dom';
import StafForm from './Form';

export default function StafEdit() {
  const { id } = useParams<{ id: string }>();
  return <StafForm editId={id} />;
}
