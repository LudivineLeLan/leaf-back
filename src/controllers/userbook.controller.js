import { UserBook, Book, Author, Genre } from "../models/index.js";
import { Op } from "sequelize";

export const userBookController = {
  // Recherche dans la bibliothèque du user
async search(req, res) {
    try {
      const { q } = req.query;

      if (!q || q.trim().length < 2) return res.json([]);

      const searchTerm = q.trim();
      const words = searchTerm.split(/\s+/);

      // Création de toutes les conditions possibles
      const authorConditions = words.flatMap(word => [
        { '$book.authors.name$': { [Op.iLike]: `%${word}%` } },
        { '$book.authors.firstname$': { [Op.iLike]: `%${word}%` } },
      ]);

      const genreConditions = words.map(word => ({
        '$book.genres.name$': { [Op.iLike]: `%${word}%` }
      }));

      const results = await UserBook.findAll({
        where: { userId: req.user.id },
        include: [
          {
            model: Book,
            as: 'book',
            required: true,
            include: [
              { model: Author, as: 'authors', through: { attributes: [] }, required: false },
              { model: Genre, as: 'genres', through: { attributes: [] }, required: false }
            ]
          }
        ],
        limit: 10,
        // where sur la requête finale pour inclure tous les critères
        subQuery: false,
        order: [['book', 'title', 'ASC']],
        // where principal combine titre, auteurs et genres
        where: {
          [Op.and]: { userId: req.user.id },
          [Op.or]: [
            { '$book.title$': { [Op.iLike]: `%${searchTerm}%` } },
            ...authorConditions,
            ...genreConditions
          ]
        }
      });

      res.json(results);

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur de recherche dans la bibliothèque" });
    }
  },

  // Détails d'un livre
  async getDetails(req, res) {
    try {
      const userBook = await UserBook.findOne({
        where: { id: req.params.id, userId: req.user.id },
        include: {
          model: Book,
          as : 'book',
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
