import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class UserSerie extends Model {}

UserSerie.init(
	{
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		serieId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		currentVolume: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		readingStatus: {
			type: DataTypes.ENUM("to_read", "reading", "finished", "dropped"),
			defaultValue: "to_read",
		},

		progress: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},

		total: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},

		status: {
			type: DataTypes.STRING, 
			defaultValue: "to-read",
		},
	},
	{
		sequelize,
		tableName: "user_series",
		underscored: true,
		timestamps: false,
	},
);
