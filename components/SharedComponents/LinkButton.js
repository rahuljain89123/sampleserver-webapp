
import React from 'react'
import { Button } from 'reactstrap'

const LinkButton = (props, context) => {
    const onClick = (
        props.href &&
        context &&
        context.router &&
        context.router.push
    ) ? e => {
        e.preventDefault()
        context.router.push(props.href)
    } : null

    return (
        <Button onClick={onClick} {...props}>{props.children}</Button>
    )
}


LinkButton.contextTypes = {
    router: React.PropTypes.shape({
        push: React.PropTypes.func,
    }),
}

export default LinkButton
