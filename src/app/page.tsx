import { redirect } from 'next/navigation';

export default async function PaginaAntiga() {
  redirect('/login');
  return null;
}
