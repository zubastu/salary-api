import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

import UserModel from "./userModel";

@Table({
  tableName: "workShifts",
})
class ShiftModel extends Model<ShiftModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  public override id: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  date: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  gain: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  cash: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  cash_in_case: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  costs: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  workHours: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  salary: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isNightShift: boolean;

  @ForeignKey(() => UserModel)
  @Column(DataType.UUID)
  user_id: UserModel;

  @BelongsTo(() => UserModel, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    hooks: true,
  })
  public user: UserModel;
}

export default ShiftModel;
