//todo sprinkle comments
//todo code cleanup
import { PlusCircleIcon } from "@primer/octicons-react";
import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { EditorKit, EditorKitDelegate } from "sn-editor-kit";
import Balance from "./Balance";
import GoalItem from "./GoalItem";
import Goals from "./Goals";
export enum HtmlElementId {
  snComponent = "sn-component",
  textarea = "textarea",
}

export enum HtmlClassName {
  snComponent = "sn-component",
  textarea = "sk-input contrast textarea",
}
export interface Goal {
  index: number;
  id: string;
  itemGoalCost: number;
  name: string;
}

export interface EditorInterface {
  printUrl: boolean;
  text: string;
  goals: Goal[];
  savingsBalance: number;
  addGoal: boolean;
  editGoal: boolean;
  loaded: boolean;
  editGoalID?: string;
}
//todo update this block of code to set the correct initalstate after reading from editorkit
const initialState = {
  printUrl: false,
  text: "",
  goals: [
    { index: 1, id: "1", itemGoalCost: 200, name: "Apple Watch" },
    { index: 2, id: "2", itemGoalCost: 1200, name: "Macbook" },
    { index: 0, id: "3", itemGoalCost: 45000, name: "Tesla" },
    { index: 3, id: "4", itemGoalCost: 65000, name: "Addition" },
  ],
  addGoal: false,
  editGoal: false,
  savingsBalance: 30.0,
  loaded: true,
};

let keyMap = new Map();

export default class Editor extends React.Component<{}, EditorInterface> {
  editorKit: any;

  constructor(props: EditorInterface) {
    super(props);
    this.configureEditorKit();
    this.state = initialState;
    this.updateGoals = this.updateGoals.bind(this);
    this.updateSavingsBalance = this.updateSavingsBalance.bind(this);
    this.onAddGoal = this.onAddGoal.bind(this);
    this.onCancelAddGoal = this.onCancelAddGoal.bind(this);
    this.updateIndexes = this.updateIndexes.bind(this);
    this.handleSubmitOfGoal = this.handleSubmitOfGoal.bind(this);
    this.editGoal = this.editGoal.bind(this);
    this.deleteGoal = this.deleteGoal.bind(this);
  }
  //TODO read goals from editorkit
  configureEditorKit = () => {
    let delegate = new EditorKitDelegate({
      /** This loads every time a different note is loaded */
      setEditorRawText: (text: string) => {
        this.setState({
          ...initialState,
          text,
        });
      },
      clearUndoHistory: () => {},
      getElementsBySelector: () => [],
    });

    this.editorKit = new EditorKit({
      delegate: delegate,
      mode: "plaintext",
      supportsFilesafe: false,
    });
  };

  handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = event.target;
    const value = target.value;
    this.saveText(value);
  };

  saveText = (text: string) => {
    this.saveNote(text);
    this.setState({
      text: text,
    });
  };

  saveNote = (text: string) => {
    /** This will work in an SN context, but breaks the standalone editor,
     * so we need to catch the error
     */
    try {
      this.editorKit.onEditorValueChanged(text);
    } catch (error) {
      console.log("Error saving note:", error);
    }
  };

  onBlur = (e: React.FocusEvent) => {};

  onFocus = (e: React.FocusEvent) => {};

  onKeyDown = (e: React.KeyboardEvent | KeyboardEvent) => {
    keyMap.set(e.key, true);
    // Do nothing if 'Control' and 's' are pressed
    if (keyMap.get("Control") && keyMap.get("s")) {
      e.preventDefault();
    }
  };

  onKeyUp = (e: React.KeyboardEvent | KeyboardEvent) => {
    keyMap.delete(e.key);
  };

  updateGoals(
    goals: { index: number; id: string; itemGoalCost: number; name: string }[]
  ) {
    this.setState(
      {
        goals,
      },
      () => {
        this.updateIndexes();
      }
    );
  }
  updateIndexes() {
    let updateGoals = this.state.goals.map((goalItem, index) => {
      goalItem.index = index;
      return goalItem;
    });
    this.setState({ goals: updateGoals });
  }
  updateSavingsBalance(savingsBalance: number): void {
    this.setState({
      savingsBalance,
    });
  }

  onAddGoal() {
    this.setState({
      addGoal: true,
      editGoal: false,
    });
  }

  onCancelAddGoal = () => {
    this.setState({
      addGoal: false,
      editGoal: false,
      // editID: "",
    });
  };
  //change me to check out edit mode
  handleSubmitOfGoal(goal: Goal): void {
    if (this.state.editGoal) {
      //Todo write this code to update a goal
    } else {
      this.setState(
        { goals: [...this.state.goals, goal], addGoal: false, editGoal: false },
        () => {
          this.updateIndexes();
        }
      );
    }
    //TODO save goals to editor
  }
  editGoal(goalID: string) {
    this.setState({
      addGoal: false,
      editGoal: true,
      editGoalID: goalID,
    });
  }
  deleteGoal(goalID: string) {
    //todo write code to delete a goal
    alert(goalID);
  }

  render() {
    const { text } = this.state;
    return (
      <div
        className={
          HtmlElementId.snComponent + (this.state.printUrl ? " print-url" : "")
        }
        id={HtmlElementId.snComponent}
        tabIndex={0}
      >
        <Container fluid>
          <div id="header">
            <Row>
              <Col>
                <Button onClick={this.onAddGoal} variant="dark">
                  <PlusCircleIcon size={16} />
                </Button>
              </Col>
            </Row>
          </div>

          {this.state.loaded ? (
            this.state.addGoal ? (
              <GoalItem
                onCancelAddGoal={this.onCancelAddGoal}
                handleSubmit={this.handleSubmitOfGoal}
                editMode={false}
              />
            ) : this.state.editGoal ? (
              <GoalItem
                onCancelAddGoal={this.onCancelAddGoal}
                handleSubmit={this.handleSubmitOfGoal}
                goal={this.state.goals.find(
                  (goal) => goal.id === this.state.editGoalID
                )}
                editMode={true}
              />
            ) : (
              <div>
                <Balance
                  savingsBalance={this.state.savingsBalance}
                  updateSavingsBalance={this.updateSavingsBalance}
                />
                <Row>
                  <Col>
                    <Goals
                      goals={this.state.goals}
                      updateGoals={this.updateGoals}
                      savingsBalance={this.state.savingsBalance}
                      editGoal={this.editGoal}
                      deleteGoal={this.deleteGoal}
                    />
                  </Col>
                </Row>
              </div>
            )
          ) : (
            <div>Loading...</div>
          )}
        </Container>
      </div>
    );
  }
}
