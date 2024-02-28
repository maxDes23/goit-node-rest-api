import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  const contacts = await contactsService.listContacts();
  res.status(200).json(contacts);
};

export const getOneContact = async (req, res, next) => {
  const contact = await contactsService.getContactById(req.params.id);
  if (contact) {
    res.status(200).json(contact);
  } else {
    next(HttpError(404));
  }
};

export const deleteContact = async (req, res, next) => {
  const contact = await contactsService.removeContact(req.params.id);
  if (contact) {
    res.status(200).json(contact);
  } else {
    next(HttpError(404));
  }
};

export const createContact = async (req, res, next) => {
  const contact = await contactsService.addContact(req.body);
  res.status(201).json(contact);
};

export const updateContact = async (req, res, next) => {
  const contact = await contactsService.updateContact(req.params.id, req.body);
  if (contact) {
    res.status(200).json(contact);
  } else {
    next(HttpError(404, "Contact not found"));
  }
};

export const updateStatusContact = async (req, res, next) => {
  const { id } = req.params;
  const { favorite } = req.body;

  const updatedContact = await contactsService.updateContact(id, { favorite });

  if (!updatedContact) {
    next(HttpError(404, "Contact not found"));
  } else {
    res.json(updatedContact);
  }
};
