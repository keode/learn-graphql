import React, {useEffect, useState, Fragment} from "react";
import {useMutation, useSubscription, gql} from "@apollo/client";

import OnlineUser from "./OnlineUser";

const OnlineUsersWrapper = () => {
  const [onlineIndicator, setOnlineIndicator] = useState(0);
  let onlineUsersList;
  
  useEffect( ()=>{
    debugger;
    updateLastSeen();
    setOnlineIndicator(
      setInterval(()=> updateLastSeen, 20000)
    );

    return() =>{
      clearInterval(onlineIndicator);
    };
  }
  , []);
debugger;
  const UPDATE_LASTSEEN_MUTATION = gql`
  mutation updateLastSeen($now: timestamptz!) {
    update_users(where: {}, _set: {last_seen: $now}) {
      affected_rows
      returning {
        name
        id
      }
    }
  }
  `;

  const [updateLastSeenMutation] = useMutation(UPDATE_LASTSEEN_MUTATION);


  function updateLastSeen()
{
      debugger;
    const {data} = updateLastSeenMutation(
      {variables: {now: new Date().toISOString()}}
    );
    console.log(JSON.stringify(data));

}
  // const updateLastSeen = () => {
  //   debugger;
  //   const {data} = updateLastSeenMutation(
  //     {variables: {now: new Date().toISOString()}}
  //   );
  //   console.log(JSON.stringify(data));
  // };

  const { loading, error, data } = useSubscription(
    gql`
      subscription getOnlineUsers {
        online_users(order_by: { user: { name: asc } }) {
          id
          user {
            name
          }
        }
      }
    `
    );



  if (loading) {
    return <span>Loading...</span>;
  }

  if (error) {
    console.error(error);
    return <span>Error!</span>;
  }

  if (data) {
    onlineUsersList = data.online_users.map(u => (
      <OnlineUser key={u.id} user={u.user} />
    ));
  }



  return (
    <div className="onlineUsersWrapper">
      <Fragment>
        <div className="sliderHeader">
          Online users - {onlineUsersList.length}
        </div>
        {onlineUsersList}
      </Fragment>
    </div>
  );
};





export default OnlineUsersWrapper;
