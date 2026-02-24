import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class User extends Model {}

User.init(
	{
		username: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},

		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		avatar: {
			type: DataTypes.STRING(100),
			allowNull: true,
		},
	},
	{
		sequelize,
		tableName: "users",
		underscored: true,
	},
);
