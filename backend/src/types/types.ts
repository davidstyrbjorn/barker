import {Document} from 'mongoose';
import { IPost } from '../models/Post';

export interface ISound extends Document {
    data: Buffer;
}

export type DownloadGCPReturnObject = {
    url?:string;
    error?:string;
}
