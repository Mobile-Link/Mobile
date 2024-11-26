export type SecureStoreActions = {
    setToken: (token:string)=> void;
    getToken: ()=> string | null;
    getStoredToken: () => Promise<string | null>;
    setIdDevice: (idDevice:number)=> void;
    getIdDevice: ()=> number | null;
    getStoredIdDevice: () => Promise<number | null>;
    deleteToken: () => void;
    setFolder: (folder: string)=> void;
    getFolder: () => string | null;
    deleteFolder: () => void;
    getStoredFolder: () => Promise<string | null> 
};