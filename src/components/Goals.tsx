import * as React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Goal } from "./Editor";
import SavingsCard from "./SavingsCard";

export interface GoalsProps {
  goals: { index: number; id: string; itemGoalCost: number; name: string }[];
  updateGoals: (goals: Goal[]) => void;
  editGoal: (goalID: string) => void;
  deleteGoal: (goalID: string) => void;
  savingsBalance: number;
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
                          editGoal={this.props.editGoal}
                          deleteGoal={this.props.deleteGoal}
                          index={index}
                          bankBalance={this.props.savingsBalance}
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
