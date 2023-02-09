import {S3Service} from "./s3Service";

const mockFile = {
    name: 'image.jpg',
    data: 'sldfjksfsdkfsldfksfjksdjfksdjfksdkfjsdlfkjsdfbuffer',
    size: 19838,
    encoding: '7bit',
    tempFilePath: '',
    truncated: false,
    mimetype: 'image/jpeg',
    md5: '24234234243234kjl'
}

const uploadRes = {
    Etag: 'sdlkfjskdjfoi3u423u409238492034',
    Location: 'https://slfdjsk.com/sdklfjsl/image.jpg',
    Key: 'restaurant/image.jpg',
    key: 'restaurant/image.jpg',
    Bucket: 'nestjs-restaurant-api'
}

jest.mock('aws-sdk', () => {
    return {
        S3: jest.fn(() => ({
            upload: jest.fn().mockReturnThis(),
            promise: jest.fn().mockResolvedValueOnce(uploadRes)
        }))
    }
})

describe('S3 Service', () => {
    it('should upload file to AWS S3', async () => {
        const s3Service = new S3Service();
        const response = await s3Service.upload(mockFile)

       // console.log(response)

        expect(response).toBeDefined();
        expect(response).toBe(uploadRes)
    });
})