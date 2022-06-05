import {Storage} from '@google-cloud/storage'

const storage = new Storage({
	keyFilename: 'barker-347020-278cb9b81a99.json',
	projectId: 'barker-347020'
});

async function configureBucket(allowedOrigins: Array<string>) {
    try {
        await storage.bucket('barker-sounds-bucket').setCorsConfiguration([
        {
            responseHeader: ['Content-Type'],
            method: ['GET'],
            origin: allowedOrigins,
            maxAgeSeconds: 3600
        },
        ]);
    } catch(e) {
        console.log(e);
    }
}
  
export {configureBucket}