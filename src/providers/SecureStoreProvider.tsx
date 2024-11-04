import { createContext, JSX, useContext, useEffect, useState } from "react";
import { SecureStoreType } from "../models/types/SecureStoreType.js";
import { SecureStoreActions } from "../models/types/SecureStoreActions.js";
import * as SecureStore from 'expo-secure-store';
import { SecureStoreProviderType } from "../models/types/SecureStoreProviderType.js";

const SecureStoreContext = createContext<SecureStoreProviderType | null>(null);

function SecureStoreProvider({ children }: { children: JSX.Element }) {

  const [stored, setStored] = useState<SecureStoreType>({idDevice: null, token: null});
  
  const actions: SecureStoreActions = {
    setToken(token: string) {
      SecureStore.setItem("token", token);
      setStored((prevState:SecureStoreType) => {return{...prevState, token}});
    },
    getToken() {
      return stored.token;
    },
    getStoredToken() {
      return SecureStore.getItemAsync("token")
    },
    setIdDevice(idDevice: number) {
      SecureStore.setItem("idDevice", idDevice.toString());
      setStored((prevState:SecureStoreType) => {return{...prevState, idDevice}});
    },
    getIdDevice() {
      return stored.idDevice;
    },
    getStoredIdDevice() {
      return new Promise<number | null>((resolve, reject) => {        
        SecureStore.getItemAsync("idDevice").then((idDevice)=>{
          resolve(idDevice ? parseInt(idDevice) : null);
        }).catch(()=>resolve(null))
      })
    },
    deleteToken() {
        SecureStore.deleteItemAsync("token");
        setStored((prevState:SecureStoreType) => {return{...prevState, token: null}});
    }
  };

  return (
    <SecureStoreContext.Provider value={{ stored, actions }}>
      {children}
    </SecureStoreContext.Provider>
  );
}
const useSecureStore = () => {
  const context = useContext(SecureStoreContext);
  if (!context) {
    throw new Error('useSecureStore must be used within a SecureStoreProvider');
  }
  return context;
}
export { SecureStoreProvider, useSecureStore };