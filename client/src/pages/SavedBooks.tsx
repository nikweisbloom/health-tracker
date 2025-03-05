// import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
// import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
// import { getMe, deleteBook } from '../utils/API';
// import { deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { useQuery, useMutation } from "@apollo/client";
import { REMOVE_BOOK } from '../utils/mutations';
import { GET_ME } from "../utils/queries";

interface Book {
  bookId: string;
  image?: string;
  title: string;
  authors: string[];
  description: string;
}

const SavedBooks = () => {
  // Fetch user data using Apollo's useQuery hook
  const { loading, data } = useQuery(GET_ME);
  const userData = data?.me || { savedBooks: [] }; // Default to empty array if no data

  // Apollo mutation hook for removing books
  const [removeBook] = useMutation(REMOVE_BOOK, {
    update(cache, { data: { removeBook } }) {
      cache.modify({
        fields: {
          me(existingUserData = {}) {
            return {
              ...existingUserData,
              savedBooks: existingUserData.savedBooks.filter(
                (book: { bookId: string }) => book.bookId !== removeBook.bookId
              ),
            };
          },
        },
      });
    },
  });

  // Create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // Call the Apollo mutation instead of the REST API function
      const { data } = await removeBook({
        variables: { bookId },
      });

      if (!data) {
        throw new Error('Something went wrong!');
      }

      // Remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // If data isn't here yet, show a loading message
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          <h1>{userData.username ? `Viewing ${userData.username}'s saved books!` : 'Viewing saved books!'}</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {/* {userData.savedBooks.map((book: { bookId: Key | null | undefined; image: string | undefined; title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; authors: any[]; description: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => { */}
          {userData.savedBooks.map((book: Book) => {
            return (
              <Col md='4' key={book.bookId}>
                <Card border='dark'>
                  {book.image && (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors.join(", ")}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;