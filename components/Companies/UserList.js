
import React from 'react'
import { Table, Badge } from 'reactstrap'


const UserList = props => (
    <Table size="sm" style={{ marginTop: 30, marginBottom: 60 }}>
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            {props.users.map(user => {
                return user ? (
                    <tr key={user.get('id')}>
                        <td>{user.get('name') || '-'}</td>
                        <td>{user.get('email')}</td>
                        <td>{user.get('active') ? (
                            <Badge color="success">Active</Badge>
                        ) : (
                            <Badge>Pending</Badge>
                        )}</td>
                    </tr>
                ) : null
            })}
        </tbody>
    </Table>
)

export default UserList
