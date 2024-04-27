export interface BookingHistory {
    id: any;
    company: any;
    client: any;
    bookingDate: any;
    pickupAddress: any;
    destinationAddress: any;
    movingDate: any;
    movingTime: any;
    services: any;
    status: any;
    payment: any;
    chat: {id: any, user: any, message: any, dateTime: any};
}
