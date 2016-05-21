import React, { Component, PropTypes } from 'react';
import ItemTypes from './ItemTypes';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash.flow';

const cardSource = {
  beginDrag(props) {
    return {
      index: props.index,
      originalIndex: props.index
    };
  },

  endDrag(props, monitor) {
    if (props.noDropOutside) {
      const { index, originalIndex } = monitor.getItem();
      const didDrop = monitor.didDrop();

      if (!didDrop) {
        props.moveCard(index, originalIndex);
      }
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

const propTypes = {
  index: PropTypes.number.isRequired,
  source: PropTypes.any.isRequired,
  createItem: PropTypes.func.isRequired,
  moveCard: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  noDropOutside: PropTypes.bool
};

class DndCard extends Component {
  render() {
    const {
      index,
      source,
      createItem,
      noDropOutside, // remove from restProps
      moveCard,      // remove from restProps

      isDragging,
      connectDragSource,
      connectDropTarget,
      ...restProps
    } = this.props;

    const item = createItem(source, isDragging);
    if (typeof item === 'undefined') {
      console.warn('Warning: createItem returns undefined. It should return a React component or null.');
    }

    return connectDragSource(connectDropTarget(
      <div {...restProps}>
        {createItem(source, isDragging)}
      </div>
    ));
  }
}

DndCard.propTypes = propTypes;

export default flow(
  DropTarget(ItemTypes.DND_CARD, cardTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  })),
  DragSource(ItemTypes.DND_CARD, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }))
)(DndCard);
