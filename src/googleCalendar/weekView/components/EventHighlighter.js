import React, { Component } from 'react';
import moment from 'moment';
import AddEventModal from './AddEventModal';
import { generateWeekViewCoordinates } from '../../utils';
import { eventHighlighter } from '../styles';

class EventHighlighter extends Component {
  state = {
    showEditEventModal: false,
    eventNewStart: null,
    eventNewEnd: null,
  };

  handleDragStart = (event) => {
    event.dataTransfer.setData('text/plain', JSON.stringify(this.props.event));
  }

  handleDragOver = (event) => {
    event.preventDefault();
  }

  handleDrop = (event) => {
    event.preventDefault();
    const droppedEvent = JSON.parse(event.dataTransfer.getData('text/plain'));
    this.openEditEventModal()
    this.updateEvent(droppedEvent.title);
    if (droppedEvent.id !== this.props.event.id) {
      // Delete the dragged event
      this.props.onEventDelete(droppedEvent.id);
    }
  }
openEditEventModal = () => {
    this.setState({
      showEditEventModal: true,
      eventNewStart: this.props.event.start,
      eventNewEnd: this.props.event.end,
    });
    this.state = {
      showEditEventModal: true,
      eventNewStart: this.props.event.start,
      eventNewEnd: this.props.event.end,
    };
  };

  deleteEvent = () => {
    this.props.onEventDelete(this.props.event.id);
    this.setState({
      showEditEventModal: false,
    });
  };

  updateEvent = title => {
    this.props.onEventUpdate(this.props.event.id, {
      title,
      start: this.state.eventNewStart,
      end: this.state.eventNewEnd,
    });
    this.setState({
      showEditEventModal: false,
    });
  };

  onCurrentEventTimeChange = dates => {
    this.setState({
      eventNewStart: +dates[0],
      eventNewEnd: +dates[1],
    });
  };

  closeModal = () => {
    this.setState({
      showEditEventModal: false,
    });
  };

  render() {
    const { showEditEventModal, eventNewStart, eventNewEnd } = this.state;
    const { event, startDate } = this.props;
    return (
      <React.Fragment>
        <AddEventModal
          editMode={true}
          eventTitle={event.title}
          visible={showEditEventModal}
          onCancel={this.deleteEvent}
          onClose={this.closeModal}
          onOk={this.updateEvent}
          eventStart={eventNewStart}
          eventEnd={eventNewEnd}
          onTimeChange={this.onCurrentEventTimeChange}
        />
        <div
          draggable
          onDragStart={this.handleDragStart}
          onDragOver={this.handleDragOver}
          onDrop={this.handleDrop}
          onClick={this.openEditEventModal}
          style={{
            ...generateWeekViewCoordinates(event, startDate),
            ...eventHighlighter,
            backgroundColor: this.props.isBooked ? getRandomColor() : "transparent" ,
          }}
        >
          {event.title} <br />
          <span style={{ fontSize: 10 }}>
            {moment(event.start).format('hh:mm a')}
            {' '}
            -
            {' '}
            {moment(event.end).format('hh:mm a')}
          </span>
        </div>
      </React.Fragment>
    );
  }
}

function getRandomColor() {
  // Generate random RGBA color code with 70% opacity
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const opacity = 0.7; // 70% opacity
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export default EventHighlighter;
