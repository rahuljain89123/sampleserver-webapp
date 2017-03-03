
import React from 'react'

import { Button, ButtonGroup } from '../basecoat/Button'


class Pagination extends React.Component {
    render () {
        return (
            <ButtonGroup>
                <Button outline disabled>Previous</Button>
                <Button outline selected>1</Button>
                <Button outline>2</Button>
                <Button outline>3</Button>
                <Button outline>Next</Button>
            </ButtonGroup>
        )
    }
}

export default Pagination
