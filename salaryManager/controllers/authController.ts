import User from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import type { NextFunction, Request, Response } from "express";
import RoleModel from "../models/roleModel";
import { ROLES } from "../../utils/constants";
import type { AuthenticatedRequest } from "../authenticatedRequest";

dotenv.config();

const checkDuplicateUsername = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  User.findOne({ where: { username: String(req.body.username ?? "") } })
    .then((user) => {
      if (user) {
        res.status(400).send({ message: "Failed! Username is already in use!" });
        return;
      }
      next();
    })
    .catch(() => {
      res.status(400).json({ message: "Bad request" });
    });
};

const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers["x-access-token"];
  const secret = process.env.SECRET;

  if (typeof token !== "string") {
    res.status(403).send({ message: "No token provided!" });
    return;
  }
  if (!secret) {
    next(new Error("Missing SECRET environment variable"));
    return;
  }

  jwt.verify(token, secret, (error, decoded) => {
    if (error) {
      res.status(401).send({ message: "Unauthorized!" });
      return;
    }
    if (typeof decoded !== "object" || !decoded || typeof decoded.id !== "string") {
      next(new Error("Bad token"));
      return;
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req: AuthenticatedRequest, _: Response, next: NextFunction) => {
  if (!req.userId) {
    next(new Error("Unauthorized"));
    return;
  }

  User.findByPk(req.userId)
    .then((user) => {
      if (!user) {
        next(new Error("User not found"));
        return;
      }
      void RoleModel.findByPk(user.role_id)
        .then((role) => {
          if (role?.role !== ROLES[1]) {
            next(new Error("Admin role required!"));
            return;
          }
          next();
        })
        .catch(next);
    })
    .catch(next);
};

const signup = (req: Request, res: Response) => {
  const username = String(req.body.username ?? "");
  const name = String(req.body.name ?? "");
  const password = bcrypt.hashSync(String(req.body.password ?? ""), 8);
  const role_id = Number(req.body.role_id ?? 0);

  User.create({ username, password, name, role_id })
    .then((user) => {
      res.status(200).send({ name: user.name, role_id: user.role_id, id: user.id });
    })
    .catch(() => {
      res.status(400).json({ message: "Bad request" });
    });
};

const signin = (req: Request, res: Response) => {
  const secret = process.env.SECRET;
  if (!secret) {
    res.status(500).send({ message: "Server authentication is not configured." });
    return;
  }

  User.findOne({
    where: { username: String(req.body.username ?? "") },
    include: { model: RoleModel },
  })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "User Not found." });
        return;
      }
      const password = user.password;
      const passwordIsValid = Boolean(password) && bcrypt.compareSync(String(req.body.password ?? ""), password ?? "");
      if (!passwordIsValid) {
        res.status(401).send({ accessToken: null, message: "Invalid Password!" });
        return;
      }

      const token = jwt.sign({ id: user.id }, secret, {
        algorithm: "HS256",
        expiresIn: 86400,
      });
      res.status(200).send({
        id: user.id,
        username: user.username,
        accessToken: token,
        role: user.role.role,
      });
    })
    .catch((error: Error) => {
      res.status(500).send({ message: error.message });
    });
};

export { checkDuplicateUsername, signin, signup, verifyToken, isAdmin };
