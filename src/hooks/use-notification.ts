import { useEffect, useState, useCallback, useRef } from 'react';
import { RootState } from '@/lib/store/store';
import { setCounts } from '@/redux/notificationSlice';
import { useSession } from 'next-auth/react';
import axios from '@/lib/axios';
import { useDispatch,useSelector } from 'react-redux';

type NotificationEvent = {
  type: 'SNIPPET' | 'BLOG' | 'CONNECTION';
  data?: {
    sender?: {
      id: string;
      name: string;
      image?: string;
    };
    message?: string;
  };
};

export function useNotifications() {
  const { data: session } = useSession();
  const dispatch=useDispatch();
  const counts=useSelector((state:RootState)=>state.notifications);


  // const [counts, setCounts] = useState({
  //   snippetCount: 0,
  //   blogCount: 0,
  //   codeBuddyCount: 0
  // });
  // const channelRef = useRef<any>(null);
  // const pusherRef = useRef<any>(null);

  const fetchCounts = useCallback(async () => {
    try {
      const { data } = await axios.get('/notifications');
      dispatch(
        setCounts({
           snippetCount: data.snippetCount || 0,
          blogCount: data.blogCount || 0,
          codeBuddyCount: data.codeBuddyCount || 0,
        })
      );
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  }, []);

  return {
    ...counts,
    fetchCounts
  };
}