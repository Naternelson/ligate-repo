import { firestore } from "firebase-admin"

export type ChatRoom = {
    taggedMembers: MemberTag[]
    members: {[uid: string]: ChatMember}

}

export type MemberTag = {
    id: string, 
    name: string 
}

export interface ChatMember {
    uid: string 
    name: string 
    profileURL?: string,
    chatName: string
    status: ChatStatus
}

export enum ChatStatus {
    UNRESTRICTED = "unrestricted",
    BLOCKED = 'blocked'
} 


export interface ChatMessage {
    uid: string 
    receivedOn?: DateField
    readOn?: DateField
    message: string
    name: string  
}

export type DateField = firestore.Timestamp