import {
  Table,
  Model,
  Column,
  PrimaryKey,
  DataType,
} from "sequelize-typescript";

@Table({
  timestamps: false,
  tableName: "User",
})
class User extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING })
  Id!: string;

  @Column({ type: DataType.BOOLEAN })
  Bot!: boolean;

  @Column({ type: DataType.STRING })
  Username!: string;

  @Column({ type: DataType.STRING })
  Discriminator!: string;

  @Column({ type: DataType.BOOLEAN })
  Verified!: boolean;

  @Column({ type: DataType.BOOLEAN })
  Mfa!: boolean;
}

export default User;
