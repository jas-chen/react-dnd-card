# react-dnd-card
Drag and Drop Card component for React

## What?
This component helps you create a drag and drop list like [this one](https://gaearon.github.io/react-dnd/examples-sortable-simple.html) in a minute.

## What's it look like?

#### Item.js
```javascript
import React, { Component, PropTypes } from 'react';

const style = {
  color: 'gray',
  border: '1px dashed gray',
  padding: '.5em 1em',
  cursor: 'move'
};

const propTypes = {
  isDragging: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired
};

export function Item(props) {
  const { text, isDragging } = props;
  const opacity = isDragging ? 0 : 1;

  return (
    <div style={{ ...style, opacity }}>
      {text}
    </div>
  );
}

Item.propTypes = propTypes;

export function createItem(item, isDragging) {
  return <Item text={item.text} isDragging={isDragging}/>;
}
```

#### List.js
```javascript
import React, { Component } from 'react';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import DndCard from 'react-dnd-card';
import { Item, createItem } from './Item';

class List extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.state = {
      items: [{
        id: 1,
        text: 'Write a cool JS library'
      }, {
        id: 2,
        text: 'Make it generic enough'
      }, {
        id: 3,
        text: 'Write README'
      }, {
        id: 4,
        text: 'Create some examples'
      }, {
        id: 5,
        text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)'
      }, {
        id: 6,
        text: '???'
      }, {
        id: 7,
        text: 'PROFIT'
      }]
    };
  }

  moveCard(dragIndex, hoverIndex) {
    const { items } = this.state;
    const dragItem = items[dragIndex];

    this.setState(update(this.state, {
      items: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragItem]
        ]
      }
    }));
  }

  render() {
    const { items } = this.state;

    return (
      <div>
        <h1>A Drag and Drop List</h1>
        {items.map((item, index) => (
          <DndCard
            key={item.id}
            index={index}
            source={item}
            createItem={createItem}
            moveCard={this.moveCard}
            style={{ marginBottom: '.5em' }}
          />
        ))}
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(List);
```

## Install
You have to install [React DnD](https://github.com/gaearon/react-dnd) and [React DnD backend](http://gaearon.github.io/react-dnd/docs-overview.html#backends) too.
```
npm install --save react-dnd react-dnd-html5-backend react-dnd-card
```

## Api
### `<DndCard>`

#### Props

##### `index` (required)
The index of the `<DndCard>` element.

##### `source` (required)
Could be anything. It will be passed to `createItem` (see below).

##### `createItem(source, isDragging)` (required)
A function that creates and returns your item element.

##### `moveCard(dragIndex, hoverIndex)` (required)
A function to handle the movement.

##### `noDropOutside` (optional)
Disabled by default. Set to `true` to revert the drag operation if the card was dropped outside its container. You can compare [the enabled demo](http://gaearon.github.io/react-dnd/examples-sortable-cancel-on-drop-outside.html) and [the disabled demo](http://gaearon.github.io/react-dnd/examples-sortable-simple.html) to tell the difference.

##### Other props (optional)
Since `<DndCard>` wraps your item component with a `<div>` element, you might want to apply some props (eg. `style`) on that `<div>`.

If a prop's value is a function, it'll be invoke with `isDragging` and the result will be used as the prop value.

> **Important:** Margin spaces between `<DndCard>` is **undroppable** when `noDropOutside` is set to `true`. If a user dropped `<DndCard>` on margin spaces, the operation will be reverted, this usually brings poor UX. So it is recommended not to set margin between `<DndCard>` when `noDropOutside` is set to `true`.

## Build This Project
```
npm install
npm build
```

## License
The MIT License (MIT).
