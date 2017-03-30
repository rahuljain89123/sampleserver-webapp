
import React from 'react'
import { ListGroup, ListGroupItem } from 'reactstrap'


const FilterList = (props, context) => (
    <ListGroup>
        {props.items.map(([id, item]) => (
            <ListGroupItem key={id}>
                <a
                    href={props.href(item)}
                    onClick={e => {
                        e.preventDefault()
                        context.router.push(e.target.getAttribute('href'))
                    }}
                >
                    {props.title(item)}
                </a>
            </ListGroupItem>
        ))}
    </ListGroup>
)

FilterList.contextTypes = {
    router: React.PropTypes.shape({
        push: React.PropTypes.func,
    }),
}

export default FilterList
