import React, { useEffect, useState } from 'react';

export const Report = () => {
  const [users, setUsers] = useState([]);
  const [reportsMap, setReportsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentPage = 1;
  const limit = 10;

  const fetchReportsForUser = async (userId, token) => {
    try {
      const res = await fetch(
        `https://tracking-backend-admin.vercel.app/v1/admin/getReportsByUser?userId=${userId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();
      console.log(`✅ Reports for user ${userId}:`, result);
      return result.success ? result.data || [] : [];
    } catch (err) {
      console.error('Error fetching reports for user:', userId, err);
      return [];
    }
  };

  const fetchAll = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `https://tracking-backend-admin.vercel.app/v1/admin/fetchUserList?page=${currentPage}&limit=${limit}&sortBy=createdAt:desc`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await res.json();
      console.log('✅ Users fetched:', result);
      if (result.success) {
        const fetchedUsers = result.data || [];
        setUsers(fetchedUsers);

        // Fetch reports for all users
        const reportsObj = {};
        await Promise.all(
          fetchedUsers.map(async (user) => {
            const reports = await fetchReportsForUser(user._id, token);
            reportsObj[user._id] = reports;
          })
        );
        setReportsMap(reportsObj);
      } else {
        setError(result.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">User Reports</h2>

      {loading && <p className="text-gray-500">Loading users and reports...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && users.length === 0 && (
        <p className="text-gray-500">No users found.</p>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="space-y-6">
          {users.map((user, idx) => (
            <div
              key={user._id}
              className="bg-white p-4 rounded shadow-md border border-gray-200"
            >
              <div className="mb-2">
                <span className="font-semibold text-lg">
                  {idx + 1}. {user.fullName || 'Unnamed User'}
                </span>
                <div className="text-sm text-gray-600">{user.email}</div>
                <div className="text-sm text-gray-600">{user.phoneNumber}</div>
              </div>

              <div className="mt-2">
                <h4 className="font-medium mb-1">Reports:</h4>
                {reportsMap[user._id] && reportsMap[user._id].length > 0 ? (
                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                    {reportsMap[user._id].map((report, rIdx) => (
                      <li key={rIdx}>
                        <span className="font-semibold">{report.title || 'Untitled'}:</span>{' '}
                        {report.description || 'No description'} <br />
                        <span className="text-gray-500 text-xs">
                          {new Date(report.createdAt).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No reports available.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
