import {Redirect, router, Stack, Tabs} from "expo-router";
import {useEffect, useState} from "react";
import {useSecureStore} from "@/src/providers/SecureStoreProvider";


export default function Layout() {
    const {actions, stored} = useSecureStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        actions.getStoredToken().then((token) => {
            console.log(token)
            
            if (token == null) {
                router.replace('/loginScreen')
                return
            }
            
            setLoading(false)
            actions.setToken(token)
        })
    }, []);

    return (
        <>
            {!loading && 
                <Tabs>
                    <Tabs.Screen name="index"  options={{
                        headerShown: false,
                    }}
                    />
                    {/*<Stack.Screen name="tokenScreen" options={{*/}
                    {/*  title: 'Token',*/}
                    {/*  }}*/}
                    {/*/>*/}
                </Tabs>
            }
        </>
    )
}