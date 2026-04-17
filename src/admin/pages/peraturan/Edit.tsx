import { useParams } from 'react-router-dom';
import Form from './Form';

export default function EditPage() {
  const { id } = useParams<{ id: string }>();
  return <Form editId={id} />;
}
