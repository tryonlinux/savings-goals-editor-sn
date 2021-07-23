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
const initialState = {
  printUrl: false,
  text: "",
  goals: [],
  addGoal: false,
  editGoal: false,
  savingsBalance: 0.0,
  loaded: false,
};

let keyMap = new Map();

export default class Editor extends React.Component<{}, EditorInterface> {
  editorKit: any;

  constructor(props: EditorInterface) {
    super(props);
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
  componentDidMount() {
    this.configureEditorKit();
  }

  configureEditorKit = () => {
    let delegate = new EditorKitDelegate({
      /** This loads every time a different note is loaded */
      setEditorRawText: (text: string) => {
        if (text) {
          let data = JSON.parse(text);
          this.setState({
            goals: data.goals,
            savingsBalance: data.savingsBalance,
            text,
            loaded: true,
          });
        } else {
          this.setState({
            loaded: true,
            text,
          });
        }
      },

      clearUndoHistory: () => {},
      getElementsBySelector: () => [],
      generateCustomPreview: (text: string) => {
        let entries = [];
        try {
          entries = JSON.parse(text);
        } finally {
          // eslint-disable-next-line no-unsafe-finally
          return {
            html: `<div> Balance:$${entries.savingsBalance} <br> Goals: ${entries.goals.length}</div>`,
            plain: `Balance:$${entries.savingsBalance}/Goals: ${entries.goals.length}`,
          };
        }
      },
    });

    this.editorKit = new EditorKit({
      delegate: delegate,
      mode: "plaintext",
      supportsFilesafe: false,
    });
  };
  /**
   * Saves the note by creating a JSON object of goals and current balance.
   *
   */
  saveNote = () => {
    /** This will work in an SN context, but breaks the standalone editor,
     * so we need to catch the error
     */
    try {
      this.editorKit.onEditorValueChanged(
        JSON.stringify({
          goals: this.state.goals,
          savingsBalance: this.state.savingsBalance,
        })
      );
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
  /**
   * Returns the sum of two numbers.
   *
   * @param goals - An array of Goal Objects that consist of the goals you would like to update. This is basically just a wrapper function for setting the state and calling update indexes from children components
   * @returns nothing
   *
   */
  updateGoals(goals: Goal[]): void {
    this.setState(
      {
        goals,
      },
      () => {
        this.updateIndexes();
      }
    );
  }
  /**
   * Resets the index number for each goal in the state Goal Array so they are sequential by the order in which they are in the array. This is called whenever you change the order (i.e. delete or add a goal)
   *
   * @returns void
   *
   */
  updateIndexes(): void {
    let updateGoals = this.state.goals.map((goalItem, index) => {
      goalItem.index = index;
      return goalItem;
    });
    this.setState({ goals: updateGoals }, () => {
      this.saveNote();
    });
  }
  /**
   * Sets the savings balance state and saves to the SN editor, called by Balance Component
   *
   * @param savingsBalance - The Balance you want to save
   * @returns void
   *
   */
  updateSavingsBalance(savingsBalance: number): void {
    this.setState(
      {
        savingsBalance,
      },
      () => {
        this.saveNote();
      }
    );
  }

  /**
   * Sets the view states for addGoal to true so the editor switches to the add goal view (and sets editGoal to false to be safe)
   *
   * @returns void
   *
   */
  onAddGoal(): void {
    this.setState({
      addGoal: true,
      editGoal: false,
    });
  }
  /**
   * Resets the addGoal/editGoal states so the view switches back to the main goal view
   *
   * @returns void
   *
   */
  onCancelAddGoal(): void {
    this.setState({
      addGoal: false,
      editGoal: false,
      editGoalID: "",
    });
  }
  /**
   * Sets the editGoal State and editGoalID so the view updates to the Goal Item view in edit mode
   *
   * @param goalID - The id of the Goal you wan to edit
   * @returns void
   *
   */
  editGoal(goalID: string): void {
    this.setState({
      addGoal: false,
      editGoal: true,
      editGoalID: goalID,
    });
  }
  /**
   * Depending on if editGoal is set to true, it either replaces the goal in the Goals state with the updated Goal values, or it adds a new goal to the Goals state. Then it will call saveNotes to write back to the editor (or updateIndexes > saveNotes in add mode)
   *
   * @param goal - The goal you are either editing or adding to the Goals Array
   * @returns void
   *
   */
  handleSubmitOfGoal(goal: Goal): void {
    if (this.state.editGoal) {
      let goals = this.state.goals;
      let index = goals.findIndex((x: Goal) => x.id === goal.id);
      goals.splice(index, 1, goal);
      this.setState({ goals, addGoal: false, editGoal: false }, () => {
        this.saveNote();
      });
    } else {
      this.setState(
        { goals: [...this.state.goals, goal], addGoal: false, editGoal: false },
        () => {
          this.updateIndexes();
        }
      );
    }
  }
  /**
   * Deletes a goal from the Goals state and calls saveNote to save back to the editor
   *
   * @param goalID - The ID of the goal you want to delete
   * @returns void
   *
   */
  deleteGoal(goalID: string) {
    let goals = this.state.goals;
    let index = goals.findIndex((x: Goal) => x.id === goalID);
    goals.splice(index, 1);
    this.setState({ goals }, () => {
      this.saveNote();
    });
  }

  render() {
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
