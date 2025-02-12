import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export const identifyUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("/identify called")
    const { phoneNumber, email } = req.body;
   
    if (isInvalid(phoneNumber) && isInvalid(email)) {
      console.log(phoneNumber, email);
      res.status(400).json({ error: `'phoneNumber' & 'email' both cannot invalid` });
      return;
    }

    const user = await UserService.identifyUser((phoneNumber == null ||phoneNumber.length ==0)? null : phoneNumber , (email == null || email.length==0)?null: email);
    res.status(200).json(user);
  } catch (error) {
    console.error('Identify User Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

function isInvalid(input: any): boolean {
    if(input== undefined || input == null || input.length == 0 )
      return true;
    return false
}

