export type SecureStoreActions = {
    setToken: (token:string)=> void;
    getToken: ()=> string | null;
    getStoredToken: () => Promise<string | null>;
    setIdDevice: (idDevice:number)=> void;
    getIdDevice: ()=> number | null;
    getStoredIdDevice: () => Promise<number | null>;
    setUsername: (username:string)=> void;
    getUsername: ()=> string | null;
};