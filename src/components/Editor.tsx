import React from "react";
import { Container } from "react-bootstrap";
import { EditorKit, EditorKitDelegate } from "sn-editor-kit";
import Goals from "./Goals";
export enum HtmlElementId {
  snComponent = "sn-component",
  textarea = "textarea",
}

export enum HtmlClassName {
  snComponent = "sn-component",
  textarea = "sk-input contrast textarea",
}

export interface EditorInterface {
  printUrl: boolean;
  text: string;
  goals: { id: string; itemGoalCost: number; name: string }[];
}

const initialState = {
  printUrl: false,
  text: "",
  goals: [
    { id: "1", itemGoalCost: 200, name: "Apple Watch" },
    { id: "2", itemGoalCost: 1200, name: "Macbook" },
    { id: "3", itemGoalCost: 45000, name: "Tesla" },
    { id: "4", itemGoalCost: 65000, name: "Addtion" },
  ],
};

let keyMap = new Map();

export default class Editor extends React.Component<{}, EditorInterface> {
  editorKit: any;

  constructor(props: EditorInterface) {
    super(props);
    this.configureEditorKit();
    this.state = initialState;
    this.updateGoals = this.updateGoals.bind(this);
  }

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

  updateGoals(goals: { id: string; itemGoalCost: number; name: string }[]) {
    this.setState({
      goals,
    });
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
          <Goals goals={this.state.goals} updateGoals={this.updateGoals} />
        </Container>

        {/* <p>
          Edit <code>src/components/Editor.tsx</code> and save to reload.
        </p>
        <p>
          Visit the{' '}
          <a
            href="https://docs.standardnotes.org/extensions/intro"
            target="_blank"
            rel="noopener noreferrer"
          >
            Standard Notes documentation
          </a>{' '}
          to learn how to work with the Standard Notes API or{' '}
          <a
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          .
        </p> */}

        {/*
        <textarea
          id={HtmlElementId.textarea}
          name="text"
          className={'sk-input contrast textarea'}
          placeholder="Type here. Text in this textarea is automatically saved in Standard Notes"
          rows={15}
          spellCheck="true"
          value={text}
          onBlur={this.onBlur}
          onChange={this.handleInputChange}
          onFocus={this.onFocus}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
        /> */}
      </div>
    );
  }
}
