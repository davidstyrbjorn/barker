import { SearchIcon } from "@chakra-ui/icons";
import { throttle } from "lodash";
import { Avatar, Center,Flex, Heading, IconButton, Input, InputGroup, InputRightAddon, Text } from "@chakra-ui/react";
import React, { useCallback, useState, useEffect} from "react";
import { BarkerLogoSVGBigGray } from "./BarkerLogoSVG";
import { useQuery } from "react-query";
import { useGetFollowing, useGetUser } from "../api/query/userQuery";
import { useSearchUsers} from "../api/query/userQuery";
import { useUpdateFollowing } from "../api/mutation/userMutation";
import { User } from "../types";


const inputGroupStyle: React.CSSProperties = {
    width: "100%",
    marginTop: '16px'
}

type UserCardProps = {
    user: User;
    onFollowClick: (id: string) => void;
    id: string;
    followed: boolean;
}

const UserCard: React.FC<UserCardProps> = ({user, onFollowClick, id, followed}) => {
    return (
        <Flex backgroundColor={'almostWhite'} paddingTop="16px" key={id}>
            <Avatar size={'md'} borderColor={'purple'} borderWidth={'2px'} name={user.name} />
            <Center>
                <Text marginLeft={'8px'} display={'table-cell'} verticalAlign={'middle'} color="darkText">{user.name}</Text>
            </Center>
            <Text onClick={() => onFollowClick(id)} cursor="pointer" transition="all 0.5s ease" marginTop={'auto'} marginBottom={'auto'} marginLeft={'auto'} fontWeight={'bold'} color={followed ? "red" : "purple"}>{followed ? "Trailing ✓" : "Trail +"}</Text>
        </Flex>
    );
}
const SearchForUsers: React.FC = () => {
    // Search operations
    const [searchWord, setSearchWord] = useState("");
    const [actualTerm, setActualTerm] = useState("");
    // State of following users
    const [following, setFollowing] = useState<string[]>([]);
    const user = useGetUser();
    // Data of users to be displayed
    const [users, setUsers] = useState(Array<User>());        
    const { data } = useSearchUsers(actualTerm);
    const { mutate } = useUpdateFollowing();
    const followedUsers = useGetFollowing();
    // Set user to data
    useEffect(() => { if(data) setUsers(data);}, [data]);
    // Fires when follower list is updated
    useEffect(() => { if(user) setFollowing(user.data.following);}, [user, following]);

    // Is the user following the searched user?
    const isFollowed = (id: string) => {
        return following.includes(id);
    }
    // Update following list when a user is clicked
    const onFollowClick = (id: string) => {
        // If user is already followed, unfollow
        if(isFollowed(id)){
            following.splice(
                following.findIndex(u => u == id), 
                1
            );
        }else{ // Otherwise, follow
            following.push(id);
        }
        //Update following data and state
        user.data.following = following;
        setFollowing(following);
        // Mutate user using the updated user
        mutate(user.data);
    }
    // Throttled search function to only run every 500ms when updated
    const searchForUsers = useCallback(
        throttle((newWord) => {
            // Fetch users from backen api
            if(!newWord) return;
            setActualTerm(newWord);
        }, 500), []
    );    

    // Listen for changed value in the search input and update the state
    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchWord(e.target.value);
    }

    // Call throttled function when search word changes
    useEffect(() => searchForUsers(searchWord), [searchWord]);

    return (
        <Flex paddingTop={12} flexDir={'column'}> 
            <Heading color="red">Search</Heading>
            {/* Search form */}
            <InputGroup borderColor={'gray'} variant={'outline'} style={inputGroupStyle}>
                <Input borderRight={'none'} placeholder="What are you looking for buddy?" onChange={onSearchChange}/>
                <InputRightAddon borderLeft={'none'} children={ <IconButton margin={'0'} background={'none'} icon={<SearchIcon color="purple" />} aria-label={""}/>}/>
            </InputGroup>
            {/* Bottom part placeholder for when no search is in */}
            {/* User cards */} 
            {(searchWord != '') ? 
                users.length > 0 ? (
                <Flex flexDir={'column'}>
                    {users.map((user, idx) => 
                        <UserCard key={idx} user={user} onFollowClick={onFollowClick} id={user._id!} followed={isFollowed(user._id!)}/>
                    )}
                </Flex>) : (
                <Flex flexDir={'column'} alignItems={'center'} paddingTop={"86px"}>
                    <BarkerLogoSVGBigGray/>
                    <Text textAlign={"center"} width="50%" paddingTop={"16px"} fontWeight={'bold'} color="darkGray">We couldn't sniff out someone by that name!</Text>
                </Flex>
                )
                : (
                    <Flex flexDir={'column'}>
                        <Text textAlign={"start"} paddingTop={"16px"} fontWeight={'bold'} color="darkGray">Current trails</Text>
                        {!followedUsers.isLoading && followedUsers.data && followedUsers.data.map((u, idx) => {
                            return <UserCard key={idx} user={u} onFollowClick={onFollowClick} id={u._id!} followed={true}/>
                        })}
                    </Flex>
                )
            }
        </Flex>
    )
}
export default SearchForUsers;
