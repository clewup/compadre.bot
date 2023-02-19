import {
  Table,
  Model,
  Column,
  PrimaryKey,
  DataType,
} from "sequelize-typescript";

@Table({
  timestamps: false,
  tableName: "Guild",
})
class Guild extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING })
  Id!: string;

  @Column({ type: DataType.STRING })
  Name!: string;

  @Column({ type: DataType.STRING })
  OwnerId!: string;

  @Column({ type: DataType.BIGINT })
  MemberCount!: number;

  @Column({ type: DataType.BIGINT })
  JoinedTimestamp!: number;

  @Column({ type: DataType.BIGINT })
  MaximumMembers!: number;

  @Column({ type: DataType.STRING })
  PreferredLocale!: string;
}

export default Guild;
