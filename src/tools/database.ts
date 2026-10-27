import Database from '@tauri-apps/plugin-sql';
import { TableId } from '../hooks/useConfig';
import { Id } from '../types';

import { parseRow, parseSqlValues } from '.';
import { room_list } from '../configs/room';
import { room_ctg_list } from '../configs/room_ctg';
import { employers_datas } from '../configs/employer';

let db: Database | null = null;

type D = Record<string, any> & { id: Id };

export type Key_String<T> = Record<keyof T, string>;

export namespace DB {

  export const getDatabase = async () => {
    return db ??= await Database.load('sqlite:reception.db');
  }

  export const createTable = async <T>(table: TableId, datas: Key_String<T>) => {
    const db = await getDatabase();
    const keys_values = Object.entries(datas).map(([key, value]) => `${key} ${value}`).join(', ');
    await db.execute(`CREATE TABLE IF NOT EXISTS ${table} (${keys_values})`);
  }

  export const readTable = async <T extends object>(table: TableId): Promise<T[]> => {
    const db = await getDatabase();
    const datas = await db.select<Record<string, unknown>[]>(`SELECT * FROM ${table}`);
    const res = datas.map(row => parseRow<T>(row));
    return res;
  }

  export const insert_ignore = async <T extends D>( table: TableId, datas: Omit<T, 'id'> ): Promise<T> => {
    const db = await getDatabase();
    const fields = Object.keys(datas).join(', ');
    const fields2 = Object.keys(datas).map(_ => '?').join(', ');
    const values = Object.values(datas);

    const command = `INSERT OR IGNORE INTO ${table} (${fields}) VALUES (${fields2})`;
    const { lastInsertId } = await db.execute(command, parseSqlValues(values));
    return { id: lastInsertId!, ...datas } as T;
  }

  export const update = async <T extends D>( table: TableId, id: string | Id, datas: Partial<T> ) => {
    const db = await getDatabase();
    const fields = Object.keys(datas).map(key => `"${key}" = ?`).join(', ');
    const values = Object.values(datas);

    const command = `UPDATE ${table} SET ${fields} WHERE id = ${id}`;
    await db.execute(command, parseSqlValues(values));
  }
}




export async function getDatabase2() {
  const db = DB.getDatabase();

  for (const room of room_list) {
    await DB.insert_ignore('bedroom_table', {
      id: room.id,
      name: room.name,
      categories: JSON.stringify(room.categories),
      stage: room.stage,
      issue: room.issue == null ? null : JSON.stringify(room.issue),
    });
  }

  for (const category of room_ctg_list) {
    await DB.insert_ignore('bedroom_ctg_table', {
      id: category.id,
      name: category.name,
      price: category.price,
      option: category.option
    });
  }

  for (const employer of employers_datas) {
    await DB.insert_ignore('employer_table', {
      id: employer.id,
      sexe: employer.sexe,
      name: employer.name,
      pass: employer.pass,
      rules: JSON.stringify(employer.rules),
    });
  }
  return db;
}

