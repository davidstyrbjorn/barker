import { Avatar, Button, Flex, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import { useQueryClient } from "react-query";
import { redirectToAuth, signOut } from "supertokens-auth-react/recipe/emailpassword";
import { useGetUser } from "../api/query/userQuery";

type Props = {
	name: string,
}

const ProfileCard: React.FC<Props> = ({name}) => {
	const user = useGetUser();

	const queryClient = useQueryClient();

	const onBarkClick = () => {
		// Redirect to /create
		window.location.href = "/create";
	}

	const onLogoutClick = async() => {
		// Invalidate session cookie
		document.cookie = 'sFrontToken' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		document.cookie = 'sIRTFrontend' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';

		// Logout the user
		await signOut();

		// Invalidate cache and such so that we use the newly logged in user's stuff later
		queryClient.invalidateQueries();

		await redirectToAuth();
	}

	return (
		
		<Flex flexDir={"column"} width={"100%"} alignItems={'center'} paddingTop={12}>
			<Flex alignSelf={'flex-start'}>
				<Avatar size={'md'} borderColor={'purple'} borderWidth={'2px'} name={user.data.name} />
				<Flex w="full" alignItems="center">
					<Text fontSize={'3xl'} marginLeft={8} display={'table-cell'} verticalAlign={'middle'} color="darkText">
						{name}
					</Text>
				</Flex>
			</Flex>

			<Button marginTop={5} w="100%" onClick={onBarkClick}>Bark</Button>
			<Button bgColor="gray" marginTop={5} w="100%" color="black" onClick={onLogoutClick}>Logout</Button>
		</Flex>		
	);
}



export default ProfileCard;