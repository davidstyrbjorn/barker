import { Container, Flex, Heading, Icon, Text, useMediaQuery } from "@chakra-ui/react";
import React from "react";
import { SignInAndUp } from "supertokens-auth-react/recipe/emailpassword";
import { BarkerLogoSVGWithText } from "../components/BarkerLogoSVG";

const styleLeft: React.CSSProperties = {
    flex: 1,
    justifyContent: "center",
    flexDirection: 'column',
    paddingLeft: "128px",
    paddingRight: "128px",
    height: "100vh",
};

const stylesRight: React.CSSProperties = {
    flex: 0.8,
    height: "100vh",
    justifyContent: 'center',
    padding:'20px',
    alignItems: 'center'
};

const phoneContainer: React.CSSProperties = {
    height: "100vh",
    justifyContent: 'center',
    alignItems: 'center'
}

const LandingPageWebView: React.FC<{}> = () => {
    return (
        <Flex flexDir={'row'}>
            <Flex style={styleLeft} background={'egg'}>
                <Heading color={'red'} fontWeight={'bold'} fontSize={['4xl', '8xl']}>
                    Bark it,<br/> Bark it loud!
                </Heading>
                <Text color={'red'}>
                    Barker, a portal through which you can share your thoughts by simply speaking them out and sharing them with your friends! Imagine never having to read again? Welcome to Barker.
                </Text>
            </Flex>
            <Flex style={stylesRight} background={'red'} position='relative' >
                <Container position="absolute" top='0' left='0' padding="32px">
                    <BarkerLogoSVGWithText/>
                </Container>
                <SignInAndUp/>
            </Flex>
        </Flex>
    );
}

const LandingPagePhoneView: React.FC<{}> = () => {
    return (
        <Flex background={'red'} style={phoneContainer}>
            <Container position="absolute" top='0' left='0' padding="32px">
                <BarkerLogoSVGWithText/>
            </Container>
            <SignInAndUp/>
        </Flex>
    );
}

const LandingPage: React.FC<{}> = () => {
    const isSmallScreen = useMediaQuery("(max-width: 1080px)");
    return (
        !isSmallScreen[0] ? <LandingPageWebView/> : <LandingPagePhoneView/>
    );
}

export default LandingPage;