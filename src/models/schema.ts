/** Schema */
/** "/users/{USERID}" 
 *      @type User 
 *  "/units/{UNITID}"
 *      @type Unit
    *  "--/meta/access"
    *      Outlines which users have access rights to 
    *      @type UnitUsers
    *  "--/access-requests/{REQUESTID}"
    *      Requests by users to certain units to become an admin
    *      @type UnitAccessRequest
 * "/members/{MEMBERID}"
 *      @type Member
 *      "--/callings/{CALLINGID}"
 *          A History of this member's past callings and the units that was assigned to
 *          @type CallingHistory
 *      "--/records/{RECORDID}"
 *          A History of this member's past wards/branches 
 *          @type RecordHistory
 *      "--/recommends/{RECOMMENDID}"
 *          A History of this member's past temple recommends
 *          @type RecommendHistory
 * "/subscription-requests/{REQUESTID}"
 *      @type SubscriptionRequest
 * "/subscriptions/{SUBSCRIPTIONID}"
 *      @type Subscription
 * "/chatrooms/{ROOMID}"
 *      @type ChatRoom
 *      "--/chats/{CHATID}
 *          @type ChatMessage
 * "/support-tickets/{TICKETID}"
 *      @type Ticket
 *      "--/messages/"
 *          @type ChatMessage
*/
