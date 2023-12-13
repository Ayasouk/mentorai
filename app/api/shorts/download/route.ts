
import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Storage } from '@google-cloud/storage';
import ffmpeg from "fluent-ffmpeg";
import {exec} from "child_process";
import { timeStamp } from "console";
import {OpenAI} from 'openai';

import fs from 'fs/promises';

const openAIInstance = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

function estimateTokenCount(str:string) {
  return Math.ceil(new TextEncoder().encode(str).length / 4);
}

function sleep(ms:any){
  return new Promise((resolve:any) => setTimeout(resolve, ms));
}

type RequestBody = {
    filename: string;
    filetype: string;
    action: string;
  };

  const MAX_CHARACTERS_PER_PART = 60000; // Approximate character count for 12000 tokens

  const divideTranscriptIntoParts = (transcript:string) => {
      const parts = [];
      let currentPart = '';
  
      transcript.split(/\s+/).forEach(word => {
          if ((currentPart + word).length > MAX_CHARACTERS_PER_PART) {
              parts.push(currentPart);
              currentPart = word;
          } else {
              currentPart += (currentPart.length > 0 ? ' ' : '') + word;
          }
      });
  
      if (currentPart.length > 0) {
          parts.push(currentPart);
      }
  
      return parts;
  };

  async function getShorts(){
    try{
      let openAIFinalResponse:any;
      const transcriptData = JSON.parse(await fs.readFile('output.json', 'utf8'));
      const parts = divideTranscriptIntoParts(JSON.stringify(transcriptData))
      let completedResults = [];

      for(let part of parts){
          let openAIPrompt = `Analyze the following video transcript and identify segments that are most likely to captivate and engage an audience for the creation of short videos. Look for moments in the transcript that can be at least one of these implications:
        Highly Informative or Insightful,
        Emotionally Resonant,
        Narratively Compelling,
        Relatable or Universally Appealing,
        Humorous or Entertaining,
        For each segment identified, provide the start and end timestamps and a brief explanation of why it was chosen and how it contributes to the intended impact of the short video. 
        This will assist in creating short clips that are engaging, informative, and resonant with the audience (provide between 3 and 7 shorts), answer exclusively in a json format file: ${JSON.stringify(part)}`;
        
        // Format Prompt depending on Limit Token of OpenAI model
        let tokenCount = await estimateTokenCount(openAIPrompt);
        console.log("NB Tokens :"+tokenCount)
        if(tokenCount > 12000){
          while(tokenCount>12000 && part.length >0){
            part = await part.slice(0, -1);
            openAIPrompt = `Analyze the following video transcript and identify segments that are most likely to captivate and engage an audience for the creation of short videos. Look for moments in the transcript that can be at least one of these implications:
              Highly Informative or Insightful,
              Emotionally Resonant,
              Narratively Compelling,
              Relatable or Universally Appealing,
              Humorous or Entertaining,
              For each segment identified, provide the start and end timestamps and a brief explanation of why it was chosen and how it contributes to the intended impact of the short video. 
              This will assist in creating short clips that are engaging, informative, and resonant with the audience (provide between 3 and 7 shorts), answer exclusively in a json format file: ${JSON.stringify(part)}`;
              tokenCount = estimateTokenCount(openAIPrompt);
          }
        }
        console.log("before openAI Call", tokenCount)
        const openAIResponse = await openAIInstance.chat.completions.create({
            //model: "gpt-3.5-turbo",
            //model: "gpt-3.5-turbo-1106",
            model: "gpt-3.5-turbo-1106",
            messages: [{role: "user", content: openAIPrompt}],
            response_format:  {"type": "json_object" }
        });
        await sleep(5000);
        if(openAIResponse && openAIResponse.choices && openAIResponse.choices.length && openAIResponse.choices[0].message) {
            openAIFinalResponse = openAIResponse.choices[0].message.content || "";
            console.log("res i : ", openAIFinalResponse);
            completedResults.push(openAIFinalResponse);
        }
      }
      return completedResults[0];
  } catch(error) {
      console.log(error);
  }
  }

  async function prepareData(){
    let processedData = [];
    try {
        // Read the file dynamically
        const data = JSON.parse(await fs.readFile('./bestTr.json', 'utf8'));
        const rdata = data["segments"];

        console.log(rdata[0]["start"]);

        for (var i = 0; i < rdata.length; i++) {
            processedData.push({start: rdata[i]["start"], end: rdata[i]["end"], text: rdata[i]["text"]});
        }

        // Write the processed data to a file
        await fs.writeFile('output.json', JSON.stringify(processedData, null, 2));
        console.log('Data has been written to output.json');
    } catch (error) {
        console.error('Error:', error);
    }

    return processedData;
};


  async function transcribe(filename:string) {
    return new Promise((resolve, reject) => {
      filename.replaceAll(' ', '\ ');
      filename = '"'+filename+'"';
      exec('python3 ./scripts/transcribe.py '+filename, (error, stdout, stderr) => {
      if (error) {
          console.error(`error: ${error.message}`);
      }
      if (stderr) {
          console.error(`stderr: ${stderr}`);
      }
    })});
  }

  async function reduceNoise(inputFile: string, outputFile: string) {
    return new Promise((resolve, reject) => { 
      ffmpeg(inputFile)
        .toFormat('wav')
        .audioFilters([
            {
                filter: 'highpass',
                options: 'f=200'  // Highpass filter - remove frequencies below 200Hz
            },
            {
                filter: 'anlmdn',
                options: 's=6' // Non-local Means Denoising filter
            }
        ])
        .on('end', () => {
            console.log(`Noise reduction completed. Output saved to ${outputFile}`);
        })
        .on('error', (err) => {
            console.error('Error:', err);
        })
        .save(outputFile);
      })
  }

  async function extractAudioFromVideo(videoPath: string, audioOutputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(videoPath)
            .toFormat('wav')
            .save(audioOutputPath)
            .on('end', () => {
                console.log('Audio extraction finished.');
                resolve();
            })
            .on('error', (err:Error) => {
                console.error('Error:', err);
                reject(err);
            })
            
    });
}

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();
        const user = await currentUser();
        const {src, name, description, instructions, seed, categoryId} = body;
        const destFilename = './'+body.filename;
  
        if(!body.filename || !body.filetype ){
          return new NextResponse("Missing required fileds", {status: 400});
        }
  
        //TODO Check subscription
        const isPro = await checkSubscription();
  
        const encodedCredentials = process.env.GOOGLE_CLOUD_CREDENTIALS_BASE64;
        if (!encodedCredentials) {
          throw new Error("Les informations d'identification Google Cloud ne sont pas définies");
        }
  
        const storage = new Storage({
          credentials: JSON.parse(Buffer.from(encodedCredentials, 'base64').toString('ascii'))
        });
        const bucketName = 'audios-shorts';
      
        //TODO: Give the video a unique name with timestamps 
        //TODO: Verify that the file type is a video one
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(body.filename);
  
        const options = {
          // Le chemin où le fichier sera enregistré localement
          destination: destFilename,
        };
        
        if(body.action === "download"){
          console.log("DOWNLOADING...");
          await file.download(options)
        }
        
        if(body.action === "extract") {
          console.log("EXTRACTING...");
          await extractAudioFromVideo("./"+body.filename, "./"+body.filename+".wav")
        .then(() => console.log('Extraction succeeded.'))
        .catch(err => console.error('Failed to extract audio:', err));
        }
        
        if(body.action === "reduce"){
          console.log("REDUCING...");
          await reduceNoise("./"+body.filename+".wav", "./clear"+body.filename+".wav")
          .then(() => console.log('Noise reducing succeeded.'))
          .catch(err => console.error('Failed to reduce noise audio:', err));
        }

        if(body.action === "transcribe") {
          console.log("TRANSCRIBING...");
          await transcribe("./clear"+body.filename+".wav")
          .then(() => console.log('Transcription succeeded.'))
          .catch(err => console.error('Failed to transcribe audio:', err));
        }

        if(body.action === "prepare") {
          console.log("PREPARING DATA...");
          const data = await prepareData()
          console.log("Data ready and prepared");
        }

        if(body.action === "getshorts") {
          console.log("DETECTING SHORTS...");
          const data = await getShorts() || "";
        return NextResponse.json({success: true, data: data});
          console.log("Detecting the best shorts from video");
        }


        return NextResponse.json({success: true});
  
    } catch(error) {
        console.log("[SHORTS Download POST ERROR]", error);
        return new NextResponse("Internal Error", {status:500});
    }
  }