import React, { Component, PropTypes } from 'react';

const style = {
  color: 'gray',
  border: '1px dashed gray',
  padding: '.5em 1em',
  marginTop: '.25em',
  marginBottom: '.25em'
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
