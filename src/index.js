import React, { Component, PropTypes } from 'react';
import ItemTypes from './ItemTypes';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash.flow';

function isNullOrUndefined(o) {
  return o == null;
}

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
      originalIndex: props.index
    };
  },

  endDrag(props, monitor) {
    if (props.noDropOutside) {
      const { id, index, originalIndex } = monitor.getItem();
      const didDrop = monitor.didDrop();

      if (!didDrop) {
        props.moveCard(isNullOrUndefined(id) ? index : id, originalIndex);
      }
    }

    if (props.endDrag) {
      props.endDrag();
    }
  }
};

const cardTarget = {
  hover(props, monitor) {
    const { id: dragId, index: dragIndex } = monitor.getItem();
    const { id: hoverId, index: hoverIndex } = props;

    if (!isNullOrUndefined(dragId)) {
      // use id
      if (dragId !== hoverId) {
        props.moveCard(dragId, hoverIndex);
      }
    } else {
      // use index
      if (dragIndex !== hoverIndex) {
        props.moveCard(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
      }
    }
  }
};

const propTypes = {
  index: PropTypes.number.isRequired,
  source: PropTypes.any.isRequired,
  createItem: PropTypes.func.isRequired,
  moveCard: PropTypes.func.isRequired,
  endDrag: PropTypes.func,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  noDropOutside: PropTypes.bool
};

class DndCard extends Component {
  render() {
    const {
      id,
      index,
      source,
      createItem,
      noDropOutside, // remove from restProps
      moveCard,      // remove from restProps
      endDrag,       // remove from restProps

      isDragging,
      connectDragSource,
      connectDropTarget,
      ...restProps
    } = this.props;

    if (id === null) {
      console.warn('Warning: `id` is null. Set to undefined to get better performance.');
    }
    
    const item = createItem(source, isDragging, index);
    if (typeof item === 'undefined') {
      console.warn('Warning: `createItem` returns undefined. It should return a React element or null.');
    }

    const finalProps = Object.keys(restProps).reduce((result, k) => {
      const prop = restProps[k];
      result[k] = typeof prop === 'function' ? prop(isDragging) : prop;
      return result;
    }, {});

    return connectDragSource(connectDropTarget(
      <div {...finalProps}>
        {item}
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
