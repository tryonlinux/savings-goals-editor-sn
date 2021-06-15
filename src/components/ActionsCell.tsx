import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { TrashIcon, PencilIcon } from "@primer/octicons-react";

export interface ActionsCellProps {
  id: string;
  handleViewEdit: (text: string) => void;
  handleDelete: (text: string) => void;
}
export interface ActionsCellState {}

class ActionsCell extends React.Component<ActionsCellProps, ActionsCellState> {
  constructor(props: ActionsCellProps) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <Row>
          <Col xs={1}>
            <Button
              variant="link"
              onClick={() => this.props.handleViewEdit(this.props.id)}
            >
              <PencilIcon fill="#000" size={16} />
            </Button>
          </Col>
          <Col xs={1}>
            <Button
              variant="link"
              onClick={() => this.props.handleDelete(this.props.id)}
            >
              <TrashIcon fill="#000" size={16} />
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ActionsCell;
