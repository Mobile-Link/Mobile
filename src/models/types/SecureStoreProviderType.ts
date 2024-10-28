import { SecureStoreActions } from "./SecureStoreActions";
import { SecureStoreType } from "./SecureStoreType";

export type SecureStoreProviderType ={
    stored: SecureStoreType,
    actions: SecureStoreActions,
};