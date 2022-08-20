import { Router } from "express";
import multer from "multer";
import { URLs } from "../static/URLs";
import { UserService } from "../services/UserService";
import { CommonService } from "../services/CommonService";
import { AddEntityRequest, CustomRequest, MainPageDataRequest } from "../static/interfaces/requestsInterfaces";
import { CharacterService } from "../services/CharacterService";
import FileSchema from "../schemas/file";
import { FileService } from "../services/FileService";
import { FILE_SERVER_URI, FILE_SERVER_USERNAME, MONGO_URI } from "../static/constants";
import { NodeSSH } from "node-ssh";
import { verifyToken } from "../helpers/verifyToken";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  }
});

const upload = multer({ storage: storage });

const userService = new UserService();
const commonService = new CommonService();
const characterService = new CharacterService();
const fileService = new FileService();

router.post(URLs.UserRegistration, async (req, res) => {
  try {
    const user = await userService.registration(req.body);
    res.status(200).json(user);
  } catch (err: any) {
    console.log(err.message);
    res.status(400).json({ "error": err.message });
  }
});

router.get(URLs.UploadFilesList, async (req, res) => {
  try {
    FileSchema.find({}, (err: any, items: any) => {
      if (err) {
        res.status(500).send("err");
      } else {
        res.render("imagesPage", { items: items });
      }
    });
  } catch (err: any) {
    console.log(err.message);
    res.status(400).json({ "error": err.message });
  }
});

router.post(URLs.UploadFile, upload.single("picture"), async (req, res) => {
  try {
    if (req.file) {
      const image = await fileService.uploadFile(req.file);
      res.status(200).json(image);
    } else {
      res.status(400).json({ "file": "No files" });
    }
  } catch (err: any) {
    console.log(err.message);
    res.status(400).json({ "error": err.message });
  }
});

router.post(URLs.UserLogin, async (req, res) => {
  try {
    const user = await userService.login(req.body);
    res.status(200).json(user);
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ "error": err.message });
  }
});

router.post(URLs.UserAuth, verifyToken, async (req, res) => {
  try {
    res.status(200).json(req.body);
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ "error": err.message });
  }
});

router.get(URLs.UserList, async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json({ users: [...users] });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ "error": err.message });
  }
});

router.post(URLs.MainPageCommon, async (req: CustomRequest<MainPageDataRequest>, res) => {
  try {
    const data = await commonService.mainPageData(req.body);
    res.status(200).json({ ...data });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ "error": err.message });
  }
});

router.post(URLs.EntityAdd, async (req: CustomRequest<AddEntityRequest>, res) => {
  try {
    await characterService.add(req.body, req.headers["x-access-token"] as string);
    res.status(200).json({});
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ "error": err.message });
  }
});

router.get(URLs.EntityView, async (req: any, res) => {
  try {
    const data = await characterService.view(req.query["id"], req.query["type"]);
    res.status(200).json({ ...data });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ "error": err.message });
  }
});

// const ssh = new NodeSSH();
//
// router.get("/upload/test", async (req: any, res) => {
//   try {
//     await ssh.connect({
//       host: FILE_SERVER_URI,
//       username: FILE_SERVER_USERNAME,
//       privateKeyPath: "C:\\Users\\dmitr\\.ssh\\id_rsa" // TODO fix
//     });
//
//     await ssh.putFile(__dirname + "\\base_image.jpg", "/var/www/html/images/" + "base_image.jpg").then(() => {
//       console.log("success upload file");
//     }).catch((err) => {
//       console.log("err: " + err);
//     });
//     res.status(200).json({});
//   } catch (err: any) {
//     console.log(err.message);
//     res.status(500).json({ "error": err.message });
//   }
// });

export default router;