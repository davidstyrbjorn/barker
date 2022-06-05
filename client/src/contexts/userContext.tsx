import React, { createContext, ReactElement, useState } from "react";
import { useQuery } from "react-query";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { client } from "../api/httpCommon";
import { User } from "../types";

export const UserContext = createContext<User>(
    {name: "dave", supertokensId: '3', following: [], likedPosts: [], posts: []
});

const UserProvider: React.FC<{children: ReactElement}> = ({children}) => {
    const {userId} = useSessionContext();
    // Actual user
    const [user, setUser] = useState<User>(
        {name: "dave", supertokensId: '3', following: [], likedPosts: [], posts: []}
    );

    useQuery<User>(['user'], async () => {
        return await (await client.get<User>(`/user/get-supertokens?id=${userId}`)).data;
    }, {
        onSuccess: (res: User) => {
            setUser(res);
            console.log(res)
        },
        onError: (err) => {
            console.log("User get ERROR: " + err);
        }
    });

    // useEffect(() => {
        
    // }, [])

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;