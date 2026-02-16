import { map } from 'nanostores';

export type SettingsTab = 'general' | 'team' | 'billing' | 'limits';

export interface SettingsModalState {
  isOpen: boolean;
  activeTab: SettingsTab;
}

export const settingsModalStore = map<SettingsModalState>({
  isOpen: false,
  activeTab: 'general',
});

export function openSettingsModal(tab: SettingsTab = 'general') {
  settingsModalStore.set({ isOpen: true, activeTab: tab });
}

export function closeSettingsModal() {
  settingsModalStore.set({ isOpen: false, activeTab: 'general' });
}

export function setSettingsTab(tab: SettingsTab) {
  settingsModalStore.setKey('activeTab', tab);
}
