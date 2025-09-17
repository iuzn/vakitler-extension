import {
  BaseStorage,
  createStorage,
  StorageType,
} from '@/shared/storages/base';

type VisibilityStorage = BaseStorage<boolean> & {
  toggle: () => Promise<void>;
};

const storage = createStorage<boolean>('visibility-storage-key', false, {
  storageType: StorageType.Local,
  liveUpdate: true,
});

const visibilityStorage: VisibilityStorage = {
  ...storage,
  toggle: async () => {
    await storage.set((current) => !current);
  },
};

export default visibilityStorage;
