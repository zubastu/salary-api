import {
  AllowNull,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import ShiftModel from './shiftModel';

@Table({
  tableName: 'employee',
})
class EmployeeModel extends Model<EmployeeModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  public override id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @HasMany(() => ShiftModel, {
    foreignKey: 'employee_id',
    as: 'workShifts',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true,
  })
  workShifts: ShiftModel[];
}

export default EmployeeModel;
