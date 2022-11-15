import { NextFunction } from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../database";
import { AccessToken } from "../models/AccessToken";
import jwt from "jsonwebtoken";

export const authJwt = async (req: Request, res: Response, next: NextFunction) => {
  // Get bearer token from request header
  const token = req.headers.authorization?.split(' ')[1] as string;

  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    // Verify token
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as any;

    // Get token from database
    const accessTokenRepository = AppDataSource.getRepository(AccessToken);
    const accessToken = await accessTokenRepository.findOneBy({ token });

    // Check if token exists
    if (!accessToken) return res.status(401).json({ message: "Unauthorized" });

    // Check if token is expired
    if (accessToken.tokenExpires < new Date()) {
      await accessTokenRepository.delete(accessToken);
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Set user id to request
    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
