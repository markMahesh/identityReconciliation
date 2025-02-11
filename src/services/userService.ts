import { IUser, UserModel } from '../models/userModel';

export class UserService {
  static async identifyUser(name: string, email: string): Promise<IUser> {
    let user = await UserModel.findByEmail(email);
    if (!user) {
      user = await UserModel.createUser(name, email);
    }
    return user;
  }
}
