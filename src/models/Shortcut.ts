import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "shortcuts",
})
export class Shortcut extends Model {
  @Column
  userId!: number;

  @Column
  shortlink!: string;

  @Column
  description!: string;

  @Column
  url!: string;

  @Column
  tags!: string;
}
