import React, { Component } from 'react';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import DndCard from 'react-dnd-card';
import { Item, createItem } from './Item';

function genItems() {
  const items = [];
  for (let i = 0; i < 500; i++) {
    const item = { id: i, text: `Item ${i}` };
    items.push(item);
  }

  return items;
}

class List extends Component {
  constructor(props) {
    super(props);

    this.state = { items: genItems() };
    this.getItem = this.getItem.bind(this);
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

  getItem(index) {
    return this.state.items[index];
  }

  endDrag() {
    console.log('Drag ends!');
  }

  dragStyle(isDragging) {
    return {
      display: 'inline-block',
      width: '100%',
      background: isDragging ? '#eee' : 'transparent',
      cursor: 'move'
    } ;
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
            source={this.getItem}
            createItem={createItem}
            moveCard={this.moveCard}
            noDropOutside={true}
            endDrag={this.endDrag}
            style={this.dragStyle}
          />
        ))}
      </div>
    );
  }
}

// Use DragDropContext to decorate your List component
export default DragDropContext(HTML5Backend)(List);
