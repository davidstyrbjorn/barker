import { TypeInput } from "supertokens-node/lib/build/types";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";

const supertokensConfig: TypeInput = {
    framework: "express",
    supertokens: {
        // These are the connection details of the app you created on supertokens.com        
        connectionURI: process.env.SUPERTOKENS_CONNECTION_URI!,
        apiKey: process.env.SUPERTOKENS_API_KEY,
    },
    appInfo: {
        // learn more about this on https://supertokens.com/docs/session/appinfo        
        appName: "barker",
        apiDomain: "http://localhost:3001",
        websiteDomain: "http://localhost:3000",
        apiBasePath: "/auth",
        websiteBasePath: "/auth",
    },
    recipeList: [
        EmailPassword.init({
            override: {
                apis: (originalImpl) => {
                    return {
                        ...originalImpl,
                        signUpPOST: async function(input) {
                            if (originalImpl.signUpPOST === undefined) {
                                throw Error("Should never come here");
                            }

                            // First we call the original implementation of signUpPOST.
                            let response = await originalImpl.signUpPOST(input);

                            // Post sign up response, we check if it was successful
                            if (response.status === "OK") {
                                let { id, email } = response.user;
                                
                                // These are the input form fields values that the user used while signing up
                                // let formFields = input.formFields;
                            }
                            return response;
                        }
                    };
                }
            }
        }),
        // initializes signin / sign up features        
        Session.init() // initializes session features    
    ]
}

export default supertokensConfig;