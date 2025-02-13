import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { db } from '../config/database';

export enum LinkedPrecedence{
  PRIMARY = 'primary',
  SECONDRAY = 'secondary'
}

export interface IContact {
    id: number;
    phoneNumber?: string;
    email?: string;
    linkedId?: number;
    linkPrecedence: LinkedPrecedence;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

export class UserModel {

  private static tableName = "contact";

  static async findByEmail(email: string): Promise<IContact | null> {
    const [rows]: [RowDataPacket[], any] = await db.query(`SELECT * FROM ${this.tableName} WHERE email = ?`, [email]);
    return rows.length > 0 ? (rows[0] as IContact) : null;
  }

  static async findAllMatchingContacts(phoneNumber?: string, email?: string): Promise<IContact[]> {
    const [rows]: [RowDataPacket[], any] = await db.query(
      `SELECT * FROM ${this.tableName} WHERE email = ? OR phoneNumber = ?`,
      [email, phoneNumber]
    );
    return rows as IContact[];
  }

  static async findByLinkedId(linkedId: number): Promise<IContact[]> {
    const [rows]: [RowDataPacket[], any] = await db.query(
      `SELECT * FROM ${this.tableName} WHERE linkedId = ?`,
      [linkedId]
    );
    return rows as IContact[];
  }

  static async updateLinkedId(oldLinkedId: number, newLinkedId: number): Promise<void> {
    await db.query(
      `UPDATE ${this.tableName} SET linkedId = ?, linkPrecedence = "secondary" WHERE linkedId = ? OR id = ?`,
      [newLinkedId, oldLinkedId, oldLinkedId]
    );
  }

  static async findById(id: number): Promise<IContact | null> {
    const [rows]: [RowDataPacket[], any] = await db.query(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    return rows.length > 0 ? (rows[0] as IContact) : null;
  }


  static async findAllByIdOrLinkedId(id: number): Promise<IContact[]> {
    const [rows]: [RowDataPacket[], any] = await db.query(
      `SELECT * FROM ${this.tableName} WHERE linkedId = ? ORDER BY createdAt ASC`,
      [id]
    );
    return rows as IContact[];
  }

  static async createUser(phoneNumber?: string, email?: string, linkedId?: number, linkPrecedence?: string): Promise<any> {
    const [result]: [ResultSetHeader, any] = await db.query(`INSERT INTO ${this.tableName} (phoneNumber, email, linkedId, linkPrecedence) VALUES (?, ?, ?, ?)`, [phoneNumber, email, linkedId, linkPrecedence]);
    return { result };
  }
}