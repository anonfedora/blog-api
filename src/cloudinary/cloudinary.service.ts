import { Injectable, Inject } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { Express } from "express";

@Injectable()
export class CloudinaryService {
    constructor(@Inject("Cloudinary") private readonly cloudinary) {}

    async uploadImage(
        file: Express.Multer.File
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream({ folder: "posts" }, (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                })
                .end(file.buffer);
        });
    }
}
