import {Book} from "../models/index.js"

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

      if (!type || type === "title") {
        results = [...results, ...(await Book.findAll({
          where: {
            [Op.or]: [
              { title: { [Op.iLike]: `%${searchTerm}%` } }
            ]
          },
          include: [{ model: Author, as: "authors" }, { model: Genre, as: "genres" }],
          limit: 10
        }))];
      }

      if (!type || type === "author") {
        results = [...results, ...(await Book.findAll({
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
              }
            },
            { model: Genre, as: "genres" }
          ],
          limit: 10
        }))];
      }
      const uniqueBooks = results.reduce((uniqueList, book) => {
        if (!uniqueList.find(existingBook => existingBook.id === book.id)) uniqueList.push(book);
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
          { model: Genre, as: "genres", through: { attributes: [] } },
        ],
      });
      if (!book) return res.status(404).json({ error: "Livre non trouvé" });
      res.json(book);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  },
}
};