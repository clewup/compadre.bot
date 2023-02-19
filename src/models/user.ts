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
  discordSnowflake!: string;
}

export default User;
