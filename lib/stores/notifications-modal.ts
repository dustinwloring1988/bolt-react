import { map } from 'nanostores';

export interface NotificationItem {
  id: string;
  title: string;
  timestamp: string;
}

export const notificationsModalStore = map<{
  isOpen: boolean;
}>({
  isOpen: false,
});

export function openNotificationsModal() {
  notificationsModalStore.set({ isOpen: true });
}

export function closeNotificationsModal() {
  notificationsModalStore.set({ isOpen: false });
}
