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

#### `id` (optional)
The unique id of the `<DndCard>` element. This will turn the [`id mode`](#id-mode) on.

##### `source` (required)
Could be anything. It will be passed to `createItem` (see below).

##### `createItem(source, isDragging, index)` (required)
A function that creates and returns your item element.

##### `moveCard(dragIndex/dragId, hoverIndex)` (required)
A function to handle the movement. The first argument is `dragIndex` by default, and it will be `dragId` in the [`id mode`](#id-mode).

##### `endDrag` (optional)
A function to be called when drag ends.

##### `noDropOutside` (optional)
Disabled by default. Set to `true` to revert the drag operation if the card was dropped outside its container. You can compare [the enabled demo](http://gaearon.github.io/react-dnd/examples-sortable-cancel-on-drop-outside.html) and [the disabled demo](http://gaearon.github.io/react-dnd/examples-sortable-simple.html) to tell the difference.

##### Other props (optional)
Since `<DndCard>` wraps your item component with a `<div>` element, you might want to apply some props (eg. `style`) on that `<div>`.

If a prop's value is a function, it'll be invoke with `isDragging` and the result will be used as the prop value.

> **Important:** Margin spaces between `<DndCard>` is **undroppable** when `noDropOutside` is set to `true`. If a user dropped `<DndCard>` on margin spaces, the operation will be reverted, this usually brings poor UX. So it is recommended not to set margin between `<DndCard>` when `noDropOutside` is set to `true`.

## Performance Gotcha
Don't pass objects into `<DndCard>`, pass functions instead! And make sure you don't create function in props too.

```javascript
// Do
<DndCard source={this.getItem} ... />
// Don't
<DndCard source={item} ... />


// Do
<DndCard style={this.dragStyle} ... />
// Don't
<DndCard style={(isDragging) => {
  return {
    background: isDragging ? '#eee' : 'transparent'
  } ;
}} ... />
```

Try [example](https://github.com/jas-chen/react-dnd-card/tree/master/example), it handles 500 items and still performances well.

## ID Mode
Still not smooth enough? Pass `id` into `<DndCard>` to turn the `id mode` on! It lets you handle the movement using [`requestAnimationFrame()`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).

Try [example](https://github.com/jas-chen/react-dnd-card/tree/master/example), set `ID_MODE` to `true` and see how it handles 1000 items and still performances well.

## Build This Project
```
npm install
npm build
```

## Change Log
This project adheres to [Semantic Versioning](http://semver.org/).

### v0.3.6
[c87a388](https://github.com/jas-chen/react-dnd-card/commit/c87a3889759183c1e4d1a70a0cbdf40b1bc38d18) Pass index to createItem().

### v0.3.5
[d7f394e](https://github.com/jas-chen/react-dnd-card/commit/d7f394e816258bd93fcb78c4284b4007be9e51a8) Add endDrag callback.

### v0.3.4
[8745b1c](https://github.com/jas-chen/react-dnd-card/commit/8745b1c97be6b8f3111c5a191131066cf63609dd) Fix peerDependencies and devDependencies.

### v0.3.3
[9f88e15](https://github.com/jas-chen/react-dnd-card/commit/9f88e157dbf5796eaa91c037cf5a9f3d8b8cfce7) Remove inline source map.

### v0.3.2
[098d479](https://github.com/jas-chen/react-dnd-card/commit/098d47920e8715c5b47b2f4a78f4cc9d36c28353) Invoke prop's value if it is a function.

### v0.3.1
[b0cba4c](https://github.com/jas-chen/react-dnd-card/commit/b0cba4c73b6d26fe834045d135dcc0a0123f47aa) Check return value of `createItem()`.

### v0.3.0
[35b147b](https://github.com/jas-chen/react-dnd-card/commit/35b147b8086b090d4cfc9899a21c9f4f14ea8544) Completely rewrite to solve the performance issue.

## License
The MIT License (MIT).
