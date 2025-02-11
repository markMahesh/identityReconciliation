import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export const identifyUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      res.status(400).json({ error: 'Name and Email are required' });
      return;
    }

    const user = await UserService.identifyUser(name, email);
    res.status(200).json(user);
  } catch (error) {
    console.error('Identify User Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
