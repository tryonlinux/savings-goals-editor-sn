import * as React from "react";
import { Card, Col, ProgressBar, Row } from "react-bootstrap";
import ActionsCell from "./ActionsCell";
export interface SavingsCardProps {
  index: number;
  id: string;
  bankBalance: number;
  itemGoalCost: number;
  name: string;
}

export interface SavingsCardState {}

class SavingsCard extends React.Component<SavingsCardProps, SavingsCardState> {
  constructor(props: SavingsCardProps) {
    super(props);
    this.state = {};
    this.handleDelete = this.handleDelete.bind(this);
    this.handleViewEdit = this.handleViewEdit.bind(this);
  }

  handleViewEdit(index: string) {
    alert(index);
  }
  handleDelete(index: string) {
    alert(index);
  }
  progressBarColor(percentage: number): string {
    if (percentage >= 100) {
      return "success";
    } else if (percentage >= 50 && percentage < 100) {
      return "warning";
    } else {
      return "danger";
    }
  }
  render() {
    const now = Math.round(
      (this.props.bankBalance / this.props.itemGoalCost) * 100
    );
    const progressInstance = (
      <ProgressBar
        max={100}
        now={now}
        label={`${now}%`}
        variant={this.progressBarColor(now)}
      />
    );

    return (
      <div>
        <Card body>
          <Card.Title>{this.props.name}</Card.Title>
          <Row>
            <Col sm={11}>{progressInstance}</Col>
            <Col sm={1}>
              <ActionsCell
                id={this.props.id}
                handleViewEdit={this.handleViewEdit}
                handleDelete={this.handleDelete}
              />
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

export default SavingsCard;
