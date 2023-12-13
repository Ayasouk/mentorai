"use client";
import { Input } from "@/components/ui/input";
import axios from "axios";
import "node_modules/video-react/dist/video-react.css";
import { useState } from "react";
import {Player} from "video-react";

const ShortsPage = ()=>{
    const [videoSrc , setVideoSrc] = useState("");
    const [uploadProgress, setUploadProgress] = useState<number>(0);

   /* const handleChange = ({file}:any) => {
      var reader = new FileReader();
      console.log(file)
      var url = URL.createObjectURL(file.originFileObj);
      seVideoSrc(url);
  };*/

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if(!file) return;

        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('/api/get-signed-url', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                let percentCompleted;
                if(progressEvent.total){
                    percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                } else {
                    percentCompleted = 0;
                }
              
              setUploadProgress(percentCompleted);
            },
          });

        const {url} = await response.json();

        const xhr = new XMLHttpRequest();
        xhr.open('PUT', url, true);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.upload.onprogress = (event: ProgressEvent) => {
            if(event.lengthComputable) {
                setUploadProgress((event.loaded /event.total) * 100);
            }
        };
        xhr.onload = () => {
            if(xhr.status === 200) {
                const publicUrl = `https://storage.googleapis.com/audios-shorts/${encodeURIComponent(file.name)}`;
                setVideoSrc(publicUrl);
            } else  {
                console.log("error xhr request");
            }
        };

        xhr.onerror = () => {
            console.log("ERROR ")
        };
        xhr.send(file);
    };

    return (<div className="flex flex-col items-center space-y-6">
        <div>Shorts Page</div>
        <Input type="file" className="w-30 m-6" onChange={handleChange} placeholder="Choisir votre vidéo"/> 
        <div>Upload progress : {uploadProgress.toFixed(2)}%</div>   
        <div className="w-7/12 h-7/12">
        <Player
            playsInline
            poster="/public/empty.png"
            src={videoSrc}
        />
        </div>
    </div>)
}

export default ShortsPage;