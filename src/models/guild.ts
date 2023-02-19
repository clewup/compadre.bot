import {
  Table,
  Model,
  Column,
  PrimaryKey,
  DataType,
} from "sequelize-typescript";

export interface IGuild {
  id: string;
  name: string;
  ownerId: string;
  memberCount: number;
  joinedTimestamp: number;
  maximumMembers: number;
  preferredLocale: string;
}

@Table({
  timestamps: false,
  tableName: "Guild",
})
class Guild extends Model<IGuild> {
  @PrimaryKey
  @Column({ type: DataType.STRING })
  id!: string;

  @Column({ type: DataType.STRING })
  name!: string;

  @Column({ type: DataType.STRING })
  ownerId!: string;

  @Column({ type: DataType.BIGINT })
  memberCount!: number;

  @Column({ type: DataType.BIGINT })
  joinedTimestamp!: number;

  @Column({ type: DataType.BIGINT })
  maximumMembers!: number;

  @Column({ type: DataType.STRING })
  preferredLocale!: string;
}

export default Guild;
