import { createBrowserRouter } from 'react-router-dom';
import Layout from '../share/components/Layout';
import Home from './home/Home';
import Note from './note/Note';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/note/:noteId', element: <Note /> },
    ],
  },
]);

export default router;
