import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

export async function checkSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}
