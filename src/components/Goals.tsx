import * as React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import SavingsCard from "./SavingsCard";

export interface GoalsProps {
  goals: { id: string; itemGoalCost: number; name: string }[];
  updateGoals: (
    goals: { id: string; itemGoalCost: number; name: string }[]
  ) => void;
}

export interface GoalsState {}

class Goals extends React.Component<GoalsProps, GoalsState> {
  constructor(props: GoalsProps) {
    super(props);
    this.state = {};
    this.handleOnDragEnd = this.handleOnDragEnd.bind(this);
  }

  handleOnDragEnd(result: any) {
    if (!result.destination) return;

    const items = Array.from(this.props.goals);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    this.props.updateGoals(items);
  }

  render() {
    let bankBalance = 350;
    return (
      <DragDropContext onDragEnd={this.handleOnDragEnd}>
        <Droppable droppableId="characters">
          {(provided) => (
            <ul
              className="characters"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {this.props.goals.map(({ id, itemGoalCost, name }, index) => {
                return (
                  <Draggable key={id} draggableId={id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <SavingsCard
                          index={index}
                          bankBalance={bankBalance}
                          id={id}
                          itemGoalCost={itemGoalCost}
                          name={name}
                        />
                      </li>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default Goals;
