import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

import ShiftModel from "./shiftModel";
import RoleModel from "./roleModel";

type UserCreationAttributes = {
  username: string;
  name: string;
  password: string;
  role_id: number;
};

@Table({
  tableName: "user",
  timestamps: false,
})
class User extends Model<User, UserCreationAttributes> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  public override id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  username: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  password?: string;

  @HasMany(() => ShiftModel, {
    foreignKey: "user_id",
    as: "workShifts",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    hooks: true,
  })
  workShifts: ShiftModel[];

  @ForeignKey(() => RoleModel)
  @Column(DataType.INTEGER)
  role_id: number;

  @BelongsTo(() => RoleModel)
  role: RoleModel;
}

export default User;
