"use client"
import axios from "axios";
import { useState } from "react";

const formatShorts =  (data:Array<any>) => {
  console.log(data);
  let tab:any[] = [];
  data.map((shorttab:any)=>{
    if(typeof(shorttab)==="string") {
      let elem = shorttab.split("{");
      let obj;
      for(let i=0; i<elem.length; i++){
          if(elem[i]==="["){

          } else {
              elem[i] = elem[i].slice(0,-1);
              obj = JSON.parse("{"+elem[i]);
              tab.push(obj);
          }
          
      }
    } else {
      for(let i=0; i<shorttab.length; i++){
          tab.push(shorttab[i]);
      }
    }
  })
  return tab;
}

// Frontend: components/VideoUploader.tsx
const ShortsPage = () => {
    const [filename, setFilename] = useState("gamingcoding.mp4");
    const [filetype, setFiletype] = useState("mp4");
    const [shorts, setShorts] = useState([]);

    const uploadVideo = async (file: File): Promise<void> => {
      console.log(file.name);
        try {
          // Step 1: Request a signed URL from our server
          const { data } = await axios.post('/api/shorts', {
            filename: file.name,
            filetype: file.type,
          });
          
          setFilename(file.name);
          setFiletype(file.type);

          const signedUrl = data.signedUrl;
          console.log("URL : ", signedUrl);

          // Step 2: Use the signed URL to upload the file directly to GCS
          const result = await axios.put(signedUrl, file, {
            headers: {
              'Content-Type': file.type,
            },
          });
      
          console.log('Upload successful');
      
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error('Error uploading file:', error.message);
          } else {
            console.error('Error uploading file');
          }
        }
      };



      const downloadVideo = async (e:any): Promise<void> => {
        try {
          // Step 1: Request a signed URL from our server
          const { data } = await axios.post('/api/shorts/download', {
            filename,
            filetype,
            action:"download"
          });
      
          // Process the video
      
          console.log('Process successful');
          console.log("success : ", data.success);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error('Error processing file:', error.message);
          } else {
            console.error('Error processing file');
          }
        }
      };

      const extractVideo = async (e:any): Promise<void> => {
        try {
          // Step 1: Request a signed URL from our server
          const { data } = await axios.post('/api/shorts/download', {
            filename,
            filetype,
            action:"extract"
          });
      
          // Process the video
      
          console.log('Process successful');
          console.log("success : ", data.success);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error('Error processing file:', error.message);
          } else {
            console.error('Error processing file');
          }
        }
      };

      const reduceVideo = async (e:any): Promise<void> => {
        try {
          // Step 1: Request a signed URL from our server
          const { data } = await axios.post('/api/shorts/download', {
            filename,
            filetype,
            action:"reduce"
          });
      
          // Process the video
      
          console.log('Process successful');
          console.log("success : ", data.success);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error('Error processing file:', error.message);
          } else {
            console.error('Error processing file');
          }
        }
      };

      const transcribeVideo = async (e:any): Promise<void> => {
        try {
          // Step 1: Request a signed URL from our server
          const { data } = await axios.post('/api/shorts/download', {
            filename,
            filetype,
            action:"transcribe"
          });
      
          // Process the video
      
          console.log('Process successful');
          console.log("success : ", data.success);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error('Error processing file:', error.message);
          } else {
            console.error('Error processing file');
          }
        }
      };

      const prepareData = async (e:any): Promise<void> => {
        try {
          // Step 1: Request a signed URL from our server
          const { data } = await axios.post('/api/shorts/download', {
            filename,
            filetype,
            action:"prepare"
          });
      
          // Process the video
      
          console.log('Process successful 2');
          console.log("success : ", data.success);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error('Error processing file:', error.message);
          } else {
            console.error('Error processing file');
          }
        }
      };

      const getShorts = async (e:any): Promise<void> => {
        try {
          // Step 1: Request a signed URL from our server
          const data = await axios.post('/api/shorts/download', {
            filename,
            filetype,
            action:"getshorts"
          });
      
          // Process the video
      
          console.log('Process successful 1');
          console.log("success : ", data);
          //const formattedShorts = formatShorts(data.data);
          //console.log("FORMATTED : ", formattedShorts)
          const fshorts = JSON.parse(data.data.data);
          console.log(fshorts);
          setShorts(fshorts.segments);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error('Error processing file:', error.message);
          } else {
            console.error('Error processing file');
          }
        }
      };


      const handleChange = (e:any) => e.target.files && uploadVideo(e.target.files[0]);
      
      // Usage example in a React component:
      // <input type="file" onChange={(e) => e.target.files && uploadVideo(e.target.files[0])} />
    
    return (
        <div>
            Shorts Page
            <label>Upload your video</label>
            <input type="file" onChange={handleChange} />
            <button className="bg-slate-500 space-y-4 px-4 my-3" onClick={downloadVideo}>Downlaod video</button><br/>
            <button className="bg-slate-500 space-y-4 px-4 my-3"  onClick={extractVideo}>Extract audio from video</button><br/>
            <button className="bg-slate-500 space-y-4 px-4 my-3"  onClick={reduceVideo}>Reduce audio video</button><br/>
            <button className="bg-slate-500 space-y-4 px-4 my-3"  onClick={transcribeVideo}>Transcribe video</button><br/>
            <button className="bg-slate-500 space-y-4 px-4 my-3"  onClick={prepareData}>Prepare Data</button><br/>
            <button className="bg-slate-500 space-y-4 px-4 my-3"  onClick={getShorts}>Get Shorts</button><br/>
            <div> Result : {shorts.map((shorttab) => {
                            console.log("short : ", shorttab);
                            return (
                              <div>
                                {shorttab["start"]}
                                {/*{shorttab.map((short) => {
                                  return <p>Start : {short.start}</p>
                                })}*/}
                              </div>
                            )})
            }
            </div>
            
        </div>
    )
}


export default ShortsPage;