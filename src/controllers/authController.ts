import { Request, Response } from "express";
import { SignupRequest } from "../requests/SignupRequest";
import { User } from "../models/User";
import { AppDataSource } from "../database";
import { Account } from "../models/Account";
import { AccessToken } from "../models/AccessToken";
import { LoginRequest } from "../requests/LoginRequest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
  const { username, password } = req.body as SignupRequest;

  // Check if username has at least 3 characters
  if (username.length < 3)
    return res.status(400).json({ message: "Username must be at least 3 characters" });

  // Check if password has at least 8 characters and at least one number and one uppercase letter
  if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[A-Z])[A-Za-z\d]{8,}$/.test(password))
    return res.status(400).json({
      message:
        "Password must be at least 8 characters, contain at least one number, one letter and one uppercase letter",
    });

  // Check if username is already taken
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ username });
  if (user) return res.status(400).json({ message: "Username is already taken" });

  try {
    // Create a new user and save it to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User();
    user.username = username;
    user.password = hashedPassword;
    const newUser = await userRepository.save(user);

    // Create a new account with 100 default balance and save it to the database with the user as the owner
    const accountRepository = AppDataSource.getRepository(Account);
    const account = new Account();
    account.balance = 100;
    account.user = newUser;
    await accountRepository.save(account);

    return res.status(201).json({ message: `User ${newUser.username} created` });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body as LoginRequest;

  // Get user from database
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ username });

  // Check if user exists
  if (!user)
    return res.status(400).json({ message: "Username or password is incorrect" });

  // Check if password is correct
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).json({ message: "Username or password is incorrect" });

  // Set jwt token expiration time to 1 day (86400 seconds)
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: 86400,
  });

  // Save token to database
  const accessTokenRepository = AppDataSource.getRepository(AccessToken);
  const accessToken = new AccessToken();
  accessToken.token = token;
  accessToken.tokenExpires = new Date(Date.now() + 86400 * 1000);
  const newAccessToken = await accessTokenRepository.save(accessToken);

  return res.status(200).json({ token: newAccessToken.token });
};
