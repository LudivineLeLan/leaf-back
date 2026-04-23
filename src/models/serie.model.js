import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class Serie extends Model {}

Serie.init(
	{
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},

		normalizedName: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: "normalized_name",
		},

		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		type: {
			type: DataTypes.ENUM("manga", "novel", "comic"),
			allowNull: false,
			defaultValue: "manga",
		},
		total_volumes: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		status: {
			type: DataTypes.ENUM("ongoing", "completed", "hiatus"),
			allowNull: false,
			defaultValue: "ongoing",
		},
		external_api_id: {
			type: DataTypes.STRING,
			unique: true,
		},
	},
	{
		sequelize,
		tableName: "series",
	},
);
