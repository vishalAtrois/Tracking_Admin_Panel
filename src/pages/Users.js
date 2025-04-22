import React, { useEffect, useState } from 'react';

const Users = () => {

    const [usersData, setUsersData] = useState([]);

    function fetchUsers (){
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      fetch("http://16.171.60.57:3001/v1/admin/fetchUserList?page=1&limit=10&userType=user", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if(result.success == true){
            console.log(result.UserList);
            setUsersData(result.UserList.results)
          }
        })
        .catch((error) => console.error(error));
    }
  
    // Fetch users and companies data
    useEffect(() => {
      fetchUsers();
    }, []);
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">User List</h2>
      <ul className="space-y-4">
        {
          usersData.map((item,index)=>(
            <li className="p-4 bg-white rounded shadow-md">

              <div>{item.fullName}</div>
              <div>{item.email}</div>
              <div>{item.phoneNumber}</div>
            </li>
          ))
        }
      </ul>
    </div>
  );
};

export default Users;
