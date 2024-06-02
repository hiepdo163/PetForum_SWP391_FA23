import "./Pagination.css";
import React from "react";
import Pagination from "react-bootstrap/Pagination";

// example
let active = 1;
let items = [];
for (let number = 1; number <= 8; number++) {
  items.push(
    <Pagination.Item key={number} active={number === active}>
      {number}
    </Pagination.Item>
  );
}

export const Pag = () => {
  return (
    // example
    <Pagination>
      <Pagination.First />
      <Pagination.Prev />
      {items}
      <Pagination.Next />
      <Pagination.Last />
    </Pagination>
  );
};

// const PaginatedItems = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [postsPerPage, setPostsPerPage] = useState(10);

// useEffect(() => {
//   const fetchPosts = async () => {
//     setLoading(true);
//     const res = await axios.get('./posts');
//     setPosts(res.data);
//     setLoading(false);
//   }

//   fetchPosts();
// }, []);
// };

export default Pag();
