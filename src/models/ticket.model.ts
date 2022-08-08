import { DateField } from "./room.model";
import { HumanName } from "./user.model";

export type Ticket =  {
    status: TicketStatus 
    type: TicketType,
    title: string,
    uid: string, 
    email: string, 
    openedOn: DateField, 
    closedOn: null | DateField, 
    feedback: null | ExperienceLevel
} & HumanName



export enum TicketStatus {
    OPEN = 'open',
    CLOSED = 'closed'
} 
export enum TicketType {
    FEATURE_REQUEST = "feature request",
    UNEXPECTED = "unexpected activity",
    BUG = 'bug',
    QUESTION = 'FAQ',
    OTHER='other'
}

export enum ExperienceLevel {
    FRUSTRATED, 
    DISAPPOINTED, 
    CONTENT, 
    SATISFIED,
    ELATED
}

