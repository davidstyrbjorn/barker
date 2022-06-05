import { Flex, Box } from "@chakra-ui/react";
import React, { createRef, useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";

const arrowRight: React.CSSProperties = {
    width: 0, 
    height: 0,
    borderTop: '10px solid transparent',
    borderBottom: '10px solid transparent',
    borderLeft: '20px solid white',
    marginLeft: '3px',
}

const whiteSquare: React.CSSProperties = {
    width: '20px',
    height: '20px',
    backgroundColor: 'white'
}

type Props = {
    url: string
}

/* This component presents an audio timeline given a blob url */
const AudioVisualizer: React.FC<Props> = ({url}) => {
    const [created, setCreated] = useState<boolean>(false);
    const [wavesurfer, setWavesurfer] = useState<WaveSurfer>();
    const [playing, setPlaying] = useState<boolean>(false);
    const ref = createRef<HTMLDivElement>();

    useEffect(() => {
        if(!ref.current || created) return;

        // Setup the wave
        let ws = WaveSurfer.create({
            container: ref.current,
            waveColor: 'white',
            progressColor: '#D93250',
            backgroundColor: '#E5E5E5',
            barWidth: 6,
            height: 70,
            hideScrollbar: true,            
            barRadius: 3,
            barHeight: 1,
            barMinHeight: 1.9,
            cursorWidth: 0,
        });
        // Actually load the data
        ws.load(url);

        // Update some states to tell we now have a wave
        setWavesurfer(ws);
        setCreated(true);
   
    }, [ref, created]);

    // On URL change, wavesurfer should load
    useEffect(() => {
        if(!wavesurfer) return;
        wavesurfer.load(url);
    }, [url]);

    const onPlayButton = () => {
        wavesurfer!.playPause();
        setPlaying(wavesurfer!.isPlaying());
    }

	// Change to play icon when clip has finished playing
	if (wavesurfer) {
		wavesurfer.on('finish', () => {
			setPlaying(false);
		})
	}

    return (
        <Flex width="100%" alignItems={'center'} borderRadius={"8px"} marginTop={"16px"} marginBottom={"16px"} background={'gray'} justifyContent={'center'}>
            <Flex marginLeft={'12px'} onClick={onPlayButton} marginRight={'auto'} background={'red'} width="48px" height="48px" justifyContent={'center'} alignItems={'center'} borderRadius={'100%'}>
                <Box style={playing ? whiteSquare : arrowRight}></Box>
            </Flex>
            <Box width="80%" marginRight={'auto'} ref={ref}></Box>
        </Flex>
    );
}

export default AudioVisualizer;