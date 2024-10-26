import { SecureStoreActions } from "./SecureStoreActions";
import { SecureStoreType } from "./SecureStoreType";

export type SecureStoreProvider ={
    stored: SecureStoreType,
    actions: SecureStoreActions,
};