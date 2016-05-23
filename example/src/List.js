import React, { Component } from 'react';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import DndCard from 'react-dnd-card';
import { Item, createItem } from './Item';

function get1000Items() {
  const items = [];
  for (let i = 0; i < 20; i++) {
    const item = { id: i, text: `Item ${i}` };
    items.push(item);
  }

  return items;
}

class List extends Component {
  constructor(props) {
    super(props);

    this.state = { items: get1000Items() };
    this.moveCard = this.moveCard.bind(this);
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
            noDropOutside={true}
            endDrag={() => console.log('Drag ends!')}
            style={isDragging => {
              return {
                display: 'inline-block',
                width: '100%',
                background: isDragging ? '#eee' : 'transparent',
                cursor: 'move'
              } ;
            }}
          />
        ))}
      </div>
    );
  }
}

// Use DragDropContext to decorate your List component
export default DragDropContext(HTML5Backend)(List);
