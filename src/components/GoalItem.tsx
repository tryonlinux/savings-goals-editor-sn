import * as React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Goal } from "./Editor";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  index: -1,
  id: "",
  itemGoalCost: 0.0,
  name: "",
};
export interface GoalItemProps {
  editMode: boolean;
  goal?: Goal;
  editID?: string;
  handleSubmit: (goals: Goal) => void;
  onCancelAddGoal: () => void;
  updateGoal?: (goal: Goal) => void;
}
export interface GoalItemState {
  index: number;
  id: string;
  itemGoalCost: number;
  name: string;
}

class GoalItem extends React.Component<GoalItemProps, GoalItemState> {
  constructor(props: GoalItemProps) {
    super(props);
    if (this.props.editMode && this.props.goal) {
      let currentGoal: Goal = this.props.goal;
      this.state = {
        id: currentGoal.id,
        itemGoalCost: currentGoal.itemGoalCost,
        name: currentGoal.name,
        index: currentGoal.index,
      };
    } else {
      this.state = initialState;
    }
    this.moneyValidation = this.moneyValidation.bind(this);
  }
  /**
   * Validates the goal cost you type in to the goal cost Text Box to make sure it is formatted correctly and converts to an number type
   *
   * @param value - The goal cost you want to save as a string
   * @returns - The value as a number parsed correctly
   *
   */
  moneyValidation(value: string): number {
    return parseFloat(value) || 0;
  }
  render() {
    return (
      <div>
        <Form
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
          }}
        >
          <Row>
            <Col>
              <h3 className="text-center">
                Please Enter Details of the item you would like to save for
              </h3>
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 6, offset: 3 }}>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={this.state.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                    this.setState({
                      name: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 6, offset: 3 }}>
              <Form.Group controlId="itemGoalCost">
                <Form.Label>Cost</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Cost"
                  name="itemGoalCost"
                  value={this.state.itemGoalCost}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                    this.setState({
                      itemGoalCost: this.moneyValidation(e.target.value),
                    })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 1, offset: 3 }}>
              <Button
                variant="success"
                onClick={() => {
                  //TODO bug -> don't allow 0 dollar or blank name
                  this.props.editMode
                    ? this.props.handleSubmit({
                        index: this.state.index,
                        id: this.state.id,
                        name: this.state.name,
                        itemGoalCost: this.state.itemGoalCost,
                      })
                    : this.props.handleSubmit({
                        index: -1,
                        id: this.state.id ? this.state.id : uuidv4(),
                        name: this.state.name,
                        itemGoalCost: this.state.itemGoalCost,
                      });
                }}
              >
                Save
              </Button>
            </Col>
            <Col xs={{ span: 1, offset: 4 }}>
              <Button
                className="float-right"
                onClick={this.props.onCancelAddGoal}
                variant="danger"
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default GoalItem;
