// 'use client';
// import { useEffect } from 'react';
// import { pusherClient } from '@/lib/pusher-client';
// import toast from 'react-hot-toast';
// import { BellIcon } from 'lucide-react';

// type Props = {
//   userId?: string;
// };

// export default function NotificationListener({ userId }: Props) {
//   useEffect(() => {
//     if (!userId) {
//       console.warn('⚠️ No userId provided');
//       return;
//     }

//     const channelName = `private-user-${userId}`;
//     console.log(`🔔 Subscribing to ${channelName}`);
//     const channel = pusherClient.subscribe(channelName);

//     channel.bind('pusher:subscription_succeeded', () => {
//       console.log('✅ Subscription succeeded');
//       toast.success('Pusher connected!');
//     });

//   // In NotificationListener.tsx
// channel.bind('new-codebuddy-request', (data: {
//   message: string;
//   senderName?: string;
// }) => {
//   console.log('📩 Notification received:', data);

//   // Use a formatted message
//   toast.success(
//     `${data.senderName || 'Someone'} sent a request: ${data.message}`
//   );

//   // // Optional: Add notification sound
//   // new Audio('/notification.mp3').play().catch(console.error);
// });

//     return () => {
//       console.log(`🔌 Unsubscribing from ${channelName}`);
//       channel.unbind_all();
//       pusherClient.unsubscribe(channelName);
//     };
//   }, [userId]);

//   return null;
// }
