import bcrypt from "bcrypt";
import { User } from "../../models/User";

export const registerUser = async (firstName: string, phone: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ firstName, phone, password: hashedPassword, role: "user" });
  await user.save();
  return user;
};
