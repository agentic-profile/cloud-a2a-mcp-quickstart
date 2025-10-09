
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
    "_id": "68e65a413baee2dfccb51fad",
    "activityDefinition": "68e65a413baee2dfccb51fad",
    "title": "BELIFF 2025 Festival Volunteer – London",
    "description": "Join the Be Epic! London International Film Festival (BELIFF) as a volunteer from 20–23 November 2025 at the BLOC Screening Room, London. Support screenings, meet filmmakers, and be part of a creative international film community.\n\nWe are looking for enthusiastic, reliable volunteers to join the team behind the Be Epic! London International Film Festival (BELIFF), running from 2–23 November 2025 at the BLOC Screening Room, London.\nAs a volunteer, you will help ensure the festival runs smoothly and that filmmakers and audiences alike have a memorable experience. Tasks may include:\nWelcoming and registering guests, filmmakers, and industry professionals\nAssisting with box office, ticketing, and seating\nSupporting technical teams with screenings (training provided where needed)\nDistributing programmes, managing information desks, and answering audience queries\nHelping with photography, social media, or content creation (if you have these skills)\nGeneral festival support and representing BELIFF with a friendly, professional attitude\nYou will be part of a dynamic, multicultural team that celebrates independent cinema from around the world. Volunteers may work flexible shifts during the festival period, with opportunities to attend screenings and network with filmmakers when not on duty.\nThis role is ideal for anyone passionate about film, events, and community arts who wants first-hand experience in running an international cultural event.\n",
    "type": "Event",
    "eventApplicationType": "Team",
    "coverImage": "https://s3.eu-west-2.amazonaws.com/doit2.0-production-uploads/ActivityPicture/3d376e02-cdb3-47ee-ab9c-ed216839fea4_2025-10-08T12:34:08.174Z.png",
    "thumbnailImage": "https://s3.eu-west-2.amazonaws.com/doit2.0-production-uploads/ActivityPicture/3d376e02-cdb3-47ee-ab9c-ed216839fea4_2025-10-08T12:34:08.906Z.png",
    "organizationSubDocument": {
        "name": "Be Epic! London International Film Festival",
        "logo": "https://s3.eu-west-2.amazonaws.com/doit2.0-production-uploads/OrganizationPicture/LOGO_BELIFF.jpg",
        "logoThumbnail": "https://s3.eu-west-2.amazonaws.com/doit2.0-production-uploads/ActivityPicture/thumbnail_LOGO_BELIFF.webp"
    },
    "locationOption": "Single Location",
    "volunteerRewards": [],
    "activitiesSummary": [
        {
            "_id": "68e65a423baee2dfccb51fbb",
            "startDate": "2025-11-20T13:00:00.000Z",
            "endDate": "2025-11-22T22:10:00.000Z",
            "address": {
                "street": "1 Westfield Way, London",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        -0.037875,
                        51.5240685
                    ]
                },
                "_id": "68e65a423baee2dfccb51fbc",
                "createdAt": "2025-10-08T12:34:10.470Z",
                "updatedAt": "2025-10-08T12:34:10.470Z"
            },
            "bookingsNumber": 0,
            "teamsNumber": 1,
            "teamsMinSize": 2,
            "teamsMaxSize": 6,
            "regions": [],
            "isOnline": false,
            "score": 1.998470664024353
        }
    ],
    "app": "65a46db14b30b7dd175eb67a",
    "measurementUnit": "64d25c55ac1f5f7596c5671a",
    "targetAmount": 0,
    "appSummary": {
        "_id": "65a46db14b30b7dd175eb67a",
        "name": "Volunteer",
        "logo": "https://s3.eu-west-2.amazonaws.com/doit2.0-production-static/doit-logo.png",
        "description": "Unlock the power of community engagement with the Do It Volunteer App! Discover tailored volunteer opportunities, register effortlessly, and track your impact. Connect with a network of passionate volunteers and organizations, enhancing your skills and building lasting friendships. Stay informed with updates and reminders about upcoming events. Join the Do It Volunteer community today to create positive change and build stronger, connected communities. Get the app now and start making a difference!",
        "brandColor": "#27272A",
        "ecosystemSummary": {
            "_id": "64093b512eed5dcadba5088b",
            "logo": "https://s3.eu-west-2.amazonaws.com/doit2.0-production-uploads/OrganizationPicture/4868792e-a31b-4bed-a43c-c209ea90a813_2024-10-15T17:56:31.458Z.jpeg",
            "name": "Life "
        },
        "organizationSummary": {
            "_id": "64093b512eed5dcadba50889",
            "logo": "https://s3.eu-west-2.amazonaws.com/doit2.0-production-uploads/OrganizationPicture/4868792e-a31b-4bed-a43c-c209ea90a813_2024-10-15T17:57:01.299Z.jpeg",
            "name": "Do it"
        }
    },
    "measurementUnitSummary": {
        "_id": "64d25c55ac1f5f7596c5671a",
        "category": "Time",
        "singularLabel": "Hour",
        "pluralLabel": "Hours"
    },
    "createdAt": "2025-10-08T12:34:10.033Z",
    "activitiesCount": 1,
    "causeOptions": [
        {
            "displayName": "Community",
            "relatedTo": "causeOptions",
            "icon": "https://s3.eu-west-2.amazonaws.com/doit2.0-production-static/activity-categories/users.svg",
            "images": [],
            "app": "64093b532eed5dcadba50893",
            "_id": "64093b542eed5dcadba50897",
            "createdAt": "2025-10-08T12:34:10.032Z",
            "updatedAt": "2025-10-08T12:34:10.032Z"
        }
    ],
    "requirementOptions": [
        {
            "displayName": "+18",
            "relatedTo": "requirementOptions",
            "images": [],
            "app": "64093b532eed5dcadba50893",
            "_id": "64093b562eed5dcadba508a9",
            "createdAt": "2025-10-08T12:34:10.032Z",
            "updatedAt": "2025-10-08T12:34:10.032Z"
        },
        {
            "displayName": "Own Transport",
            "relatedTo": "requirementOptions",
            "images": [],
            "app": "64093b532eed5dcadba50893",
            "_id": "64093b572eed5dcadba508ab",
            "createdAt": "2025-10-08T12:34:10.032Z",
            "updatedAt": "2025-10-08T12:34:10.032Z"
        }
    ]
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