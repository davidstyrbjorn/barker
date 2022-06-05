import { HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, IconButton, useDisclosure, useMediaQuery } from "@chakra-ui/react";
import React, { createRef } from "react";
import { useQueryClient } from "react-query";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { useGetUser } from "../api/query/userQuery";
import { BarkerLogoSVG } from "./BarkerLogoSVG";
import ProfileCard from "./ProfileCard";
import SearchForUsers from "./SearchForUsers";


const NavBarWebView: React.FC = () => {
    return (
        <Flex background="red" h="50px" justifyContent="center" alignItems="center" >
            <BarkerLogoSVG />
        </Flex>
    );
}

const NavBarPhoneView: React.FC = () => {

    const {
        isOpen: isOpenProfile, 
        onOpen: onOpenProfile,
        onClose: onCloseProfile
    } = useDisclosure();

    const {
        isOpen: isOpenSearch,
        onOpen: onOpenSearch,
        onClose: onCloseSearch
    } = useDisclosure();
    const profileRef = createRef<HTMLButtonElement>();
    const searchRef = createRef<HTMLButtonElement>();
    const {userId} = useSessionContext();
    const user = useGetUser(); // Custom hook with same syntax as with function

    return (
        <Flex background="red" h="50px" justifyContent="space-between" alignItems="center" >
            {//TODO: Find suiting icons
            }
            <IconButton ref={profileRef} backgroundColor={'red'} aria-label='Profile' icon={<HamburgerIcon fontSize="1.5rem" margin="0 1rem"/>} onClick={onOpenProfile} />
            <Drawer
                size={"full"}
                isOpen={isOpenProfile}
                placement='left'
                onClose={onCloseProfile}
                finalFocusRef={profileRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader></DrawerHeader>

                    <DrawerBody>
                        <ProfileCard name={user.data.name}/>
                    </DrawerBody>

                </DrawerContent>
            </Drawer>

            <BarkerLogoSVG />

            <IconButton ref={searchRef} backgroundColor={'red'} aria-label='Search users' icon={<SearchIcon  fontSize="1.5rem" margin="0 1rem"/>} onClick={onOpenSearch}/>
            <Drawer
                size={"full"}
                isOpen={isOpenSearch}
                placement='right'
                onClose={onCloseSearch}
                finalFocusRef={searchRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader></DrawerHeader>

                    <DrawerBody>
                        <SearchForUsers/>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Flex>
    );
}

const NavBar: React.FC<{}> = () => {
    const isSmallScreen = useMediaQuery("(max-width: 1000px)");
    return (
        !isSmallScreen[0] ? <NavBarWebView /> : <NavBarPhoneView />
    );
}

export default NavBar;