import type { Author, Category, Post } from '../api/types.ts'

const timestamps = { createdAt: '2024-01-20T10:00:00.000Z', updatedAt: '2024-01-20T10:00:00.000Z' }

export const authors: Author[] = [
  { id: 'a1', name: 'Grace Doe', profilePicture: 'grace.png', ...timestamps },
  { id: 'a2', name: 'Jack Smith', profilePicture: 'jack.png', ...timestamps },
]

export const categories: Category[] = [
  { id: 'c1', name: 'Technology', postId: 'p1', ...timestamps },
  { id: 'c2', name: 'Science', postId: 'p2', ...timestamps },
]

export const posts: Post[] = [
  {
    id: 'p1',
    title: 'Tech Innovations in Healthcare',
    content: 'Lorem ipsum dolor sit amet.',
    thumbnail_url: 'one.jpg',
    authorId: 'a1',
    author: authors[0],
    categories: [categories[0]],
    ...timestamps,
    createdAt: '2024-03-01T10:00:00.000Z',
  },
  {
    id: 'p2',
    title: 'The Science of Sleep',
    content: 'Consectetur adipiscing elit.',
    thumbnail_url: 'two.jpg',
    authorId: 'a2',
    author: authors[1],
    categories: [categories[1]],
    ...timestamps,
    createdAt: '2024-02-01T10:00:00.000Z',
  },
  {
    id: 'p3',
    title: 'A Walk Through Lisbon',
    content: 'Sed do eiusmod tempor.',
    thumbnail_url: 'three.jpg',
    authorId: 'a1',
    author: authors[0],
    categories: [],
    ...timestamps,
    createdAt: '2024-01-01T10:00:00.000Z',
  },
]
