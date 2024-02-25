import contactsService from "../services/contactsServices.js";
import { HttpError } from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  try {
    const allContacts = await contactsService.listContacts();
    res.status(200).json(allContacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await contactsService.getContactById(id);
    if (!contact) {
      throw new HttpError("Not found", 404);
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedContact = await contactsService.removeContact(id);
    if (!deletedContact) {
      throw new HttpError("Not found", 404);
    }
    res.status(200).json(deletedContact);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const createContact = async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const newContact = await contactsService.addContact(name, email, phone);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;
  try {
    const updatedContact = await contactsService.updateContact(
      id,
      updatedFields
    );
    if (!updatedContact) {
      throw new HttpError("Not found", 404);
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
};

export const updateStatusContact = async (req, res, next) => {
  const { id } = req.params;
  const { favorite } = req.body;

  try {
    const updatedContact = await contactsService.updateContact(id, {
      favorite,
    });

    if (!updatedContact) {
      next(HttpError(404, "Contact not found"));
    } else {
      res.json(updatedContact);
    }
  } catch (error) {
    next(HttpError(400, error.message));
  }
};
