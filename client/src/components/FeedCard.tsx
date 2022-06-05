import React from "react"
import { Avatar, Center, Divider, Flex, IconButton, Text, useQuery } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import { useQueryClient } from "react-query"
import { useCreateLike, useDeleteLike } from "../api/mutation/likeMutation"
import { useGetLike } from "../api/query/likeQuery"
import { useGetSoundUrl, useGetUser, useGetUserById } from "../api/query/userQuery"
import { Post } from "../types"
import AudioVisualizer from "./AudioVisualizer"
import { BoneIcon } from "./Icons/BoneIcon"
import { BoneOutlineIcon } from "./Icons/BoneOutlineIcon"
import { dislikePost, likePost } from "../api/mutation/userMutation"

type Props = {
    post: Post,
}

const FeedCard: React.FC<Props> = ({ post }) => {
    const client = useQueryClient();
    const author = useGetUserById(post.author);
    const urlObject = useGetSoundUrl(post._id);
	const user = useGetUser();
    const [url, setUrl] = useState<string | null>(null);
    const currentUser = useGetUser();
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [doFakeIncrement, setDoFakeIncrement] = useState(false);

    useEffect(() => {
        if (!currentUser.data) return;
        // Update state for if the post is liked after we have gotten a user id
    }, [currentUser.data])

	// Needed to convert to correct timezone
	let dateString = post.createdAt.toLocaleString('sv-SE');
	let date = new Date(dateString); 

	// Convert back to string and format
	let newDateString = date.toLocaleString();
	newDateString = newDateString.slice(0, -3);

    useEffect(() => {
        if (urlObject.data && urlObject.data.url) {
            setUrl(urlObject.data.url);
        }
    }, [urlObject]);

    // useEffect(() => {
    //     setDoFakeIncrement(false);
    // }, [post.amountOfLikes])

    useEffect(() => {
        if(!user.data) return;
        setIsLiked(post.usersLikes.findIndex(uid => uid == user.data._id) != -1);
    }, [post]);

    useEffect(() => {
        console.log(isLiked);
    }, [isLiked])

    const onBoneClick = async() => {
        if(!isLiked) {
            await likePost(user.data._id!, post._id);
        }else {
            await dislikePost(user.data._id!, post._id);
        }
        client.invalidateQueries('follow-posts');
    }

    return (
        <Flex width="90%" padding={'16px'} flexDir={'column'}>
            {/* TOP HEADER */}
            <Flex>
                <Avatar marginLeft={'12px'} size={'md'} borderColor={'purple'} borderWidth={'2px'}  name={author.data && author.data[0].name}/>
                <Center>
                    <Text marginLeft={'8px'} display={'table-cell'} verticalAlign={'middle'} color="darkText">
                        {author.data && author.data[0].name}
                    </Text>
                </Center>
                <Text marginTop={'auto'} marginBottom={'auto'} marginLeft={'auto'} fontWeight={'bold'} color={'darkGray'}>
                    {newDateString}
                </Text>
            </Flex>
            {url && <AudioVisualizer url={url} />}
            {/* BOTTOM BONE */}
            <Flex marginLeft={'12px'}>
                {/* Uses SVG, so it doesn't work with the internal theme colors!*/}
                <IconButton onClick={onBoneClick} w={7} h={7} color="purple" variant="unstyled" aria-label="like post" icon={
                    <Center transform={"scale(2)"} height="100%" scale="">
                        {(user.data && 
                            isLiked ? 
                                <BoneIcon /> 
                                    : 
                                <BoneOutlineIcon />)}
                    </Center>
                } />
                <Text paddingLeft={"8px"} marginTop={'auto'} marginBottom={'auto'} fontWeight={'bold'} color="purple">
                    {post.amountOfLikes + (doFakeIncrement ? 1 : 0)}
                </Text>
            </Flex>
            <Divider color="gray" borderBottomWidth={4} marginTop={6} />

        </Flex>
    )
}

export default FeedCard;