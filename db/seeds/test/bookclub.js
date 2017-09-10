const club = [
  {
    id: 1,
    name: "Ladies in Books",
  }
];

const user = [
  {
    id: 1,
    email: "travis@email.com",
    club_id: 1,
  },
  {
    id: 2,
    email: "lindsay@email.com",
    club_id: 1,
  }
];

const book = [
  {
    id: 1,
    title: "Fantasy Book",
    author: "Weird Guy",
    ISBN: "12345",
    description: "It's an ok book",
    image: "http://image.com",
    upvotes: "5",
    downvotes: "2",
    status: "reading",
    user_id: 1,
  },
  {
    id: 2,
    title: "Historic Book",
    author: "Smart Gal",
    ISBN: "67890",
    description: "It's an informative book",
    image: "http://image.com",
    upvotes: "3",
    downvotes: "2",
    status: "completed",
    user_id: 2,
  }
];

const vote = [
  {
    id: 1,
    direction: "up",
    user_id: 1,
    book_id:1,
  },
  {
    id: 2,
    direction: "down",
    user_id: 2,
    book_id: 2,
  }
];
