import React, { Component } from 'react';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import DndCard from 'react-dnd-card';
import { Item, createItem } from './Item';

// set to `true` to use requestAnimationFrame to handle 1000 items.
const ID_MODE = true;

function genItems() {
  const items = [];
  const total = ID_MODE ? 1000 : 500;

  for (let i = 0; i < total; i++) {
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
    this.moveCardByIndex = this.moveCardByIndex.bind(this);
    this.moveCardById = this.moveCardById.bind(this);
    this.drawFrame = this.drawFrame.bind(this);
  }

  moveCardByIndex(dragIndex, hoverIndex) {
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

  moveCardById(dragId, hoverIndex) {
    const { items } = this.state;
    const dragItem = items.find(item => item.id === dragId);
    const dragIndex = items.indexOf(dragItem);

    this.scheduleUpdate({
      items: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragItem]
        ]
      }
    });
  }

  scheduleUpdate(updateFn) {
    this.pendingUpdateFn = updateFn;

    if (!this.requestedFrame) {
      this.requestedFrame = requestAnimationFrame(this.drawFrame);
    }
  }

  drawFrame() {
    const nextState = update(this.state, this.pendingUpdateFn);
    this.setState(nextState);

    this.pendingUpdateFn = null;
    this.requestedFrame = null;
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
            id={ID_MODE ? item.id : undefined}
            index={index}
            source={this.getItem}
            createItem={createItem}
            moveCard={ID_MODE ? this.moveCardById : this.moveCardByIndex}
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
