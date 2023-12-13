import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Storage } from '@google-cloud/storage';
import { timeStamp } from "console";

type RequestBody = {
    filename: string;
    filetype: string;
  };

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const user = await currentUser();


        if(!body.filename || !body.filetype ){
            return new NextResponse("Missing required fileds", {status: 400});
        }

        //TODO Check subscription

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
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        contentType:body.filetype,
      };

      const [url] = await file.getSignedUrl(options);

        return NextResponse.json({signedUrl: url});

    } catch(error) {
        console.log("[SHORTS POST]", error);
        return new NextResponse("Internal Error", {status:500});
    }
}
