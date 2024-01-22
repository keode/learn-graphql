import React, { useState, Fragment } from "react";
import { gql, useQuery } from "@apollo/client";

import TodoItem from "./TodoItem";
import TodoFilters from "./TodoFilters";

const GET_MY_TODOS = gql`

query getMyTodos {
  todos(where: { is_public: { _eq: false} }, order_by: { created_at: desc }) {
    id
    title
    created_at
    is_completed
}
}`;

const TodoPrivateList = props => {
  const [state, setState] = useState({
    filter: "all",
    clearInProgress: false,
//     todos: [
//       {
//         id: "1",
//         title: "This is private todo 1",
//         is_completed: true,
//         is_public: false
//       },
//       {
//         id: "2",
//         title: "This is private todo 2",
//         is_completed: false,
//         is_public: false
//       }
//     ]
  });

  const filterResults = filter => {
    setState({
      ...state,
      filter: filter
    });
  };

  const clearCompleted = () => {};

  // let filteredTodos = state.todos;
  const {todos} = props;

  let filteredTodos = todos;

  if (state.filter === "active") {
    // filteredTodos = state.todos.filter(todo => todo.is_completed !== true);
    filteredTodos = todos.filter(todo => todo.is_completed !== true);
  } else if (state.filter === "completed") {
    // filteredTodos = state.todos.filter(todo => todo.is_completed === true);
    filteredTodos = todos.filter(todo => todo.is_completed === true);
  }

  const todoList = [];
  filteredTodos.forEach((todo, index) => {
    todoList.push(<TodoItem key={index} index={index} todo={todo} />);
  });

  return (
    <Fragment>
      <div className="todoListWrapper">
        <ul>{todoList}</ul>
      </div>

      <TodoFilters
        todos={filteredTodos}
        currentFilter={state.filter}
        filterResultsFn={filterResults}
        clearCompletedFn={clearCompleted}
        clearInProgress={state.clearInProgress}
      />
    </Fragment>
  );
};

const TodoPrivateListQuery = () => {
  const { loading, error, data } = useQuery(GET_MY_TODOS);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }

  return <TodoPrivateList todos={data.todos} />;
};

// export default TodoPrivateList;
export default TodoPrivateListQuery;
export {GET_MY_TODOS};
