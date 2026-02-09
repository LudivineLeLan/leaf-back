import { Book, Author, Genre } from "../models/index.js";
import { Op } from "sequelize";

export const bookController = {
  async search(req, res) {
    try {
      const { q, type } = req.query;

      if (!q || q.trim().length < 2) {
        return res.json([]);
      }

      const searchTerm = q.trim();
      const words = searchTerm.split(/\s+/);

      let results = [];

      // Recherche par titre
      if (!type || type === "title") {
        const titleResults = await Book.findAll({
          where: { title: { [Op.iLike]: `%${searchTerm}%` } },
          include: [
            { model: Author, as: "authors", through: { attributes: [] } },
            { model: Genre, as: "genres", through: { attributes: [] } }
          ],
          limit: 10
        });
        results = [...results, ...titleResults];
      }

      // Recherche par auteur
      if (!type || type === "author") {
        const authorResults = await Book.findAll({
          include: [
            {
              model: Author,
              as: "authors",
              where: {
                [Op.and]: words.map(word => ({
                  [Op.or]: [
                    { firstname: { [Op.iLike]: `%${word}%` } },
                    { name: { [Op.iLike]: `%${word}%` } }
                  ]
                }))
              },
              through: { attributes: [] }
            },
            { model: Genre, as: "genres", through: { attributes: [] } }
          ],
          limit: 10
        });
        results = [...results, ...authorResults];
      }

      // Résultat unique
      const uniqueBooks = results.reduce((uniqueList, book) => {
        if (!uniqueList.find(b => b.id === book.id)) uniqueList.push(book);
        return uniqueList;
      }, []);

      res.json(uniqueBooks.slice(0, 10));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur recherche" });
    }
  },

  async getDetails(req, res) {
    try {
      const book = await Book.findByPk(req.params.id, {
        include: [
          { model: Author, as: "authors", through: { attributes: [] } },
          { model: Genre, as: "genres", through: { attributes: [] } }
        ],
      });

      if (!book) return res.status(404).json({ error: "Livre non trouvé" });

      res.json(book);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
};
