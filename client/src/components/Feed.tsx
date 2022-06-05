import { Button, Flex, Spinner, Text, useMediaQuery } from "@chakra-ui/react";
import { RepeatIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import PullToRefresh from 'react-simple-pull-to-refresh';
import { useGetPostsFromFollowing } from "../api/query/userQuery";
import { Page, Post } from "../types";
import FeedCard from "./FeedCard";


const scrollbarStyle = {
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#f1f1f1',
          borderRadius: '24px',
        },
}

const transitionStyle = {
		transition: 'all 0.3s ease-in-out',
}

const Feed: React.FC = () => {

	const [page, setPage] = useState<number>(1);
	const firstLoad = useRef<boolean>(true);
	const [refreshText, setRefreshText] = useState<string>("");

    // Get all the posts from people we follow, then send those posts into respective feed cards
	// isFetching to display loading, hasNextPage to check if next page exists, fetchNextPage to fetch next page, error for error display
	const {data, error, isFetching, hasNextPage, fetchNextPage, refetch} = useGetPostsFromFollowing(page, 7);
	const listInnerRef = useRef<HTMLDivElement>(null);

	// To call fetchNextPage when user has scrolled to the bottom of the feed
	const onScroll = () => {
		if (listInnerRef.current) {
			const {scrollTop, scrollHeight, clientHeight} = listInnerRef.current;
			if (scrollTop + clientHeight === scrollHeight) {
				if (hasNextPage) {
					setPage(page + 1);
					firstLoad.current = false;
				}
			}
		}
	};
	// Needed to use the current page value for the infinite query
	useEffect(() => {
		if (!firstLoad.current) { // To not fetch on first load
			fetchNextPage();
		}
	}, [page]);

    const renderFeedCards = () => {
		const renders: JSX.Element[] = [];
		// The data should contain all fetched pages of posts
		// For each page, display posts on page
        data?.pages.forEach((page: Page) => {
			page.posts.forEach((post: Post) => { 
				renders.push(
					<FeedCard
					post={post}
					key={post._id}
					/>
					)
				})
			})
			
		return renders;
	}
	// Refetch when user clicks on refresh button
	const handleRefreshClick = async () => {
		setRefreshText("");
		await refetch();
		setRefreshText("Refreshed!");
		setTimeout(() => {
			setRefreshText("");
		}, 6000);
	}
	const isSmallScreen = window.innerWidth < 1000;
    // Check if we got an error
    if(error) return <Text color={'red'}>Error loading posts!</Text>
	
    return (
		<PullToRefresh onRefresh={handleRefreshClick} maxPullDownDistance={100} resistance={0.9} isPullable={isSmallScreen ? true : false}>
			<Flex style={transitionStyle} flexDir={'column'} width="100%"  maxHeight='90vh' alignItems={ isSmallScreen ? 'center' :'end'} onScroll={onScroll} ref={listInnerRef} overflowY={'scroll'} css={scrollbarStyle}>
						{ isSmallScreen ? 
							<Flex flexDir={'column'} alignItems="center"><Text fontWeight={"bold"} color="darkGray" p="0.5rem">{refreshText}</Text><ChevronDownIcon w={10} h={10} color="darkGray" marginTop="-1.2rem"/></Flex>
							:
							<Button onClick={handleRefreshClick} textAlign={"start"} m="0 0.5rem 0 " p=" 0.5rem 1rem" color={"purple"} background="none">{refreshText}<span><RepeatIcon fontSize="1.5rem" margin="0 0 0 0.5rem"/></span></Button>
						}
						{
							data && renderFeedCards() // If data exists, render data
						}
						{isFetching && <Spinner/>}
			</Flex>
		</PullToRefresh>
    )
}

export default Feed;