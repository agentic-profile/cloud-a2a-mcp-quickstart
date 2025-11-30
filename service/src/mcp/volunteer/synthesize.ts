import { Volunteer, Skill, Preferences, TimePreferences, DateRange, Cause, ISO639Language } from "./types.js";

export function createRandomVolunteer(): Volunteer {
    const name = randomName();
    const age = randomAge();
    const result: Volunteer = {
        did: "did:web:example.com:" + name.toLowerCase().replace(/ /g, '-') + '-' + Math.random().toString().substring(2, 4),
        name,
        description: randomDescription(),
        skills: randomSkills(),
        preferences: randomPreferences(),
        postcode: randomPostcode(),
        age,
        minor: age ? age < 18 : undefined,
        gender: randomGender(),
        languages: randomLanguages(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    return result;
}

const POSTCODES = [
    "DT1 2NH",
    "SW2 1RW",
    "EX32 7EU",
    "CO1 2SL",
    "B3 1DG",
    "NE63 9UJ",
    "SW1A 1AA",
    "SW1W 0NY",
    "SW3 2ST",
    "SW5 0AA",
    "SW7 2AZ",
    "SW10 0DT",
    "SW11 3BW",
    "SW15 2PU",
    "SW17 0RT",
    "SW19 2EU",
    "SE1 9RT",
    "SE5 9RS",
    "SE10 9RT",
    "SE11 5RT",
    "SE15 2RT",
    "SE16 3RT",
    "SE21 7RT",
    "SE23 2RT",
    "E1 6AN",
    "E2 8RT",
    "E3 2RT",
    "E5 8RT",
    "E8 1RT",
    "E9 5RT",
    "E10 6RT",
    "E11 2RT",
    "E14 5RT",
    "E15 1RT",
    "EC1A 1BB",
    "EC1M 6RT",
    "EC1N 8RT",
    "EC2A 4RT",
    "EC2M 1RT",
    "EC2N 2RT",
    "EC3A 7RT",
    "EC3M 1RT",
    "EC4A 1RT",
    "EC4M 9RT",
    "N1 9RT",
    "N2 0RT",
    "N3 2RT",
    "N4 1RT",
    "N5 1RT",
    "N6 5RT",
    "N7 0RT",
    "N8 9RT",
    "N9 0RT",
    "N10 3RT",
    "N11 1RT",
    "N12 8RT",
    "N13 5RT",
    "N14 6RT",
    "N15 4RT",
    "N16 5RT",
    "N17 0RT",
    "N19 4RT",
    "N20 0RT",
    "NW1 7RT",
    "NW2 2RT",
    "NW3 2RT",
    "NW4 2RT",
    "NW5 1RT",
    "NW6 1RT",
    "NW7 2RT",
    "NW8 7RT",
    "NW9 5RT",
    "NW10 2RT",
    "NW11 7RT",
    "W1A 1AA",
    "W1B 1RT",
    "W1C 1RT",
    "W1D 3RT",
    "W1F 7RT",
    "W1G 6RT",
    "W1H 1RT",
    "W1J 5RT",
    "W1K 2RT",
    "W1S 1RT",
    "W1T 1RT",
    "W1U 1RT",
    "W1W 5RT",
    "W2 1RT",
    "W3 0RT",
    "W4 1RT",
    "W5 1RT",
    "W6 7RT",
    "W7 2RT",
    "W8 5RT",
    "W9 2RT",
    "W10 5RT",
    "W11 1RT",
    "W12 7RT",
    "W13 0RT",
    "W14 0RT",
    "WC1A 1RT",
    "WC1B 3RT",
    "WC1E 6RT",
    "WC1H 9RT",
    "WC1N 1RT",
    "WC1R 4RT",
    "WC1X 8RT",
    "WC2A 1RT",
    "WC2B 4RT",
    "WC2E 7RT",
    "WC2H 9RT",
    "WC2N 4RT",
    "WC2R 0RT"
];

const FIRST_NAMES = [
    "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
    "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
    "Thomas", "Sarah", "Christopher", "Karen", "Charles", "Nancy", "Daniel", "Lisa",
    "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
    "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
    "Kenneth", "Carol", "Kevin", "Amanda", "Brian", "Dorothy", "George", "Melissa",
    "Timothy", "Deborah", "Ronald", "Stephanie", "Jason", "Rebecca", "Edward", "Sharon",
    "Jeffrey", "Laura", "Ryan", "Cynthia", "Jacob", "Kathleen", "Gary", "Amy",
    "Nicholas", "Angela", "Eric", "Shirley", "Jonathan", "Anna", "Stephen", "Brenda",
    "Larry", "Pamela", "Justin", "Emma", "Scott", "Nicole", "Brandon", "Helen",
    "Benjamin", "Samantha", "Samuel", "Katherine", "Frank", "Christine", "Gregory", "Debra",
    "Raymond", "Rachel", "Alexander", "Carolyn", "Patrick", "Janet", "Jack", "Virginia",
    "Dennis", "Maria", "Jerry", "Heather", "Tyler", "Diane", "Aaron", "Julie",
    "Jose", "Joyce", "Adam", "Victoria", "Henry", "Kelly", "Nathan", "Christina",
    "Douglas", "Joan", "Zachary", "Evelyn", "Kyle", "Judith", "Noah", "Megan",
    "Ethan", "Cheryl", "Jeremy", "Andrea", "Walter", "Hannah", "Christian", "Jacqueline",
    "Keith", "Martha", "Roger", "Gloria", "Terry", "Teresa", "Gerald", "Sara",
    "Harold", "Janice", "Sean", "Marie", "Austin", "Julia", "Carl", "Grace",
    "Arthur", "Judy", "Lawrence", "Theresa", "Dylan", "Madison", "Jesse", "Beverly",
    "Jordan", "Denise", "Bryan", "Marilyn", "Billy", "Amber", "Joe", "Danielle",
    "Bruce", "Rose", "Gabriel", "Brittany", "Logan", "Diana", "Albert", "Abigail",
    "Alan", "Jane", "Juan", "Lori", "Wayne", "Olivia", "Roy", "Jean",
    "Ralph", "Catherine", "Randy", "Frances", "Eugene", "Christina", "Vincent", "Kathryn",
    "Russell", "Rachel", "Louis", "Catherine", "Philip", "Janet", "Bobby", "Maria",
    "Johnny", "Heather", "Willie", "Diane"
];

const LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Wilson", "Anderson", "Thomas", "Taylor",
    "Moore", "Jackson", "Martin", "Lee", "Thompson", "White", "Harris", "Sanchez",
    "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King",
    "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams",
    "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts",
    "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards",
    "Collins", "Reyes", "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers",
    "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson", "Bailey", "Reed", "Kelly",
    "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson", "Watson", "Brooks",
    "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz", "Hughes",
    "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long", "Ross",
    "Foster", "Jimenez", "Powell", "Jenkins", "Perry", "Russell", "Sullivan", "Bell",
    "Coleman", "Butler", "Henderson", "Barnes", "Gonzales", "Fisher", "Vasquez", "Simmons",
    "Romero", "Jordan", "Patterson", "Alexander", "Hamilton", "Graham", "Reynolds", "Griffin",
    "Wallace", "Moreno", "West", "Cole", "Hayes", "Bryant", "Herrera", "Gibson",
    "Ellis", "Tran", "Medina", "Aguilar", "Stevens", "Murray", "Ford", "Castro",
    "Marshall", "Owens", "Harrison", "Fernandez", "Mcdonald", "Woods", "Washington", "Kennedy",
    "Wells", "Vargas", "Henry", "Chen", "Freeman", "Webb", "Tucker", "Guzman",
    "Burns", "Crawford", "Olson", "Simpson", "Porter", "Hunter", "Gordon", "Mendez",
    "Silva", "Shaw", "Snyder", "Mason", "Dixon", "Munoz", "Hunt", "Hicks",
    "Holmes", "Palmer", "Wagner", "Black", "Robertson", "Boyd", "Rose", "Stone",
    "Salazar", "Fox", "Warren", "Mills", "Meyer", "Rice", "Schmidt", "Garza",
    "Daniels", "Ferguson", "Nichols", "Stephens", "Soto", "Weaver", "Ryan", "Gardner",
    "Payne", "Grant", "Dunn", "Kelley", "Spencer", "Hawkins", "Arnold", "Pierce",
    "Vazquez", "Hansen", "Peters", "Santos", "Hart", "Bradley", "Knight", "Elliott",
    "Cunningham", "Duncan", "Armstrong", "Hudson", "Lane", "Ramos", "Andrews", "Ruiz"
];

function randomName(): string {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    return `${firstName} ${lastName}`;
}

const DESCRIPTION_TEMPLATES = [
    "A {quality1} and {quality2} volunteer with a passion for {passion} and making a difference in the community.",
    "Experienced volunteer who is {quality1} and {quality2}, always ready to help those in need. Passionate about {passion}.",
    "Dedicated individual with a {quality1} approach and {quality2} attitude towards community service, with a special interest in {passion}.",
    "Enthusiastic volunteer known for being {quality1} and {quality2} in all activities, particularly passionate about {passion}.",
    "Compassionate and {quality1} volunteer with a {quality2} commitment to helping others and a deep passion for {passion}.",
    "Reliable volunteer who brings {quality1} and {quality2} to every project and initiative, with a strong interest in {passion}.",
    "Motivated volunteer with a {quality1} spirit and {quality2} dedication to community welfare, especially passionate about {passion}.",
    "Skilled volunteer who is {quality1} and {quality2}, making a positive impact wherever they go. Has a passion for {passion}.",
    "Passionate about {passion}, bringing {quality1} and {quality2} to support local causes and volunteer activities.",
    "Community-minded volunteer with a {quality1} nature and {quality2} approach to service, driven by a passion for {passion}.",
    "Active volunteer who is {quality1} and {quality2}, always willing to lend a helping hand. Particularly interested in {passion}.",
    "Experienced in various volunteer roles, known for being {quality1} and {quality2}, with a special passion for {passion}.",
    "Dedicated volunteer with a {quality1} personality and {quality2} work ethic, motivated by a love for {passion}.",
    "Enthusiastic community member who is {quality1} and {quality2} in volunteer activities, with a keen interest in {passion}.",
    "Committed volunteer bringing {quality1} and {quality2} to make meaningful contributions, especially passionate about {passion}."
];

const QUALITIES = [
    "caring", "dedicated", "enthusiastic", "reliable", "compassionate", "motivated",
    "passionate", "skilled", "experienced", "committed", "active", "supportive",
    "helpful", "friendly", "patient", "organized", "creative", "resourceful",
    "adaptable", "positive", "energetic", "thoughtful", "diligent", "empathetic",
    "professional", "warm", "generous", "innovative", "collaborative", "resilient",
    "trustworthy", "flexible", "proactive", "detail-oriented", "team-oriented", "inspiring"
];

const PASSIONS = [
    "helping children and young people", "environmental conservation", "animal welfare",
    "supporting the elderly", "community development", "education and literacy",
    "health and wellbeing", "arts and culture", "sports and recreation",
    "crisis support", "homelessness prevention", "mental health awareness",
    "disability support", "food security", "refugee assistance",
    "youth mentoring", "community gardening", "heritage preservation",
    "emergency response", "social inclusion", "digital inclusion",
    "sustainable living", "wildlife protection", "community events",
    "healthcare support", "elderly care", "children's activities",
    "environmental education", "community outreach", "social justice"
];

function randomDescription(): string | undefined {
     if( Math.random() < 0.5 )
        return undefined; // half the time, no description

    const template = DESCRIPTION_TEMPLATES[Math.floor(Math.random() * DESCRIPTION_TEMPLATES.length)];
    
    // Get unique random qualities to fill slots
    const quality1 = QUALITIES[Math.floor(Math.random() * QUALITIES.length)];
    let quality2 = QUALITIES[Math.floor(Math.random() * QUALITIES.length)];
    // Ensure quality2 is different from quality1
    while (quality2 === quality1) {
        quality2 = QUALITIES[Math.floor(Math.random() * QUALITIES.length)];
    }
    
    // Get a random passion
    const passion = PASSIONS[Math.floor(Math.random() * PASSIONS.length)];
    
    return template
        .replace(/{quality1}/g, quality1)
        .replace(/{quality2}/g, quality2)
        .replace(/{passion}/g, passion);
}

const ALL_SKILLS: Skill[] = [
    "Business, Strategy & Legal",
    "Communications, Marketing & Events",
    "CPR/First Aid",
    "Creative Services",
    "Digital, Data & IT",
    "Finance & Fundraising",
    "Heavy Equipment Operator",
    "Leadership & Management",
    "Mechanic",
    "Medical Doctor",
    "Medical Nurse",
    "Medical Paramedic",
    "Organisational Policy & Governance",
    "Property & Infrastructure",
    "Radio Operator",
    "Research, Service Design & User Insight",
    "Search and Rescue",
    "Support, Training & Advocacy",
    "Sustainability & Energy"
];

function randomPostcode(): string | undefined {
    if (Math.random() < 0.5) {
        return undefined; // 50% chance of no postcode
    }
    return POSTCODES[Math.floor(Math.random() * POSTCODES.length)];
}

function randomSkills(): Skill[] | undefined {
    if (Math.random() < 0.5) {
        return undefined; // 50% chance of no skills
    }
    
    const numSkills = Math.floor(Math.random() * 3) + 1; // 1-3 skills
    const skills: Skill[] = [];
    const availableSkills = [...ALL_SKILLS];
    
    for (let i = 0; i < numSkills && availableSkills.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableSkills.length);
        skills.push(availableSkills.splice(randomIndex, 1)[0]);
    }
    
    return skills;
}

const ALL_CAUSES: Cause[] = [
    "Animal welfare",
    "Community",
    "Crisis and Welfare",
    "Emergency Response",
    "Health and social care",
    "Older people",
    "Sports",
    "Sports, art and culture",
    "Sustainability, heritage and environment",
    "Young People & Children"
];

const ALL_LANGUAGES: ISO639Language[] = ['en', 'fr', 'de', 'it', 'es', 'ru', 'zh', 'ja', 'ko', 'jp'];

const TIME_HOURS: ('morning' | 'afternoon' | 'evening')[] = ['morning', 'afternoon', 'evening'];
const TIME_DAYS: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[] = 
    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function randomTimePreferences(): TimePreferences | undefined {
    if (Math.random() < 0.4) {
        return undefined; // 40% chance of no time preferences
    }
    
    const preferences: TimePreferences = {};
    
    // Random hours (1-3)
    if (Math.random() < 0.7) {
        const numHours = Math.floor(Math.random() * 3) + 1;
        const hours: ('morning' | 'afternoon' | 'evening')[] = [];
        const availableHours = [...TIME_HOURS];
        for (let i = 0; i < numHours && availableHours.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableHours.length);
            hours.push(availableHours.splice(randomIndex, 1)[0]);
        }
        preferences.hours = hours;
    }
    
    // Random days (1-7)
    if (Math.random() < 0.7) {
        const numDays = Math.floor(Math.random() * 5) + 1; // 1-5 days
        const days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[] = [];
        const availableDays = [...TIME_DAYS];
        for (let i = 0; i < numDays && availableDays.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableDays.length);
            days.push(availableDays.splice(randomIndex, 1)[0]);
        }
        preferences.days = days;
    }
    
    // Random duration (1-8 hours)
    if (Math.random() < 0.6) {
        preferences.durationHours = Math.floor(Math.random() * 8) + 1;
    }
    
    return Object.keys(preferences).length > 0 ? preferences : undefined;
}

function randomDateRange(): DateRange | undefined {
    if (Math.random() < 0.6) {
        return undefined; // 60% chance of no date range
    }
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30)); // Start within next 30 days
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 180) + 30); // End 30-210 days after start
    
    return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
    };
}

function randomPreferences(): Preferences | undefined {
    if (Math.random() < 0.5) {
        return undefined; // 50% chance of no preferences
    }
    
    const preferences: Preferences = {};
    
    const times = randomTimePreferences();
    if (times) {
        preferences.times = times;
    }
    
    const dateRange = randomDateRange();
    if (dateRange) {
        preferences.dates = [dateRange];
    }
    
    // Random max distance (5-50 km)
    if (Math.random() < 0.6) {
        preferences.maxDistanceKm = Math.floor(Math.random() * 46) + 5;
    }
    
    // Random causes (1-3)
    if (Math.random() < 0.7) {
        const numCauses = Math.floor(Math.random() * 3) + 1;
        const causes: Cause[] = [];
        const availableCauses = [...ALL_CAUSES];
        for (let i = 0; i < numCauses && availableCauses.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableCauses.length);
            causes.push(availableCauses.splice(randomIndex, 1)[0]);
        }
        preferences.causes = causes;
    }
    
    return Object.keys(preferences).length > 0 ? preferences : undefined;
}

function randomAge(): number | undefined {
    if (Math.random() < 0.5) {
        return undefined; // 50% chance of no age
    }
    // Age distribution: mostly adults, some seniors, fewer young adults
    const rand = Math.random();
    if (rand < 0.1) {
        return Math.floor(Math.random() * 5) + 16; // 16-20 (10%)
    } else if (rand < 0.6) {
        return Math.floor(Math.random() * 30) + 21; // 21-50 (50%)
    } else if (rand < 0.9) {
        return Math.floor(Math.random() * 20) + 51; // 51-70 (30%)
    } else {
        return Math.floor(Math.random() * 15) + 71; // 71-85 (10%)
    }
}

function randomGender(): 'male' | 'female' | undefined {
    if (Math.random() < 0.5) {
        return undefined; // 50% chance of no gender specified
    }
    return Math.random() < 0.5 ? 'male' : 'female';
}

function randomLanguages(): ISO639Language[] | undefined {
    if (Math.random() < 0.5) {
        return undefined; // 50% chance of no languages specified
    }
    
    const numLanguages = Math.floor(Math.random() * 2) + 1; // 1-2 languages
    const languages: ISO639Language[] = [];
    const availableLanguages = [...ALL_LANGUAGES];
    
    // English is most common
    if (Math.random() < 0.9) {
        languages.push('en');
        availableLanguages.splice(availableLanguages.indexOf('en'), 1);
    }
    
    // Add additional languages if needed
    for (let i = languages.length; i < numLanguages && availableLanguages.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableLanguages.length);
        languages.push(availableLanguages.splice(randomIndex, 1)[0]);
    }
    
    return languages.length > 0 ? languages : undefined;
}
