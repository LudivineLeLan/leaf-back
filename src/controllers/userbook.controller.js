import { UserBook, Book, Author, Genre } from "../models/index.js";
import { Op } from "sequelize";

export const userBookController = {
  // Recherche dans la bibliothèque du user
  async search(req, res) {
    try {
      const { q } = req.query;

      if (!q || q.trim().length < 2) {
        return res.json([]);
      }

      const searchTerm = q.trim();
      const words = searchTerm.split(/\s+/);

      let results = await UserBook.findAll({
        where: { userId: req.user.id }, 
        include: [
          {
            model: Book,
            include: [
              { model: Author, as: "authors", through: { attributes: [] } },
              { model: Genre, as: "genres", through: { attributes: [] } },
            ],
            where: {
              [Op.or]: [
                { title: { [Op.iLike]: `%${searchTerm}%` } }, 
                ...words.map(word => ({
                  '$Book.authors.name$': { [Op.iLike]: `%${word}%` },
                })),
                ...words.map(word => ({
                  '$Book.authors.firstname$': { [Op.iLike]: `%${word}%` },
                })),
              ]
            },
          },
        ],
        limit: 10,
      });

      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur recherche dans la bibliothèque" });
    }
  },

  // Détails d'un livre
  async getDetails(req, res) {
    try {
      const userBook = await UserBook.findOne({
        where: { id: req.params.id, userId: req.user.id },
        include: {
          model: Book,
          include: [
            { model: Author, as: "authors", through: { attributes: [] } },
            { model: Genre, as: "genres", through: { attributes: [] } },
          ],
        },
      });

      if (!userBook) return res.status(404).json({ error: "Livre non trouvé dans votre bibliothèque" });

      res.json(userBook);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
};
