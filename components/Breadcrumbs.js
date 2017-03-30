
import React from 'react'
import { Breadcrumb, BreadcrumbItem } from 'reactstrap'

import { omit } from '../util'

const Breadcrumbs = (props, context) => {
    const onClick = e => {
        e.preventDefault()
        context.router.push(e.target.getAttribute('href'))
    }

    return (
        <Breadcrumb tag="nav" {...omit(props, ['items'])}>
            {props.items.map(item => (
                item.active ? (
                    <BreadcrumbItem className="active" key={item.title}>
                        {item.title}
                    </BreadcrumbItem>
                ) : (
                    <BreadcrumbItem
                         key={item.title}
                        tag="a"
                        href={item.href}
                        onClick={onClick}
                    >{item.title}</BreadcrumbItem>
                )))}
        </Breadcrumb>
    )
}

Breadcrumbs.contextTypes = {
    router: React.PropTypes.shape({
        push: React.PropTypes.func,
    }),
}

export default Breadcrumbs
