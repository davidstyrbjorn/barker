import { Flex, HStack, StackDivider, useMediaQuery } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { useGetUser } from "../api/query/userQuery";
import Feed from "../components/Feed";
import NavBar from "../components/NavBar";
import ProfileCard from "../components/ProfileCard";
import SearchForUsers from "../components/SearchForUsers";

const stackStyle: React.CSSProperties = {
	alignSelf: "center",
	width: "100%",
	height: "92vh",
	paddingTop: "20px",
	alignItems: "start"
};

const HomePageWebView: React.FC<{}> = () => {
	const user = useGetUser(); // State for getting user data
	
	return (
		<Flex h="100vh" background={"egg"} flexDirection="column">
			<NavBar />
			<HStack
				style={stackStyle}
				divider={<StackDivider borderWidth={2} borderColor="gray" />}
				spacing={4}
				flex={1}
			>	
				{/* Display each of the 3 columns, profile, feed, search */}
				<Flex flex={1} justifyContent="end" paddingRight={2} paddingLeft={2}>
					<Flex maxW="20rem" width="100%" >
						<ProfileCard name={user.data.name} />
					</Flex>
				</Flex>
				<Flex flex={1}>
					<Feed />
				</Flex>
				<Flex flex={1} paddingLeft={2} paddingRight={2} justifyContent="start" >
					<Flex maxW="20rem" width="100%" >
						<SearchForUsers />
					</Flex>
				</Flex>
			</HStack>
		</Flex>

	);
}

const HomePagePhoneView: React.FC<{}> = () => {

	return (
		<Flex h="100vh" background={"egg"} flexDirection="column">
			<NavBar />
			<Flex flex={1}>
				<Feed />
			</Flex>
		</Flex>
	);
}

const HomePage: React.FC<{}> = () => {

	const isSmallScreen = useMediaQuery("(max-width: 1000px)");

	return (
		!isSmallScreen[0] ? <HomePageWebView /> : <HomePagePhoneView />
	);
}
export default HomePage;