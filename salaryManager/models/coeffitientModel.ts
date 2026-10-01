import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

type CoefficientCreationAttributes = {
  id: number;
  pricePerHour: number;
  valueOfGainGoodDay: number;
  valueOfGainGoodNight: number;
  valueOfGainVeryGoodDay: number;
  valueOfGainVeryGoodNight: number;
  coefficientOfGainGood: number;
  coefficientOfGainVeryGood: number;
};

@Table({
  tableName: "coefficient",
  timestamps: false,
})
class Coefficient extends Model<Coefficient, CoefficientCreationAttributes> {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
  })
  public override id: number;

  @Column({ type: DataType.INTEGER })
  pricePerHour: number;

  @Column({ type: DataType.INTEGER })
  valueOfGainGoodDay: number;

  @Column({ type: DataType.INTEGER })
  valueOfGainGoodNight: number;

  @Column({ type: DataType.INTEGER })
  valueOfGainVeryGoodDay: number;

  @Column({ type: DataType.INTEGER })
  valueOfGainVeryGoodNight: number;

  @Column({ type: DataType.DECIMAL })
  coefficientOfGainGood: number;

  @Column({ type: DataType.DECIMAL })
  coefficientOfGainVeryGood: number;
}

export default Coefficient;
