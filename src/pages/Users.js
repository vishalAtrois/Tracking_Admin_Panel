import React, { useEffect, useState } from 'react';

const users = [
  { fullName: 'John Doe', email: 'john.doe@example.com', phoneNumber: '+1 555-1234' },
  { fullName: 'Jane Smith', email: 'jane.smith@example.com', phoneNumber: '+1 555-5678' },
  { fullName: 'Alice Johnson', email: 'alice.johnson@example.com', phoneNumber: '+1 555-8765' },
  { fullName: 'Bob Brown', email: 'bob.brown@example.com', phoneNumber: '+1 555-4321' },
  { fullName: 'Charlie Davis', email: 'charlie.davis@example.com', phoneNumber: '+1 555-6543' },

];


const Users = () => {

    const [usersData, setUsersData] = useState(users);

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
    // useEffect(() => {
    //   fetchUsers();
    // }, []);
  return (
    <div style={{}}>
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
