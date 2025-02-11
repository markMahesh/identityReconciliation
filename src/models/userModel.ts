import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { db } from '../config/database';

export interface IUser {
  id: number;
  name: string;
  email: string;
  created_at?: Date;
  deleted_at?: Date;
}

export class UserModel {
  static async findByEmail(email: string): Promise<IUser | null> {
    const [rows]: [RowDataPacket[], any] = await db.query('SELECT * FROM abcd WHERE email = ?', [email]);
    return rows.length > 0 ? (rows[0] as IUser) : null;
  }

  static async createUser(name: string, email: string): Promise<IUser> {
    const [result]: [ResultSetHeader, any] = await db.query('INSERT INTO abcd (name, email) VALUES (?, ?)', [name, email]);
    return { id: result.insertId, name, email };
  }
}