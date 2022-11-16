import { Request, Response } from "express";
import { AppDataSource } from "../database";
import { Account } from "../models/Account";
import { Transaction } from "../models/Transaction";
import { User } from "../models/User";
import { TransferRequest } from "../requests/TransferRequest";

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

export const transfer = async (req: Request, res: Response) => {
  const { accountId } = req.params;
  const { value, creditedUsername } = req.body as TransferRequest;

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

  // Check if amount is valid
  if (value <= 0) return res.status(400).json({ message: "Invalid amount" });

  // Check if account has enough balance
  if (account.balance < value)
    return res.status(400).json({ message: "Insufficient balance" });

  // Get user account to transfer to
  const userRepository = AppDataSource.getRepository(User);
  const toUser = await userRepository.findOne({
    where: { username: creditedUsername },
    relations: ["account"],
  });

  // Check if user exists
  if (!toUser) return res.status(404).json({ message: "User not found" });

  // Check if account to transfer to exists
  if (!toUser.account)
    return res.status(404).json({ message: "Account to transfer to not found" });

  // Check if account to transfer to is the same as the account to transfer from
  if (toUser.account.id === account.id)
    return res.status(400).json({ message: "Cannot transfer to the same account" });

  // Transfer amount
  account.balance -= value;
  toUser.account.balance += value;
  await accountRepository.save(account);
  await accountRepository.save(toUser.account);

  // Save transaction
  const transactionRepository = AppDataSource.getRepository(Transaction);
  const transaction = new Transaction();
  transaction.debitedAccount = account;
  transaction.creditedAccount = toUser.account;
  transaction.value = value;
  transaction.createdAt = new Date();
  await transactionRepository.save(transaction);

  return res.status(200).json({ message: "Transfer successful" });
};

export const getTransactions = async (req: Request, res: Response) => {
  const { accountId } = req.params;
  const { page, limit, date, type } = req.query;

  const pageNumber = page ? parseInt(page as string) : 1;
  const limitNumber = limit ? parseInt(limit as string) : 10;

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

  // Get transactions
  const transactionRepository = AppDataSource.getRepository(Transaction);
  const query = transactionRepository
    .createQueryBuilder("transaction")
    .innerJoinAndSelect("transaction.creditedAccount", "creditedAccount");

  // Filter by date (YYYY-MM-DD)
  if (date) {
    const dateStart = new Date(date as string);
    const dateEnd = new Date(dateStart);
    dateEnd.setDate(dateEnd.getDate() + 1);
    query.andWhere("transaction.createdAt BETWEEN :dateStart AND :dateEnd", {
      dateStart,
      dateEnd,
    });
  }

  // Filter by type
  switch (type) {
    case "credit":
      query.andWhere("transaction.creditedAccount = :accountId", {
        accountId: account.id,
      });
      break;
    case "debit":
      query.andWhere("transaction.debitedAccount = :accountId", {
        accountId: account.id,
      });
      break;
    default:
      query.andWhere(
        "transaction.creditedAccount = :accountId OR transaction.debitedAccount = :accountId",
        { accountId: account.id }
      );
      break;
  }

  // Sort by date
  query.orderBy("transaction.createdAt", "DESC");

  // Paginate
  const rows = await query
    .skip((pageNumber - 1) * limitNumber)
    .take(limitNumber)
    .getMany();

  // Get total count
  const totalCount = await query.getCount();

  // Set type credit or debit
  const transactions = rows.map((transaction) => {
    let type;
    if (transaction.creditedAccount.id === account.id) type = "credit";
    else type = "debit";
    return { ...transaction, type, creditedAccount: undefined };
  });

  return res.status(200).json({ transactions, totalCount });
};
