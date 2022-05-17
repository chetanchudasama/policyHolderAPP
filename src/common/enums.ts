export enum AnswerType {
    Text = 1,
    Dropdown = 2,
    Number = 3,
    Checkbox = 4,
}

export enum OperatorType {
    EqualTo = 1,
    GreaterThan = 2,
    LessThan = 3,
    GreaterThanOrEqualTo = 4,
    LessThanOrEqualTo = 5,
    NotEqualTo = 6,
    In = 7,
    NotIn = 8,
}

export enum ContactPreference {
    SMS = 1,
    Email = 2,
    Call = 3,
}

export enum ClaimTrackingType {
    TrackClaimEmergencyDetail = "TrackClaimEmergencyDetail",
    TrackClaimRequest = "TrackClaimRequest",
    TrackCoverIncluded = "TrackCoverIncluded",
    TrackEngineerAssigned = "TrackEngineerAssigned",
    TrackEngineerOnTheWay = "TrackEngineerOnTheWay",
    TrackEngineerOnSite = "TrackEngineerOnSite",
    TrackClaimVisitComplete = "TrackClaimVisitComplete",
}

export enum PhoneNumberType {
    FixedLine = 0,
    Mobile = 1,
    // In some regions (e.g. the USA), it is impossible to distinguish between fixed-line and
    // mobile numbers by looking at the phone number itself.
    FixedLineOrMobile = 2,
    // Freephone lines
    TollFree = 3,
    PremiumRate = 4,
    // The cost of this call is shared between the caller and the recipient, and is hence typically
    // less than PREMIUM_RATE calls. See // http://en.wikipedia.org/wiki/Shared_Cost_Service for
    // more information.
    SharedCost = 5,
    // Voice over IP numbers. This includes TSoIP (Telephony Service over IP).
    VOIP = 6,
    // A personal number is associated with a particular person, and may be routed to either a
    // MOBILE or FIXED_LINE number. Some more information can be found here:
    // http://en.wikipedia.org/wiki/Personal_Numbers
    PersonalNumber = 7,
    Pager = 8,
    // Used for "Universal Access Numbers" or "Company Numbers". They may be further routed to
    // specific offices, but allow one number to be used for a company.
    UAN = 9,
    // A phone number is of type UNKNOWN when it does not fit any of the known patterns for a
    // specific region.
    Unknown = 10,
    Emergency = 27,
    Voicemail = 28,
    ShortCode = 29,
    StandardRate = 30,
}

export enum ResponseType {
    NotMatch = 1,
    Expired = 2,
    Verified = 3,
}

export enum ReCaptchaErrorType {
    MissingInputResponse = 'missing-input-response',
    InvalidInputResponse = 'invalid-input-response',
    BadRequest = 'bad-request',
}

export enum Levels {
    Low = 1,
    Medium = 2,
    High = 3,
}
