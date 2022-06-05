import React from "react";
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SuperTokens from "supertokens-auth-react";
import EmailPassword, { EmailPasswordAuth } from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";
import CreatePostPage from "./views/CreatePostPage";
import CreateProfilePage from "./views/CreateProfilePage";
import HomePage from "./views/HomePage";
import LandingPage from "./views/LandingPage";

SuperTokens.init({
	appInfo: {
		appName: "barker",
		apiDomain: "http://localhost:3001",
		websiteDomain: "http://localhost:3000",
		apiBasePath: "/auth",
		websiteBasePath: "/auth",
	},
	recipeList: [
		EmailPassword.init({
			getRedirectionURL: async (context) => {
				if (context.action === "SIGN_IN_AND_UP") {
					return "/login";
				};
				if(context.action === "SUCCESS"){
					if(context.isNewUser){
						return "/create-profile"
					}
				}
			},
			signInAndUpFeature: {
				disableDefaultImplementation: true,
			},
			useShadowDom: false,
			style: {
				button: {
					backgroundColor: "#654AD0",
					borderColor: "#654AD0"
				},
				container: {
					margin: 0,
					font: 'inherit'
				},
			}
		}),
		Session.init()
	]
});


//create client
const queryClient = new QueryClient();

function App() {
	return (
		// Provide the client to your App
		<QueryClientProvider client={queryClient}>
			<div className="app">
				<BrowserRouter>
					<Routes>
						<Route path="/" element={
							<EmailPasswordAuth requireAuth={true}>
								<HomePage/>
							</EmailPasswordAuth>
						} />
						<Route path="/create" element={
							<EmailPasswordAuth requireAuth={true}>
								<CreatePostPage/>
							</EmailPasswordAuth>
						}/>
						<Route path="/login"
							element={ //protects Home from unauthorized users
								<LandingPage/>
							}>
						</Route>
						
						<Route path="/create-profile" element={
							<EmailPasswordAuth>
								<CreateProfilePage/>
							</EmailPasswordAuth>
						}/>
					</Routes>
				</BrowserRouter>
			</div>
		</QueryClientProvider>
	)
}

export default App
