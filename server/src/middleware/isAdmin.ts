import { Response, NextFunction } from "express";
import { AuthRequest } from "./isAuthenticated";

const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

export default isAdmin;
