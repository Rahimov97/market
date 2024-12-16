import bcrypt from "bcrypt";
import { User } from "../../models/User";

export const loginUser = async (phone: string, password: string) => {
  const user = await User.findOne({ phone, role: "user" });
  if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }
  return user;
};
