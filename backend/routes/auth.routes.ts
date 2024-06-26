import { Router } from "express";
import UserModel from "../models/user.model";
import { User } from "@common/interfaces/user.interface";
import { compareSync, hashSync } from "bcrypt";
import { authenticate, createUserToken } from "../auth.module";

const router = Router();

router.post("/signup", async (req, res) => {
  try {
    const user: User = req.body;
    if (!user.email || !user.name || !user.password) {
      return res
        .status(400)
        .json({ message: "Missing required fields for the user!" });
    }

    const userExists = await UserModel.findOne<User>({ email: user.email });
    if (userExists)
      return res.status(400).json({ message: "Email already exists!" });

    const hashedPassword: string = await hashSync(user.password, 10);
    user.password = hashedPassword;

    await UserModel.create(user);
    const newUser = await UserModel.findOne<User>({
      email: user.email,
    }).lean<User>();

    if (!newUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    delete newUser.password;
    const token = createUserToken({ ...newUser });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Missing required fields for the user!" });
    }

    const user = await UserModel.findOne<User>({ email }).lean<User>();
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (!(await compareSync(password, user.password!))) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    delete user.password;
    const token = createUserToken({ ...user });
    res.status(200).json({ message: "User authenticated successfully", token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/user", authenticate, async (req, res) => {
  res.status(200).json(req.user);
});

export default router;
