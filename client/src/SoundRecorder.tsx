import React, { useEffect, useRef, useState } from "react";

function recordSound() {

}
const SoundRecorder: React.FC<{}> = () => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const chunks = useRef<Array<Blob>>([]);
    const audioObject = useRef<any>(null);
    const [audioObjectURL, setAudioObjectURL] = useState<string>("");

    // Prompts microphone input
    useEffect(() => {
        let constraints = { audio: true };
        window.navigator.mediaDevices.getUserMedia(constraints).then(function(str) {
            setStream(str);
        }).catch(() => {
    
        })
    }, [])

    // Listens for valid stream
    useEffect(() => {
        if (stream === null) return; 
        setMediaRecorder(new MediaRecorder(stream));
    }, [stream])

    useEffect(() => {
        if (mediaRecorder === null) return; 
        mediaRecorder.onstop = () => {
            audioObject.current.controls = true;
            //@ts-ignore
            const blob = new Blob([chunks], {'type': 'audio/ogg; codecs=opus'});
            //chunks.current = [];
            const audioURL:string = window.URL.createObjectURL(blob);

            console.log(audioURL);
            setAudioObjectURL(audioURL);

            blob.arrayBuffer().then((buffer) => {
                const array = new Uint8Array(buffer);
            })
        }

    }, [mediaRecorder])

    if (mediaRecorder !== null) {
        // What format for storage and playback?
        mediaRecorder!.ondataavailable = (e:BlobEvent) => {
        e.data.text().then((r) => {
            // console.log(r);
        })
        chunks.current.push(e.data); // Update ref data
        }
    }


    // Start mediarecord stream
    const onRecord = () => {
        mediaRecorder!.start();
    }

    const onStop = () => {
        mediaRecorder!.stop();
    }

    return (
        <div>
            <button style={{"margin": "20px" }} onClick={onRecord}>
                rec
            </button>
            <button onClick={onStop}>
                stop rec
            </button>
            <audio src={audioObjectURL} ref={audioObject}>
            </audio>
        </div>
    )
}

export default SoundRecorder;