import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {ChakraProvider, extendTheme} from '@chakra-ui/react';
import { mode } from "@chakra-ui/theme-tools";

// Setup our theming with colors and fonts etc etc
const theme = extendTheme({
	colors: {
		red: '#D93250',
		egg: '#F1F1F1',
		white: "#FFFFFF",
		black: '#282622',
		purple: '#654AD0',
		gray: '#E5E5E5',
		// TODO: Give these better names!
		darkGray: '#C4C4C4',
		almostWhite: '#F1F1F1',
		darkText: '#282622',
		progress:{
			500:'#D93250' 
		}
	},
	fonts: {
		heading: 'Inter, sans-serif',
		body: 'Inter, sans-serif'
	},
	components: {
		Button: {
			baseStyle: {
				fontWeight: 'bold',
				backgroundColor: 'purple',
				textColor: 'white'
			}
		}
	},
	styles: {
		global: (props: any) => ({
		  body: {
			bg: mode('#F1F1F1', '#F1F1F1')(props),
		  }
		})
	  },
});

ReactDOM.render(
	<React.StrictMode>
		<ChakraProvider theme={theme}>
			<App /> 
		</ChakraProvider>
  	</React.StrictMode>,
  	document.getElementById('root')
)
