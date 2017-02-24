
import React from 'react'
import {
    Filter,
    FilterItem,
} from '../basecoat/Navigation'


const FilterList = props => (
    <Filter>
        {props.items.map(([id, item]) => (
            <FilterItem key={id} href={props.href(item)}>
                {props.title(item)}
            </FilterItem>
        ))}
    </Filter>
)

export default FilterList
