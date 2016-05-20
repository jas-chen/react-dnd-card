# react-dnd-card
Drag and Drop Card component for React

## Why?
[React DnD](https://github.com/gaearon/react-dnd) is too complicated. All I want is building a very simple drag and drop list like [this example](https://gaearon.github.io/react-dnd/examples-sortable-simple.html).

## Feature
Dead simple.

## Install
This project uses react-dnd under the hood, so don't forget to install it.
```
npm install --save react-dnd react-dnd-card
```

## How To Use

Card.js
```javascript
import React, { Component, PropTypes } from 'react';

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move'
};

export default class Card extends Component {
  static propTypes = {
    isDragging: PropTypes.bool.isRequired, // injected by DragDropCard
    text: PropTypes.string.isRequired
  };

  render() {
    const { text, isDragging } = this.props;
    const opacity = isDragging ? 0 : 1;

    return (
      <div style={{ ...style, opacity }}>
        {text}
      </div>
    );
  }
}
```

List.js
```javascript
import React, { Component } from 'react';
import update from 'react/lib/update';
import { DragDropCard, HTML5DragDropContext } from 'react-dnd-card';
import Card from './Card';

class List extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.state = {
      cards: [{
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
    const { cards } = this.state;
    const dragCard = cards[dragIndex];

    this.setState(update(this.state, {
      cards: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard]
        ]
      }
    }));
  }

  render() {
    const { cards } = this.state;

    return (
      <div>
        {cards.map((card, i) => (
          <DragDropCard                 // Use <DragDropCard> to wrap the item component
            key={card.id}                       // recommended
            index={i}                           // required
            moveCard={this.moveCard}            // required
            style={{border: '1px solid red'}}   // rest props will be applied too
          >
            <Card text={card.text} isDragging={false}/>
          </DragDropCard>
        ))}
      </div>
    );
  }
}

// Use HTML5DragDropContext to decorate your List component
export default HTML5DragDropContext(List);
```
