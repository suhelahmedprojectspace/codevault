import Ably from 'ably';

let ablyInstance: Ably.Realtime | null = null;

export const getAblyClient = () => {
  if (!ablyInstance) {
    ablyInstance = new Ably.Realtime({
      authUrl: 'api/ably-auth',
      authMethod: 'POST'
    });
  }
  return ablyInstance;
};