import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class UserAuthor extends Model {}

UserAuthor.init(
	{
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		authorId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
	},
	{
		sequelize,
		tableName: "user_authors",
		underscored: true,
		timestamps: true,
	},
);
