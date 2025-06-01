import { Contact } from "../entities/Contact";
import { AppDataSource } from "../data-source";

export class ContactService {
    private contactRepository = AppDataSource.getRepository(Contact);

    async identifyContact(email?: string, phoneNumber?: string) {
        if (!email && !phoneNumber) {
            throw new Error("Either email or phoneNumber must be provided");
        }

        const matchingContacts = await this.contactRepository.find({
            where: [
                { email, deletedAt: false },
                { phoneNumber, deletedAt: false }
            ]
        });

        if (matchingContacts.length === 0) {
            const newContact = this.contactRepository.create({
                email,
                phoneNumber,
                linkPrecedence: "primary"
            });
            return await this.contactRepository.save(newContact);
        }

        let primaryContact = matchingContacts.find(contact => contact.linkPrecedence === "primary");
        
        if (!primaryContact) {
            primaryContact = matchingContacts.sort((a, b) => 
                a.createdAt.getTime() - b.createdAt.getTime()
            )[0];
            
            primaryContact.linkPrecedence = "primary";
            await this.contactRepository.save(primaryContact);
        }

        for (const contact of matchingContacts) {
            if (contact.id !== primaryContact.id && contact.linkPrecedence === "primary") {
                contact.linkPrecedence = "secondary";
                contact.linkedId = primaryContact.id;
                await this.contactRepository.save(contact);
            }
        }

        if ((email && !matchingContacts.some(c => c.email === email)) ||
            (phoneNumber && !matchingContacts.some(c => c.phoneNumber === phoneNumber))) {
            const newSecondaryContact = this.contactRepository.create({
                email,
                phoneNumber,
                linkPrecedence: "secondary",
                linkedId: primaryContact.id
            });
            await this.contactRepository.save(newSecondaryContact);
        }

        const allRelatedContacts = await this.contactRepository.find({
            where: [
                { id: primaryContact.id, deletedAt: false },
                { linkedId: primaryContact.id, deletedAt: false }
            ]
        });

        return {
            primaryContactId: primaryContact.id,
            emails: [...new Set(allRelatedContacts.map(c => c.email).filter(Boolean))],
            phoneNumbers: [...new Set(allRelatedContacts.map(c => c.phoneNumber).filter(Boolean))],
            secondaryContactIds: allRelatedContacts
                .filter(c => c.linkPrecedence === "secondary")
                .map(c => c.id)
        };
    }
} 