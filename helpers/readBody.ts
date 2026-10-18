import type { IncomingMessage } from 'node:http'

export const readBody = async (req: IncomingMessage, maxBytes: number): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    let chunksCount: number = 0;
    let extraLimit: boolean = false;

    req.on('data', (chunk: Buffer) => {
      if(extraLimit) {
        return;
      }
      if(chunksCount + chunk.length > maxBytes) {
        reject(new Error('413'));
        extraLimit = true
        return;
      }
      chunksCount += chunk.length
      chunks.push(chunk);
    });

    req.once('error', (error: Error) => {
      reject(error);
      return;
    });

    req.once('close', () => {
      if (!req.complete) {
        reject(new Error('Request closed before complete'));
      }
    });

    req.once('end', () => {
      if(extraLimit) {
        reject(new Error('413'));
        return;
      }
      resolve(Buffer.concat(chunks).toString('utf8'));
    });
  });
}
