import { IUser, LinkedPrecedence, UserModel } from '../models/userModel';
import { IdentifyUserResp } from '../dto/res/identifyUserResp';

export class UserService {
  static async identifyUser(phoneNumber?: string, email?: string): Promise<IdentifyUserResp> {
    const linkedContacts: IUser[] = await UserModel.findAllMatchingContacts(phoneNumber, email);
    console.log('linkedContacts: ', linkedContacts);
    let resp: IdentifyUserResp;
    if (linkedContacts.length == 0) {
      const newContact : any = await UserModel.createUser(phoneNumber, email, undefined, LinkedPrecedence.PRIMARY);
      console.log(newContact);
       resp = {
        contact: {
          primaryContatctId: newContact.result.insertId,
          emails: (email)? [email]:[],
          phoneNumbers: (phoneNumber)? [phoneNumber] : [],
          secondaryContactIds: []
        }
      }
    }
    else {
      let primaryId = -1;
      let isEmailFound: boolean = (email)? false : true;
      let isPhoneNumberFound: boolean = (phoneNumber) ? false : true;
      const primaryIdsSet: Set<number> = new Set();
      let primaryContact: IUser;
      const primaryContacts: IUser[] = linkedContacts.filter(contact => {
        if (isEmailFound == false && contact.email != null && email != null && contact.email === email)
          isEmailFound = true;
        if (isPhoneNumberFound == false && contact.phoneNumber != null && phoneNumber != null && contact.phoneNumber === phoneNumber)
          isPhoneNumberFound = true;
        if (contact.linkedId == null)
          primaryIdsSet.add(contact.id);
        else
          primaryIdsSet.add(contact.linkedId);
        return contact.linkPrecedence === LinkedPrecedence.PRIMARY
      });
      const primaryContact2: IUser[] = [];
      for (const primaryId of primaryIdsSet) {
        const contact = await UserModel.findById(primaryId);
        if (contact != null)
          primaryContact2.push(contact);
      }
      console.log('primaryIds', primaryIdsSet);
      console.log('primaryIds', primaryContact2);
      if (primaryContact2.length == 2) {
        const primaryContactIndex = (primaryContact2[0].createdAt < primaryContact2[1].createdAt) ? 0 : 1;
        const secondaryContactIndex = (primaryContactIndex + 1) % 2;
        primaryId = primaryContact2[primaryContactIndex].id;
        primaryContact = primaryContact2[primaryContactIndex];

        UserModel.updateLinkedId(primaryContact2[secondaryContactIndex].id, primaryContact2[primaryContactIndex].id)
      }
      else if (primaryContact2.length == 1) {
        primaryId = primaryContact2[0].id;
        primaryContact = primaryContact2[0];
        if (isEmailFound == false || isPhoneNumberFound == false){ // new information
          console.log(isEmailFound, isPhoneNumberFound);
          await UserModel.createUser(phoneNumber, email, primaryContact2[0].id, LinkedPrecedence.SECONDRAY);
        }
      }
      else {
        /*
        //secondary value found
        // test case 1 linkedContact have same linkedId  
        //             P(p1,null)
        //       S(p1,e2)       S(p1,e3)
        // 
        // req-> (p2,e2); in this case new contact will be created.

        // test case 2 linkedContact have diff linkedId

        //     P(p1,null)                       P(p2,e4)
        // S(p1,e2)     S(p1,e3)          S(p2,e6)   S(p3,e4)
        // 
        // req-> (p1,e6) in this case primary becomes secondary
        // req-> (p3,e3) in this case primary becomes secondary
        // get the primary contact which is secondary contact's linked id
        // create new contact
        */

        console.log("THIS CASE SHOULD NOT COME")
        primaryContact = primaryContact2[0];
      }

      resp = {
        contact: {
          primaryContatctId: primaryContact.id,
          emails: (primaryContact?.email) ? [primaryContact.email] : [],
          phoneNumbers: (primaryContact?.phoneNumber) ? [primaryContact.phoneNumber] : [],
          secondaryContactIds: []
        }
      };
      const allLinkedContactList = await UserModel.findAllByIdOrLinkedId(primaryId);
      const emailSet: Set<string> = new Set();
      const phoneNumberSet: Set<string> = new Set();
      if (primaryContact.email)
        emailSet.add(primaryContact?.email);
      if (primaryContact.phoneNumber)
        phoneNumberSet.add(primaryContact?.phoneNumber);
      allLinkedContactList.forEach(contact => {
        resp.contact.secondaryContactIds.push(contact.id);
        if (contact.email && !emailSet.has(contact.email)) {
          resp.contact.emails.push(contact.email);
          emailSet.add(contact.email);
        }

        if (contact.phoneNumber && !phoneNumberSet.has(contact.phoneNumber)) {
          resp.contact.phoneNumbers.push(contact.phoneNumber);
          phoneNumberSet.add(contact.phoneNumber);
        }
      });
    }
    return resp;

  }
}