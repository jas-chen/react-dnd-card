import React, { cloneElement, Component, PropTypes } from 'react';
import ItemTypes from './ItemTypes';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash.flow';

const cardSource = {
  beginDrag(props) {
    return {
      index: props.index,
      originalIndex: props.index
    };
  },

  endDrag(props, monitor) {
    const { index, originalIndex } = monitor.getItem();
    const didDrop = monitor.didDrop();

    if (!didDrop) {
      props.moveCard(index, originalIndex);
    }
  }
};

const cardTarget = {
  hover(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};

function Card(props) {
  const { children, isDragging, connectDragSource, connectDropTarget, moveCard, ...rest } = props;
  const newCard = cloneElement(children, { isDragging });
  return connectDragSource(connectDropTarget(<div {...rest}>{newCard}</div>));
}

export default flow(
  DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })),
  DropTarget(ItemTypes.CARD, cardTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  }))
)(Card);

Card.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  children: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  moveCard: PropTypes.func.isRequired
}
