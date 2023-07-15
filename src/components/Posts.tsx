import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPost, editPostById, getPostById, getPosts } from "../api/route";
import { Fragment, useState } from "react";

const initialValue: Post = {
  id: Date.now(),
  userId: Date.now(),
  title: "",
  body: "",
};

export default function Posts(): React.JSX.Element {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState(initialValue);
  const [newAddedPost, setNewAddedPost] = useState<Post>();
  const { isLoading, data, isError } = useQuery(["posts"], getPosts);

  const handleEdit = (id: number) => {
    getPostById(id)
      .then((post) => {
        setNewPost(post);
      })
      .catch((err) => console.log(err));
  };

  const createMutation = useMutation(createPost, {
    onSuccess: (res) => {
      setNewAddedPost(res);
      queryClient.invalidateQueries(["posts"]).catch((err) => console.log(err));
    },
  });

  const editMutation = useMutation(
    (variables: Post) => editPostById(variables.id, variables),
    {
      onSuccess: (res) => {
        setNewAddedPost(res);
        queryClient
          .invalidateQueries(["posts"])
          .catch((err) => console.log(err));
      },
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEdit) {
      editMutation.mutate(newPost);
      setIsEdit(false);
    } else {
      createMutation.mutate(newPost);
    }
    setNewPost(initialValue);
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit}>
        <input name="title" value={newPost.title} onChange={handleChange} />
        <input name="body" value={newPost.body} onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      {isLoading ? (
        <h2>Loading...</h2>
      ) : isError ? (
        <h2>Can't fetch data</h2>
      ) : (
        data.slice(0, 10).map((e) => {
          return (
            <h2 key={e.id}>
              {e.title}
              <button
                type="button"
                onClick={() => {
                  handleEdit(e.id);
                  setIsEdit(true);
                }}
              >
                Edit Post
              </button>
            </h2>
          );
        })
      )}
      {newAddedPost ? (
        <section className="flex flex-col gap-2">
          <h2>New Added or Edited Post</h2>
          <p>Title: {newAddedPost.title}</p>
          <p>Body: {newAddedPost.body}</p>
        </section>
      ) : null}
    </Fragment>
  );
}
