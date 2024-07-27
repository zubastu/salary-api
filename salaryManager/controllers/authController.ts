import User from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import type { NextFunction, Request, Response } from "express";
import RoleModel from "../models/roleModel";
import { ROLES } from "../../utils/constants";
import UserModel from "../models/userModel";

dotenv.config();

const checkDuplicateUsername = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (user) {
        res.status(400).send({
          message: "Failed! Username is already in use!",
        });
        return;
      }

      next();
    })
    .catch(() => {
      res.status(400).json({ message: "Bad request" });
    });
};

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers["x-access-token"];
  const secret = process.env.SECRET!;

  if (!token) {
    res.status(403).send({
      message: "No token provided!",
    });
    return;
  }
  if (typeof token === "string") {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.status(401).send({
          message: "Unauthorized!",
        });
        return;
      }
      //@ts-ignore
      if (!decoded.id) {
        next(new Error("Плохой токен говна"));
        return;
      }
      //@ts-ignore
      req.userId = decoded.id;
      next();
    });
  }
};

const isAdmin = (req: Request, _: Response, next: NextFunction) => {
  // @ts-ignore
  UserModel.findOne({ where: { id: req.userId } }).then((user) => {
    if (user) {
      RoleModel.findByPk(Number(user.role_id)).then((role) => {
        if (role?.role !== ROLES[1]) {
          const error = new Error("Admin role required!");
          next(error);
          return;
        }
        next();
      });
    }
  });
};

const signup = (req: Request, res: Response) => {
  const username = req.body.username;
  const password = bcrypt.hashSync(req.body.password, 8);

  // @ts-ignore
  User.create({ username, password, name: req.body.name })
    .then((user) => {
      if (user.id) {
        User.update(
          {
            // @ts-ignore
            role_id: 0,
          },
          { where: { id: user.id }, returning: true },
        )
          .then((data) => {
            if (data) {
              const userData = data[1][0];
              const { name, role_id, id } = userData;
              res.status(200).send({ name, role_id, id });
            }
          })
          .catch(() => {
            res.status(400).json({ message: "Bad request" });
          });
      }
    })
    .catch(() => {
      res.status(400).json({ message: "Bad request" });
    });
};

const signin = (req: Request, res: Response) => {
  const secret = process.env.SECRET!;
  User.findOne({
    where: {
      username: req.body.username,
    },
    include: {
      model: RoleModel,
    },
  })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "User Not found." });
        return;
      }
      if (user && user.password) {
        const passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password,
        );

        if (!passwordIsValid) {
          res.status(401).send({
            accessToken: null,
            message: "Invalid Password!",
          });
        }

        const token = jwt.sign({ id: user.id }, secret, {
          algorithm: "HS256",
          allowInsecureKeySizes: true,
          expiresIn: 86400, // 24 hours
        });

        res.status(200).send({
          id: user.id,
          username: user.username,
          accessToken: token,
          role: user.role.role,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

export { checkDuplicateUsername, signin, signup, verifyToken, isAdmin };
