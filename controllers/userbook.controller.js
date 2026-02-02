import { User, Book, UserBook, Author } from '../models/index.js';

export const userbookController = {
  async getBooks(req, res) {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur introuvable' });
      }

      const userbooks = await UserBook.findAll({
        where: { user_id: user.id },
        include: [
          {
            model: Book, as: "book",
            include: [
              { model: Author, as: "authors" }
            ]
          }
        ],
        order: [[{ model: Book, as: "book" }, 'title', 'ASC']],
        limit,
        offset
      });

      const totalBooks = await UserBook.count({
        where: { user_id: user.id }
      });
      const totalPages = Math.ceil(totalBooks / limit);

      res.json({
        page,
        totalPages,
        totalBooks,
        userbooks
      });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération de la booklist' });
    }

  },

  async addBookToUserList(req, res) {
    try {
      const { userId, bookId } = req.params;
      const { toRead } = req.body;

      if (!userId || !bookId) {
        return res.status(400).json({ message: "userId et bookId sont requis" });
      }

      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

      const book = await Book.findByPk(bookId);
      if (!book) return res.status(404).json({ error: "Livre non trouvé." });

      const existingEntry = await UserBook.findOne({
        where: { user_id: userId, book_id: bookId },
      });

      if (existingEntry) {
        return res.status(400).json({ message: "Ce livre est déjà dans la liste de l'utilisateur." });
      }

      const userBook = await UserBook.create({
        user_id: userId,
        book_id: bookId,
        toRead: true,
      });

      return res.status(201).json({
        message: "Livre ajouté à la booklist avec succès.",
        data: userBook,
      });

    } catch (error) {
      return res.status(500).json({ error: "Erreur serveur", error: error.message });
    }
  },

  async removeBookFromUserList(req, res) {
    try {
      const { userId, bookId } = req.params;

      if (!userId || !bookId) {
        return res.status(400).json({ message: "userId et bookId sont requis" });
      }

      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

      const book = await Book.findByPk(bookId);
      if (!book) return res.status(404).json({ message: "Livre non trouvé." });

      const deleted = await UserBook.destroy({
        where: { user_id: userId, book_id: bookId }
      });

      if (deleted) {
        return res.status(200).json({
          message: "Livre retiré de la booklist avec succès."
        });
      } else {
        return res.status(404).json({
          message: "Livre non trouvé dans la booklist."
        });
      }

    } catch (error) {
      return res.status(500).json({
        error: "Erreur serveur",
        message: error.message
      });
    }
  },

  async updateReadStatus(req, res) {
    try {
      const { userId, bookId } = req.params;
      const { toRead } = req.body;

      if (!userId || !bookId) {
        return res.status(400).json({ message: "userId et bookId sont requis" });
      }

      if (typeof toRead !== 'boolean') {
        return res.status(400).json({ message: "toRead doit être un booléen" });
      }

      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

      const book = await Book.findByPk(bookId);
      if (!book) return res.status(404).json({ message: "Livre non trouvé." });

      const [updated] = await UserBook.update(
        { toRead },
        { where: { user_id: userId, book_id: bookId } }
      );

      if (updated) {
        return res.status(200).json({
          message: "Statut de lecture mis à jour avec succès."
        });
      } else {
        return res.status(404).json({
          message: "Livre non trouvé dans la booklist."
        });
      }

    } catch (error) {
      return res.status(500).json({
        error: "Erreur serveur",
        message: error.message
      });
    }
  },

  async checkBookStatus(req, res) {
    try {
      const { userId, bookId } = req.params;

      if (!userId || !bookId) {
        return res.status(400).json({ message: "userId et bookId sont requis" });
      }

      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

      const book = await Book.findByPk(bookId);
      if (!book) return res.status(404).json({ message: "Livre non trouvé." });

      const userbook = await UserBook.findOne({
        where: { user_id: userId, book_id: bookId }
      });

      if (userbook) {
        return res.status(200).json({
          inBooklist: true,
          toRead: userbook.toRead
        });
      } else {
        return res.status(200).json({
          inBooklist: false,
          toRead: false
        });
      }

    } catch (error) {
      return res.status(500).json({
        error: "Erreur serveur",
        message: error.message
      });
    }
  }

};