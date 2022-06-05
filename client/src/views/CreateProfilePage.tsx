import { AddIcon } from '@chakra-ui/icons';
import { Avatar, Button, Container, Divider, Flex, Heading, IconButton, Input, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import { createUser } from "../api/mutation/userMutation";
import { BarkerLogoSVGWithText } from "../components/BarkerLogoSVG";

const containerStyle: React.CSSProperties = {
    height: "100vh",
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
}

const cardContainer: React.CSSProperties = {
    flexDirection: 'column',
    alignItems: 'center',
    width: "350px",
    height: "475px",
    borderRadius: "16px",
    padding: "32px"
}

const avatar: React.CSSProperties = {
    width: "180px",
    height: "180px",
    borderWidth: "1px",
    marginTop: "16px"
}

const bottomSection: React.CSSProperties = {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%'
}

const CreateProfilePage: React.FC<{}> = () => {
    const {userId} = useSessionContext();   
    
    const [name, setName] = useState<string>("");
    const toast = useToast(); // Used to show popup messages

    const onNameChange = (e: React.FormEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value);
    }

    const onCreateProfile = async () => {
        if(name == ""){
            toast({
                title: 'Error creating profile',
                description: "Please give yourself a display name",
                status: 'warning',
                duration: 4500,
                isClosable: true,
                position: 'top',
            });
            return;
        }
        
        // Handle database call to tell the name of our user
        try {
            const result = await createUser({
                name: name,
                supertokensId: userId,
                following: [], 
                posts: [], 
                likedPosts: [] 
            });
            window.location.href = "/";
        }catch(e) {
            toast({
                title: 'Error creating profile',
                description: `Server response: ${e}`,
                status: 'error',
                duration: 4500,
                isClosable: true,
                position: 'top',
            })
        }
    }

    return (
        
        <Flex background="red" style={containerStyle}>
            <Container position="absolute" top='0' left='0' padding="32px">
                <BarkerLogoSVGWithText/>
            </Container>
            {/* The main card */}
            <Flex background="egg" style={cardContainer}>
                <Heading width={"100%"} color='red'>Create Profile</Heading>
                <Divider color="gray"/>
                {/* Avatar */}
                <Flex position={"relative"}>
                    <Avatar name={name} borderColor="purple" style={avatar} />
                    <IconButton
                        backgroundColor={"purple"} 
                        border="none"
                        borderRadius={"100px"}
                        position="absolute" 
                        bottom={3} 
                        right={3} 
                        aria-label="Add Profile Icon" 
                        icon={
                            <AddIcon color="white"/>
                    }/>
                </Flex>
                {/* Bottom part */}
                <Flex style={bottomSection} paddingTop={'16px'}>
                    <Input background={"white"} border="none" marginTop="16px" placeholder='Display name' size='md' value={name ? name: ""} onChange={onNameChange} />
                    <Button width="100%" onClick={onCreateProfile}>Create Profile</Button>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default CreateProfilePage;