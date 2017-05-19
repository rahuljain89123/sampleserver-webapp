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
        <Badge color="success">Active</Badge>
      ) : (
        <Badge>Pending</Badge>
      )}</td>
    </tr>)
  )

  return (
    <Table size="sm" style={{ marginBottom: 60 }}>
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
