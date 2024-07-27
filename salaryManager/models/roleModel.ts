import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import UserModel from "./userModel";

@Table({
  tableName: "role",
  timestamps: false,
})
class Role extends Model<Role> {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
  })
  public override id: number;

  @HasMany(() => UserModel, {
    foreignKey: "role_id",
    as: "user",
    hooks: true,
  })
  user: UserModel;

  @Column({ type: DataType.STRING })
  role: string;
}

export default Role;
