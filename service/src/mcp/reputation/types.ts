import { StoreItem } from "../../stores/types.js";

/*
* roles:
* - subject: who this reputation is about
* - reporter: who is reporting this reputation, author of the report
* 
* id: <reporterDid+key>
* key: unique to reporter/ownerDid
* reporterDid: reporter of the reputation => Find everything they've reported
* subjectDid: subject of the reputation => Find all reputations about a subject
* kind: type of the reputation, e.g. "review", "rating", "recommendation", "feedback", etc.
*/

export interface ReputationItem extends StoreItem {
    key: string;    // keeps per-owner items separate, must be unique per reporter
    subjectDid: string;
    reporterDid: string
    kind: string;
    reputation: any;
}