import { ArrowBackIcon, CloseIcon } from "@chakra-ui/icons";
import { Box, Center, Divider, Fade, Flex, IconButton, Button, Spinner, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { createPost } from "../api/mutation/userMutation";
import { useGetUser } from "../api/query/userQuery";
import AudioVisualizer from "./AudioVisualizer";
import PublishIcon from "./Icons/PublishIcon";
import NavBar from "./NavBar";

const styleFull: React.CSSProperties = {
	width: '100vw',
	height: '100vh',
	flexDirection: 'column'
}

const createPostBox: React.CSSProperties = {
	maxWidth: '440px',
	width: '100%',
	minWidth: '300px',
	borderRadius: '12px',
	margin: 'auto',
	flexDirection: 'column',
	justifyContent: 'center',
	padding: '2rem',
	textAlign: 'center'
}

type Props = {
    blobUrl: string
}

const PreviewPost: React.FC<Props> = ({blobUrl}) => {
    const user = useGetUser();
    // TODO: Handle this
    const [uploadError, setUploadError] = useState<string>();
    const [loading, setLoading] = useState<boolean>();

    const onPublishSound = () => {
        setLoading(true);
		// Get promise of blob from URL
		fetch(blobUrl, {
			method: "GET",
		})
		.then(response => response.blob().then( async (blob) => {       
			// Convert promise to blob and send to sound endpoint
			createPost(user.data._id!, blob).catch((reason) => {
				setUploadError(reason);
			});
            setLoading(false);
            // Redirect back to home!
            window.location.href = "/";
		}));
    }

    const onBackButton = () => {
        window.location.href = "/";
    }

    return (
        <Flex background="egg" style={styleFull}>
            <NavBar/>
            <Flex background='white' style={createPostBox}>
                {/* Back button */}
                <Button 
					position={'relative'} 
                    left={'-2rem'} top={'-1.5rem'} 
                    width={'fit-content'} 
                    aria-label="back" 
                    backgroundColor={'transparent'} 
                    color={'darkGray'} 
                    onClick={onBackButton}>
					<CloseIcon w={6} h={6}/>
				</Button>
                <Text fontSize={'2xl'} fontWeight={'bold'}>Happy with your bark?</Text>
                <Text fontSize={'md'}>Press the bark button to publish your bark!</Text>
                <Divider color="darkGray" borderWidth={'1px'} margin="20px 0"/>
                <AudioVisualizer url={blobUrl}/>
                <Box paddingTop={'32px'}>
                {/* After the user clicks Publish Bark loading gets sets to true up until the mutation has been completed */}
                {/* We do this so that when the user gets redirected back to home, the sound will appear instantly */}
                {
                    loading ? (
                        <Spinner/>
                    ) : (
                        <>
                            <Text paddingBottom={'16px'} fontSize={'2xl'} fontWeight={'bold'}>Publish Bark</Text>
                            <Center>
                                <IconButton aria-label="Publish bark" width={140} height={140} backgroundColor={'gray'} isRound={true} icon={<PublishIcon/>}
                                    onClick={onPublishSound}    
                                />
                            </Center>
                        </>
                    )
                }
                </Box>
            </Flex>
        </Flex>
    )
}

export default PreviewPost;