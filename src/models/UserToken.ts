import { Table, Model, Column, DataType } from "sequelize-typescript";
import internal from "stream";

@Table({
  tableName: "user_tokens",
})
export class UserToken extends Model {
  @Column
  userId!: number;

  @Column
  token!: string;
}
