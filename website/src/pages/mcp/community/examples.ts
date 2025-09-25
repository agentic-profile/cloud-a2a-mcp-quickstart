
// Example Charity Organization
export const CHARITY_EXAMPLE = {
    name: "Hope for Tomorrow Foundation",
    description: "A non-profit organization dedicated to providing educational resources and support to underprivileged children in urban communities.",
    purpose: "To empower children through education and create opportunities for a brighter future",
    type: "Non-profit",
    websiteLink: "https://www.hopefortomorrow.org",
    termsOfServicesLink: "https://www.hopefortomorrow.org/terms",
    logo: "https://www.hopefortomorrow.org/images/logo.png",
    logoThumbnail: "https://www.hopefortomorrow.org/images/logo-thumb.png",
    address: "123 Community Street, Downtown District",
    fullAddress: {
        street: "123 Community Street, Downtown District, Metro City, MC 12345",
        location: {
            type: "Point",
            coordinates: [-74.0059, 40.7128] // [longitude, latitude] for NYC area
        }
    },
    admins: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
    causeOptions: ["507f1f77bcf86cd799439013", "507f1f77bcf86cd799439014"], // Education, Children's Welfare
    domainSlug: "hope-for-tomorrow",
    contactEmail: "info@hopefortomorrow.org",
    contactPhoneNumber: "+1-555-123-4567",
    organizationSettings: {
        hasExternalId: true,
        measurementGoal: 1000, // Target 1000 volunteer hours per quarter
        departments: ["Education", "Community Outreach", "Volunteer Management", "Fundraising"]
    },
    apiKey: "hf_sk_1234567890abcdef",
    webhookEndpoint: "https://api.hopefortomorrow.org/webhooks/volunteer-updates",
    isMigrated: false
};

// Example Event Activity
export const EVENT_EXAMPLE = {
    _id: "507f1f77bcf86cd799439020",
    volunteerNumber: 50, // Limited to 50 volunteers
    isVolunteerNumberLimited: true,
    isOnline: false,
    meetingLink: undefined, // Not an online event
    externalApplyLink: undefined,
    bookingsNumber: 0, // No bookings yet
    attendeesNumber: 0, // No attendees yet
    teamsNumber: 0, // No teams yet
    teamsMinSize: 2,
    teamsMaxSize: 5,
    regions: [
        {
            _id: "507f1f77bcf86cd799439021",
            displayName: "Metro City",
            relatedTo: null,
            type: "City",
            geocenterLocation: { lon: -74.0059, lat: 40.7128 },
            createdAt: "2024-01-15T10:00:00.000Z",
            updatedAt: "2024-01-15T10:00:00.000Z"
        }
    ],
    createdAt: "2024-01-15T10:00:00.000Z",
    // Event-specific fields
    startDate: "2024-03-15T09:00:00.000Z", // March 15, 2024 at 9:00 AM
    endDate: "2024-03-15T17:00:00.000Z",   // March 15, 2024 at 5:00 PM
    dueDate: "2024-03-10T23:59:59.000Z"    // Application deadline: March 10, 2024
};

// Example Volunteer User
export const VOLUNTEER_USER_EXAMPLE = {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    address: "456 Oak Street, Metro City, MC 12345",
    profileImageUrl: "https://www.hopefortomorrow.org/profiles/sarah-johnson.jpg",
    phoneNumber: "+1-555-987-6543",
    roles: ["user"],
    birthDate: "1990-05-15T00:00:00.000Z",
    userProfiles: [
        {
            organization: "507f1f77bcf86cd799439011", // Hope for Tomorrow Foundation
            roles: ["volunteer", "tutor"]
        }
    ],
    createdAt: "2024-01-10T08:30:00.000Z",
    updatedAt: "2024-01-15T14:22:00.000Z"
};

// Example Volunteer User Profile
export const VOLUNTEER_PROFILE_EXAMPLE = {
    _id: "507f1f77bcf86cd799439022",
    user: "507f1f77bcf86cd799439023", // Sarah Johnson's user ID
    emailPreferences: {
        joinConfirmation: true,
        bookingConfirmation: true,
        applicationConfirmation: true,
        bookingReminder: true,
        canceledEvent: true,
        canceledOngoingOpportunity: true,
        thirdParty: false,
        survey: true,
        registerParticipation: true,
        weeklyDigest: true,
        dailyDigest: false
    },
    profilePicture: "https://www.hopefortomorrow.org/profiles/sarah-johnson-thumb.jpg",
    externalId: "HF001234", // External ID assigned by Hope for Tomorrow Foundation
    createdAt: "2024-01-10T08:30:00.000Z",
    organization: "507f1f77bcf86cd799439011", // Hope for Tomorrow Foundation
    ecosystem: "507f1f77bcf86cd799439024", // Education ecosystem
    preferences: {
        skills: [
            "507f1f77bcf86cd799439025", // Teaching
            "507f1f77bcf86cd799439026", // Childcare
            "507f1f77bcf86cd799439027", // Event Planning
            "507f1f77bcf86cd799439028"  // Fundraising
        ],
        address: {
            street: "456 Oak Street",
            suburb: "Downtown",
            govermentArea: "Metro City",
            country: "United States",
            countryCode: "US",
            location: {
                type: "Point",
                coordinates: [-74.0060, 40.7130] // [longitude, latitude]
            }
        }
    }
};