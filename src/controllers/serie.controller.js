import { Serie, Book } from "../models/index.js";

async function getSerieById(req, res) {
	try {
		const { id } = req.params;

		const serie = await Serie.findByPk(id, {
			include: [
				{
					model: Book,
					as: "books",
				},
			],

			order: [[{ model: Book, as: "books" }, "seriesPosition", "ASC"]],
		});

		if (!serie) {
			return res.status(404).json({
				message: "Serie not found",
			});
		}

		return res.json(serie);
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			message: "Internal server error",
		});
	}
}

export { getSerieById };
