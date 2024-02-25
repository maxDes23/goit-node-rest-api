import Contact from "../db/contacts";

async function listContacts() {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    console.error("Error reading contacts:", error);
  }
}

async function getContactById(contactId) {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (error) {
    console.error("Error getting contact by ID:", error);
  }
}

async function removeContact(contactId) {
  try {
    const contact = await Contact.findByIdAndDelete(contactId);
    return contact;
  } catch (error) {
    console.error("Error removing contact:", error);
  }
}

async function addContact(name, email, phone) {
  try {
    const newContact = new Contact({ name, email, phone });
    await newContact.save();
    return newContact;
  } catch (error) {
    console.error("Error adding contact:", error);
  }
}

async function updateContact(id, updatedContact) {
  try {
    const contact = await Contact.findByIdAndUpdate(id, updatedContact, {
      new: true,
    });
    return contact;
  } catch (error) {
    console.error("Error updating contact:", error);
  }
}

async function updateStatusContact(id, favorite) {
  try {
    const contact = await Contact.findByIdAndUpdate(
      id,
      { favorite },
      { new: true }
    );
    return contact;
  } catch (error) {
    console.error("Error updating contact status:", error);
  }
}

const contactsService = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};

export default contactsService;
