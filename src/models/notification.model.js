import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class Notification extends Model {}

Notification.init(
	{
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		type: {
			type: DataTypes.ENUM("new_book", "new_serie"),
			allowNull: false,
		},
		isRead: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		googleBooksId: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		sequelize,
		tableName: "notifications",
		underscored: true,
		timestamps: true,
	},
);
