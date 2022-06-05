import { Box, Button } from "@chakra-ui/react";
import React, { useState } from "react";

const circButtonStyle: React.CSSProperties = {
    width: '8rem',
    height:'8rem',
    margin: '1rem auto',
    borderRadius: '200px',
    background:'#E5E5E5'
}

const startRecordIcon: React.CSSProperties = {
    width: '4.5rem',
    height:'4.5rem',
    padding: '0',
	margin: 'auto',
    borderRadius: '200px',
    transition: 'border-radius linear 0.3s'
}

const stopRecordIcon: React.CSSProperties = {
    borderRadius: '16px'
}

type Props = {
    onClick: () => void;
}

const RecordButton: React.FC<Props> = (props) => {

    const [isRecording, setIsRecording] = useState<boolean>(false);
    
    const handleClick = () => {
        setIsRecording(!isRecording);
        props.onClick();
    }
    return (
        <Button style={circButtonStyle} onClick={handleClick}>
            <Box style={!isRecording ? startRecordIcon : {...startRecordIcon, ...stopRecordIcon}} background='red'></Box>
        </Button>
    );
}

export default RecordButton;