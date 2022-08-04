import { NodeSSH } from "node-ssh";
import * as fs from "fs";
import FileSchema from "../schemas/file";
import { FILE_SERVER_URI, FILE_SERVER_USERNAME } from "../static/constants";
import { v4 as uuidv4 } from "uuid";
import { ImageI } from "../static/interfaces/entity";
import * as child_process from "child_process";

const ssh = new NodeSSH();

const uploadDir = __dirname + "\\..\\..\\uploads\\"

export class FileService {
  async uploadFile(file: any): Promise<ImageI> {
    const splitFileType = file.originalname.split(".")

    const type = splitFileType[splitFileType.length - 1]

    const image: ImageI = {
      id: uuidv4(),
      name: file.filename,
      type
    };
    const fullFilename = `${image.id}.${image.type}`
    const finalFullFilename = `${image.id}-converted.${image.type}`

    const imgPath = fs.readFileSync(file.path);
    const encode_img = imgPath.toString("base64");
    const final_img = Buffer.from(encode_img, "base64");
    await FileSchema.create(image);

    const imageLocalPath = uploadDir + fullFilename
    const finalImageLocalPath = uploadDir + finalFullFilename

    fs.writeFileSync(imageLocalPath, final_img)
    child_process.exec(`convert ${imageLocalPath} -resize 1920x1080 -background black -gravity center -extent 1920x1080 ${finalImageLocalPath}`)

    await ssh.connect({
      host: FILE_SERVER_URI,
      username: FILE_SERVER_USERNAME,
      privateKeyPath: "C:\\Users\\dmitr\\.ssh\\id_rsa" // TODO fix
    });

    await ssh.putFile(finalImageLocalPath, "/var/www/html/images/" + fullFilename).then(() => {
      console.log("success upload file");
    }).catch((err) => {
      console.log("err: " + err);
    });


    fs.unlinkSync(imageLocalPath)
    fs.unlinkSync(finalImageLocalPath)
    fs.unlinkSync(uploadDir + file.filename)

    return image;
  }
}