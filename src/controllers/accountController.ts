import { Request, Response } from "express";
import { AppDataSource } from "../database";
import { Account } from "../models/Account";

export const getBalance = async (req: Request, res: Response) => {
  const { accountId } = req.params;

  // Get account with user from database
  const accountRepository = AppDataSource.getRepository(Account);
  const account = await accountRepository.findOne({
    where: { id: accountId },
    relations: ["user"],
  });

  // Check if account exists
  if (!account) return res.status(404).json({ message: "Account not found" });

  // Check if user exists
  if (!account.user) return res.status(404).json({ message: "User not found" });

  // Check if userId in params matches userId in token
  if (account.user.id !== req.userId)
    return res.status(401).json({ message: "Unauthorized" });

  return res.status(200).json({ balance: account.balance });
};
