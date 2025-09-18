// src/mocks/libraryMock.js
// Mock orders for Library view — aligned with Library.jsx expectations.
// - Mix of subscription (with expireDate) and one-time digital items (downloadable).
// - Product names & types mapped from BabyChub-data PDF. (IDs in comments)
// - You can wire this into services/userServices.getMyOrders() in dev mode.

export const MOCK_PRODUCTS = [
  // --- Courses (subscription-capable) ---
  {
    id: "p1",
    sourceId: 1, // Code Explorers: A Python Adventure for Kids (course) — PDF row #1
    name: "Code Explorers: A Python Adventure for Kids",
    type: "course", // subscription-friendly
  },
  {
    id: "p2",
    sourceId: 3, // Student Robots: Learning AI and Coding Fundamentals (course) — PDF row #3
    name: "Student Robots: Learning AI & Coding Fundamentals",
    type: "course",
  },
  {
    id: "p3",
    sourceId: 4, // Learning Scratch — PDF row #4
    name: "Learning Scratch: Create Your First Game",
    type: "course",
  },

  // --- Applications (subscription-capable) ---
  {
    id: "p4",
    sourceId: 13, // KidVerse — PDF row #13
    name: "KidVerse – A Virtual World for Fun Learning",
    type: "application",
  },
  {
    id: "p5",
    sourceId: 14, // SafeNet Junior — PDF row #14
    name: "SafeNet Junior – A Safe Browser for Kids",
    type: "application",
  },

  // --- Digital one-time (ebooks / audiobook / worksheets) ---
  {
    id: "p6",
    sourceId: 8, // Wonders of Shapes — PDF row #8
    name: "Wonders of Shapes: The Adventures of the Mischievous Square",
    type: "ebook",
  },
  {
    id: "p7",
    sourceId: 9, // Detective Sapling — PDF row #9
    name: "Detective Sapling and the Case of the Missing Letters",
    type: "ebook",
  },
  {
    id: "p8",
    sourceId: 11, // Legend of the Twin Stars — PDF row #11
    name: "Legend of the Twin Stars: An Epic Journey Across the Galaxy",
    type: "ebook",
  },
  {
    id: "p9",
    sourceId: 20, // Little Kitty's Bedtime Story — PDF row #20
    name: "Little Kitty's Bedtime Story",
    type: "audiobook",
  },
  {
    id: "p10",
    sourceId: 23, // Fun Dinosaur Activity Worksheet Set — PDF row #23
    name: "Fun Dinosaur Activity Worksheet Set",
    type: "worksheets",
  },
];

// Helper to build ISO dates relative to now
const daysFromNow = (d) => {
  const t = new Date();
  t.setDate(t.getDate() + d);
  return t.toISOString();
};

// NOTE on fields Library.jsx cares about (per rows mapping):
// - id: unique per item (we use short ids like i1, i2... but Library.jsx builds row.id as `${orderId}:${itemId}`)
// - productId, name, type
// - expireDate (null for one-time purchases)
// - progress (0..100 for subscriptions/apps/courses)
// - accessUrl (for course/app), downloadUrl + downloadable (for digital one-time)

export const MOCK_ORDERS = [
  {
    id: "1001",
    date: daysFromNow(-40),
    status: "paid",
    total: 79.0,
    items: [
      // 1) Course — ACTIVE (far future), progress 42%
      {
        id: "i1",
        productId: "p1",
        name: "Code Explorers: A Python Adventure for Kids",
        type: "course",
        expireDate: daysFromNow(60), // active
        progress: 42,
        accessUrl: "/library/reader/p1",
        downloadable: false,
        downloadUrl: null,
      },

      // 2) Ebook — ONE-TIME (download ready)
      {
        id: "i2",
        productId: "p6",
        name: "Wonders of Shapes: The Adventures of the Mischievous Square",
        type: "ebook",
        expireDate: null, // one-time
        progress: null,
        accessUrl: null,
        downloadable: true,
        downloadUrl: "https://files.example.com/wonders-of-shapes.pdf",
      },

      // 3) Application — ACTIVE but expiring soon (within 7 days -> danger highlight)
      {
        id: "i3",
        productId: "p4",
        name: "KidVerse – A Virtual World for Fun Learning",
        type: "application",
        expireDate: daysFromNow(3), // active but soon to expire
        progress: 10,
        accessUrl: "https://app.example.com/kidverse",
        downloadable: false,
        downloadUrl: null,
      },

      // 4) Worksheets — ONE-TIME (download NOT ready -> disabled)
      {
        id: "i4",
        productId: "p10",
        name: "Fun Dinosaur Activity Worksheet Set",
        type: "worksheets",
        expireDate: null,
        progress: null,
        accessUrl: null,
        downloadable: true,
        downloadUrl: "#", // will be disabled by Library.jsx
      },
    ],
    billingAddress: {
      line1: "221B Baker Street",
      city: "London",
      state: "",
      postalCode: "NW1",
      country: "UK",
    },
  },

  {
    id: "1002",
    date: daysFromNow(-10),
    status: "paid",
    total: 129.0,
    items: [
      // 5) Course — EXPIRED (CTA should flip to Renew)
      {
        id: "i5",
        productId: "p3",
        name: "Learning Scratch: Create Your First Game",
        type: "course",
        expireDate: daysFromNow(-2), // expired
        progress: 100,
        accessUrl: "/library/reader/p3",
        downloadable: false,
        downloadUrl: null,
      },

      // 6) Application — EXPIRED
      {
        id: "i6",
        productId: "p5",
        name: "SafeNet Junior – A Safe Browser for Kids",
        type: "application",
        expireDate: daysFromNow(-15), // expired
        progress: 65,
        accessUrl: "https://app.example.com/safenet-junior",
        downloadable: false,
        downloadUrl: null,
      },

      // 7) Course — ACTIVE (long term)
      {
        id: "i7",
        productId: "p2",
        name: "Student Robots: Learning AI & Coding Fundamentals",
        type: "course",
        expireDate: daysFromNow(120), // active
        progress: 5,
        accessUrl: "/library/reader/p2",
        downloadable: false,
        downloadUrl: null,
      },

      // 8) Ebook — ONE-TIME (download ready)
      {
        id: "i8",
        productId: "p7",
        name: "Detective Sapling and the Case of the Missing Letters",
        type: "ebook",
        expireDate: null,
        progress: null,
        accessUrl: null,
        downloadable: true,
        downloadUrl: "https://files.example.com/detective-sapling.pdf",
      },

      // 9) Ebook — ONE-TIME (download ready)
      {
        id: "i9",
        productId: "p8",
        name: "Legend of the Twin Stars: An Epic Journey Across the Galaxy",
        type: "ebook",
        expireDate: null,
        progress: null,
        accessUrl: null,
        downloadable: true,
        downloadUrl: "https://files.example.com/legend-of-the-twin-stars.pdf",
      },

      // 10) Audiobook — ONE-TIME (download NOT ready -> disabled)
      {
        id: "i10",
        productId: "p9",
        name: "Little Kitty's Bedtime Story",
        type: "audiobook",
        expireDate: null,
        progress: null,
        accessUrl: null,
        downloadable: true,
        downloadUrl: "#",
      },
    ],
    billingAddress: {
      line1: "123 Maple Ave",
      city: "Springfield",
      state: "IL",
      postalCode: "62704",
      country: "US",
    },
  },
];

// Optional: convenience export if you want a single function
export function getMockOrders() {
  return MOCK_ORDERS;
}
