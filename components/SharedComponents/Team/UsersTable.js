import {
  Table,
  Badge,
} from 'reactstrap'

export default (props) => {
  const { users } = props
  if (!users.size) { return null }

  const usersRows = users.map(([id, user]) => (
    <tr key={id}>
      <td>{user.get('name') || '-'}</td>
      <td>{user.get('email')}</td>
      <td>{user.get('active') ? (
        <div><div className="status-circle success" /> Active</div>
      ) : (
        <div><div className="status-circle warning" /> Pending</div>
      )}</td>
    </tr>)
  )

  return (
    <Table size="sm" className="users-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {usersRows}
      </tbody>
    </Table>
  )
}
