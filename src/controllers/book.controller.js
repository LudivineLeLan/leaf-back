import { UserBook, Book, Author, Genre } from "../models/index.js";

export const userBookController = {
  async addBookToUserList(req, res) {
  try {
    const userId = req.user.id;
    const { bookId } = req.params;
    const { status = 'to_read' } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: "bookId requis" });
    }

    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé." });
    }

    const existingEntry = await UserBook.findOne({
      where: { userId, bookId },
    });

    if (existingEntry) {
      return res.status(400).json({
        message: "Ce livre est déjà dans votre bibliothèque.",
      });
    }

    const userBook = await UserBook.create({
      userId,
      bookId,
      status, // exemple : to_read | reading | finished
    });

    return res.status(201).json(userBook);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
},

async updateReadStatus(req, res) {
  try {
    const { userId, bookId } = req.params;
    const { toRead } = req.body;

    if (!userId || !bookId) {
      return res.status(400).json({ message: "userId et bookId sont requis" });
    }

    if (typeof toRead !== "boolean") {
      return res.status(400).json({ message: "toRead doit être un booléen" });
    }

    const userBook = await UserBook.findOne({
      where: {
        user_id: userId,
        book_id: bookId,
      },
    });

    if (!userBook) {
      return res.status(404).json({
        message: "Livre non trouvé dans la booklist de l'utilisateur.",
      });
    }

    userBook.toRead = toRead;
    await userBook.save();

    return res.status(200).json({
      message: "Statut de lecture mis à jour avec succès.",
      data: userBook,
    });

  } catch (error) {
    return res.status(500).json({
      error: "Erreur serveur",
      message: error.message,
    });
  }
}
};