import {
  Table,
  Model,
  Column,
  PrimaryKey,
  DataType,
} from "sequelize-typescript";

export interface IUser {
  id: string;
  bot: boolean;
  username: string;
  discriminator: string;
}

@Table({
  timestamps: false,
  tableName: "User",
})
class User extends Model<IUser> {
  @PrimaryKey
  @Column({ type: DataType.STRING })
  id!: string;

  @Column({ type: DataType.BOOLEAN })
  bot!: boolean;

  @Column({ type: DataType.STRING })
  username!: string;

  @Column({ type: DataType.STRING })
  discriminator!: string;
}

export default User;
