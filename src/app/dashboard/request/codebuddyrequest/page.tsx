'use client';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/store/store';
import toast from 'react-hot-toast';
import axios from '@/lib/axios';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotifications } from '@/hooks/use-notification';
type NotificationPayload = {
  type: 'CONNECTION';
  id: string;
  requester: {
    email: string;
    username: string;
    image: string | null;
  };
  requestId: string;
  status: string;
};

const CodeBuddyRequest = () => {
  const [data, setData] = useState<NotificationPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const notifications = useAppSelector((state) => state.notifications.list);
  const { fetchCounts } = useNotifications();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/codebuddy/request');
        setData(response.data.request);
        console.log(`aur ya fetcdata ka response ${response.data.request}`);
      } catch (error) {
        toast.error('Failed to fetch code buddy requests.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAction = async (id: string, action: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await axios.patch(`/codebuddy/request`, {
        requestId: id,
        status: action,
      });
      console.log(`ya handleAction ka id ha ${id}`);
      toast.success(action === 'APPROVED' ? 'Request accepted successfully.' : 'Request rejected.');
      setData((prev) => prev.filter((req) => req.id !== id));
      fetchCounts();
    } catch (error) {
      toast.error('Something went wrong.');
      console.error(error);
    }
  };

  //   useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchCounts();
  //   }, 30000); // every 30s

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
        Incoming Code Buddy Requests
      </h2>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-md" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">
          You have no new buddy requests right now.
        </p>
      ) : (
        data.map((request) => (
          <Card
            key={request.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border shadow-sm rounded-lg"
          >
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <img
                src={request.requester.image ?? '/default-avatar.png'}
                alt={request.requester.username}
                className="w-12 h-12 rounded-full border object-cover"
              />
              <div>
                <CardTitle className="text-base font-medium text-gray-900 leading-tight">
                  {request.requester.username}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  wants to connect with you as a <strong>Code Buddy</strong>.
                </p>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap lg:justify-end justify-center">
              <Button size="sm" onClick={() => handleAction(request.id, 'APPROVED')}>
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAction(request.id, 'REJECTED')}
              >
                Decline
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default CodeBuddyRequest;
