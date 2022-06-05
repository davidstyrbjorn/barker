import { CloseIcon } from "@chakra-ui/icons";
import { Divider, Flex, Progress, Text, Button} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import NavBar from "../components/NavBar";
import PreviewPost from "../components/PreviewPost";
import RecordButton from "../components/RecordButton";

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

const CreatePostPage: React.FC<{}> = () => {
	const [micAccess, setMicAccess] = useState<boolean>(false);

	// Check microphone permission, if audio stream is valid mic access is valid
	const checkMicrophonePermission = async () => {
		await navigator.mediaDevices.getUserMedia({ audio: true })
			.then(stream => setMicAccess(true))
			.catch(err => setMicAccess(false));
	}

	// To run microphone check on first load
	useEffect(() => {
		checkMicrophonePermission();
	}, [micAccess])

	// Creates mediaBlobUrl after stopRecording is called
	const {
		startRecording,
		stopRecording,
		mediaBlobUrl,
	} = useReactMediaRecorder({ audio: true, blobPropertyBag: { type: "audio/mp3" } });

	const [couldNotUpload, setCouldNotUpload] = useState<boolean>(false);
	// Stages of recording
	const [recording, setRecording] = useState<boolean>(false);

	// Time trakcing variables
	const [recordDuration, setRecordDuration] = useState<number>(0);
	const [second, setSecond] = useState<number>(0);
	const [minute, setMinute] = useState<number>(0);
	const [progressValue, setProgressValue] = useState<number>(0);

	// Can only record with mic access
	const record = () => {
		if (micAccess) {
			if (!recording) {
				startRecording();
				setRecording(true);
			} else {
				setRecording(false);
				stopRecording();
			}
		}
	};

	const onBackButton = () => {
        window.location.href = "/";
    }

	// Total recording duration increasing every second
	useEffect(() => {
		if (recording) {
			const id = setInterval(() => setRecordDuration((recordDuration) => recordDuration + 1),
				1000
			);
			return () => { clearInterval(id); };
		}
		else {
			setRecordDuration(0);
		}

	}, [recording]);

	// For displaying minutes and seconds and for progress
	useEffect(() => {
		// Did we go over the 5 minute limit? 
		if (minute >= 5) {
			stopRecording();
			setSecond(0); setMinute(0);
			return;
		}
		if (recordDuration > 0) {
			// Did we reach a minute?
			if (recordDuration % 60 == 0) {
				setSecond(0);
				setMinute(minute + 1);
			}
			else {
				setSecond(second + 1); // Otherwise increment second+1
			}
		}
		else {
			setMinute(0);
			setSecond(0);
		}

		// % of 5 minutes
		let progressVal = (recordDuration / 300) * 100
		setProgressValue(progressVal);

	}, [recordDuration])

	if(mediaBlobUrl) return <PreviewPost blobUrl={mediaBlobUrl}/>
	return (
		<Flex background={'egg'} style={styleFull}>
			<NavBar />
			<Flex background={micAccess ? 'white' : 'white'} style={createPostBox}>
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
			
				{micAccess ? (
					<>
						<Text fontSize='2xl'>{!recording ? "What's on your mind?" : "Wow you’re really going at it!"}</Text>
						<Text fontSize='md' color='darkGray'>{!recording ? "Press the circular button to start recording" : "Just press the button again to stop recording!"}</Text>
						<Divider color='darkGray' borderWidth='1px' margin='20px 0' />
						<Text fontSize='7rem'>{minute}:{second < 10 ? '0' + second : second}</Text>
						<Progress value={progressValue} size='md' background='darkGray' colorScheme='progress' borderRadius='12px' margin='0 0 2rem' />
						<Text fontSize='lg'>Record</Text>
						<RecordButton onClick={record} />
					</>
				) : (
					<Text color='red' fontWeight={'bold'}>
						You must allow microphone access to record a bark! Change your settings and reload the page.
					</Text>
				)}
			</Flex> 
		</Flex>
	)
}

export default CreatePostPage;