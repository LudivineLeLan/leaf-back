import { Author } from '../models/index.js';

export const authorController = {

  async getAllAuthors(req, res) {
    try {
      const authors = await Author.findAll({});
      res.json(authors);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des auteurs' });
    }
  },

  async getAuthorById(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res.status(400).json({ error: "Format d'ID invalide" });
      }
      const author = await Author.findByPk(id);
      if (!author) {
        return res.status(404).json({ error: "Auteur non trouvé. Veuillez vérifier l’ID fourni" });
      }
      res.status(200).json(author);
    } catch (err) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  },
};