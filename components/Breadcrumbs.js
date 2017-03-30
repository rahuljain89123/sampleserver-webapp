
import React from 'react'
import { Breadcrumb, BreadcrumbItem } from 'reactstrap'

const Breadcrumbs = (props, context) => {
    const onClick = e => {
        e.preventDefault()
        context.router.push(e.target.getAttribute('href'))
    }

    return (
        <Breadcrumb tag="nav" {...props}>
            {props.items.map(item => (
                item.active ? (
                    <BreadcrumbItem className="active">
                        {item.title}
                    </BreadcrumbItem>
                ) : (
                    <BreadcrumbItem
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
